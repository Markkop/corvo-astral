import { hasTextOrNormalizedTextIncluded } from '@utils/strings'
import str from '@stringsLang'
import { CommandOptions, ItemData, LanguageStrings } from '@types'
import mappings from '@utils/mappings'
import MessageManager from './MessageManager'
import { MessageReaction, MessageEmbed } from 'discord.js'
import { RecipesManager } from '@managers'
const { equipTypesMap, rarityMap } = mappings
const itemsData = require('../../data/generated/items.json')

class ItemManager {
  private itemsList: ItemData[]
  private equipmentList: ItemData[]
  private sublimationList: ItemData[]

  constructor () {
    this.itemsList = itemsData
    this.setEquipmentList()
    this.setSublimationList()
  }

  private setEquipmentList () {
    const equipTypesIds = Object.keys(equipTypesMap).map(Number).filter(id => id !== 647) // Remove costumes
    this.equipmentList = this.itemsList
      .filter(item => equipTypesIds.includes(item.itemTypeId))
      .sort((itemA, itemB) => itemB.rarity - itemA.rarity)
  }

  private setSublimationList () {
    this.sublimationList = this.itemsList
      .filter(item => Boolean(item.sublimation))
      .sort((itemA, itemB) => itemA.title.en.localeCompare(itemB.title.en))
  }

  public getItemByName (itemList: ItemData[], name: string, options: CommandOptions, lang: string) {
    const optionsKeys = Object.keys(options)
    const optionRarityKey = Object.values<string>(str.rarity).find(rarityWord => {
      return optionsKeys.some(optionsKey => hasTextOrNormalizedTextIncluded(rarityWord, optionsKey))
    })

    if (!optionRarityKey) {
      return itemList.filter(equip => hasTextOrNormalizedTextIncluded(equip.title[lang], name))
    }

    return itemList.filter(equip => {
      let filterAssertion = true
      const includeName = hasTextOrNormalizedTextIncluded(equip.title[lang], name)
      const rarityIdOption = this.getRarityIdByRarityNameInAnyLanguage(options[optionRarityKey])
      const hasRarity = rarityIdOption === equip.rarity
      filterAssertion = filterAssertion && hasRarity

      return includeName && filterAssertion
    })
  }

  public getItemById(id: number) {
    return this.itemsList.find(equip => equip.id === id)
  }

  public getEquipmentByName(name: string, options: CommandOptions, lang: string) {
    return this.getItemByName(this.equipmentList, name, options, lang)
  }

  public getSublimationByName (name: string, options: CommandOptions, lang: string) {
    name = name.replace(/2|ll/g, 'ii').replace(/3|lll/g, 'iii')
    return this.getItemByName(this.sublimationList, name, options, lang)
  }

  public getSublimationBySource (source: string, lang: string) {
    return this.sublimationList.filter(subli => {
      const subliTitle = (subli.sublimation.source && subli.sublimation.source[lang]) || ''
      return hasTextOrNormalizedTextIncluded(subliTitle.toLowerCase(), source)
    })
  }

  private removeNumberFromTitle(title: LanguageStrings): LanguageStrings {
    return Object.keys(title).reduce((titles, lang) => {
      titles[lang] = title[lang].replace(/(IV|III|II|I)$/, '').trim()
      return titles
    }, {} as LanguageStrings)
  }

  private removeSameSublimationsAndRemoveNumberFromTitle(results: ItemData[]): ItemData[] {
    return results.reduce((noRepeatedResults, result) => {
      const hasRepeated = noRepeatedResults.some(noRepeatedResult => {
        return result.title.en.includes(noRepeatedResult.title.en)
      })
      if (hasRepeated) {
        return noRepeatedResults
      }

      noRepeatedResults.push({
        ...result,
        title: this.removeNumberFromTitle(result.title)
      })
      return noRepeatedResults
    }, [])
  }

  public getSublimationByMatchingSlots (query: string) {
    const isFourSlotsCombination = query.length === 4 && query !== 'epic'
    const regexQuery = new RegExp(query.replace(/w/g, '[r|g|b]{1}'))
    if (isFourSlotsCombination) {
      const firstCombination = query.slice(0, 3)
      const secondCombination = query.slice(1, 4)
      const firstCombinationRegex = new RegExp(firstCombination.replace(/w/g, '[r|g|b]{1}'))
      const secondCombinationRegex = new RegExp(secondCombination.replace(/w/g, '[r|g|b]{1}'))
      const firstCombinationResults = this.sublimationList.filter(item => firstCombinationRegex.test(item.sublimation.slots.toLowerCase()))
      const secondCombinationResults = this.sublimationList.filter(item => {
        const isRepeated = firstCombinationResults.includes(item)
        const matchesCombination = secondCombinationRegex.test(item.sublimation.slots.toLowerCase())
        return matchesCombination && !isRepeated
      })
      return [...firstCombinationResults, ...secondCombinationResults]
    }
    return this.sublimationList.filter(item => regexQuery.test(item.sublimation.slots.toLowerCase()))
  }

  public getSublimations (query, options, hasAnyOrderArgument, lang) {
    const isSearchBySlot = /[rgbw][rgbw][rgbw]?[rgbw]|epic|relic/.test(query)
    let results = []
    let foundBy = ''
  
    if (isSearchBySlot && hasAnyOrderArgument) {
      const queryPermutation = this.findPermutations(query)
      queryPermutation.forEach((queryPerm) => {
        const permutatedResults = this.getSublimationByMatchingSlots(queryPerm)
        results.push({
          slots: queryPerm,
          results: this.removeSameSublimationsAndRemoveNumberFromTitle(permutatedResults)
        })
      })
  
      return { results, foundBy: 'permutatedSlots' }
    }
  
    if (isSearchBySlot) {
      results = this.getSublimationByMatchingSlots(query)
      foundBy = 'slots'
      return { 
        results: this.removeSameSublimationsAndRemoveNumberFromTitle(results), 
        foundBy 
      }
    }
  
    results = this.getSublimationByName(query, options, lang)
    foundBy = 'name'
  
    if (results.length) {
      return { results, foundBy }
    }
  
    results = this.getSublimationBySource(query, lang)
    foundBy = 'source'
    return { results, foundBy }
  }

  // Check if this method should be here in this class
  public async enrichItemMessage (reaction: MessageReaction) {
    const reactionEmbed = reaction.message.embeds[0]
    if (!reactionEmbed) return

    const levelField = reactionEmbed.fields.find(field => !/\D/.test(field.value))
    const levelName = levelField.name || ''
    const lang = MessageManager.guessLanguage(levelName, str.level)
    const id = Number(reactionEmbed.description.split('ID: ')[1])
  
  
    if (reaction.emoji.name === '🛠️') {
      const hasRecipeField = reactionEmbed.fields.some(field => {
        return Object.values(str.job).some(jobName => jobName === field.name.toLowerCase())
      })
      if (hasRecipeField) return
  
      const recipes = RecipesManager.getRecipesByProductedItemId(id)
      if (!recipes.length) return
  
      const recipeFields = RecipesManager.getRecipeFields(recipes, lang)
      reactionEmbed.fields = [
        ...reactionEmbed.fields,
        ...recipeFields
      ]
    }
    const newEmbed = new MessageEmbed(reactionEmbed)
    await reaction.message.edit(newEmbed)
  }

  // TO Do: move the following functions 
  private getRarityIdByRarityNameInAnyLanguage (rarityName) {
    return Object.entries(rarityMap).reduce((idDetected, [rarityId, rarityDetails]) => {
      const names = Object.values(rarityDetails.name)
      return names.some(name => rarityName.toLowerCase() === name.toLowerCase()) ? Number(rarityId) : idDetected
    }, 0)
  }

  private findPermutations (string: string) {
    if (!string || typeof string !== 'string' || string.length > 4) {
      return []
    } else if (string.length < 2) {
      return [string]
    }
  
    const permutationsArray = []
  
    for (let i = 0; i < string.length; i++) {
      const char = string[i]
  
      if (string.indexOf(char) !== i) { continue }
  
      const remainingChars = string.slice(0, i) + string.slice(i + 1, string.length)
  
      for (const permutation of this.findPermutations(remainingChars)) {
        permutationsArray.push(char + permutation)
      }
    }
    return permutationsArray
  }
}

const itemManager = new ItemManager()
export default itemManager
