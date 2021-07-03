import FinderCommand from './FinderCommand'
import EquipmentManager from '../resources/EquipmentManager'
import RecipesManager from '../resources/RecipesManager'
import { mountUrl } from '../utils/mountUrl'
import mappings from '../utils/mappings'
import str from '../stringsLang'
import { MessageEmbed } from 'discord.js'
const { rarityMap, equipTypesMap, iconCodeMap } = mappings

type EquipEmbed = Partial<MessageEmbed>

export default class EquipCommand extends FinderCommand {


  public async return() {
    const { args, options } = this.getArgumentsAndOptions(this.message)
    const query = args.join(' ').toLowerCase()

    if (!query) {
      return this.returnHelp()
    }

    const results = EquipmentManager.findEquipmentByName(query, options, this.lang)
    if (!results.length) {
      return this.returnNotFound()
    }

    this.translateCommand(options.translate)
    const equipEmbed = this.mountEquipEmbed(results)
    const sentMessage = await this.message.channel.send({ embed: equipEmbed })

    const reactions = ['💰']
    const recipesManager = new RecipesManager
    const recipes = recipesManager.getRecipesByProductedItemId(results[0].id) 
    if (recipes.length) {
      reactions.unshift('🛠️')
    }
    await this.reactToMessage(reactions, sentMessage)
    return sentMessage
  }


  private parseIconCodeToEmoji (text) {
    return text.split(/(\[.*?\])/).map(word => iconCodeMap[word] || word).join('')
  }

  private getMoreEquipmentText (results, resultsLimit) {
    let moreResultsText = ''
    if (results.length > resultsLimit) {
      const firstResults = results.slice(0, resultsLimit)
      const otherResults = results.slice(resultsLimit, results.length)
      moreResultsText = ` ${str.andOther[this.lang]} ${otherResults.length} ${str.results[this.lang]}`
      results = firstResults
    }
    return results.map(equip => `${equip.title[this.lang]} (${rarityMap[equip.rarity].name[this.lang]})`).join(', ').trim() + moreResultsText
  }

  private mountEquipEmbed(results) {
    const firstResult = results[0]
    const equipEmbed: EquipEmbed = {
      url: mountUrl(firstResult.id, firstResult.itemTypeId, this.lang),
      color: rarityMap[firstResult.rarity].color,
      title: `${rarityMap[firstResult.rarity].emoji} ${firstResult.title[this.lang]}`,
      description: `${firstResult.description[this.lang]}\nID: ${firstResult.id}`,
      thumbnail: { url: `https://static.ankama.com/wakfu/portal/game/item/115/${firstResult.imageId}.png` },
      fields: [
        {
          name: str.capitalize(str.level[this.lang]),
          value: firstResult.level,
          inline: true
        },
        {
          name: str.capitalize(str.type[this.lang]),
          value: equipTypesMap[firstResult.itemTypeId][this.lang],
          inline: true
        },
        {
          name: str.capitalize(str.rarity[this.lang]),
          value: rarityMap[firstResult.rarity].name[this.lang],
          inline: true
        }
      ]
    }
    if (firstResult.equipEffects.length) {
      equipEmbed.fields.push({
        name: str.capitalize(str.equipped[this.lang]),
        value: firstResult.equipEffects.map(effect => this.parseIconCodeToEmoji(effect.description[this.lang])).join('\n'),
        inline: false
      })
    }
    if (firstResult.useEffects.length) {
      equipEmbed.fields.push({
        name: str.capitalize(str.inUse[this.lang]),
        value: firstResult.useEffects.map(effect => this.parseIconCodeToEmoji(effect.description[this.lang])).join('\n'),
        inline: false
      })
    }
    const hasCondititions = Boolean(firstResult.conditions.description[this.lang])
    if (hasCondititions) {
      equipEmbed.fields.push({
        name: str.capitalize(str.conditions[this.lang]),
        value: firstResult.conditions.description[this.lang],
        inline: false
      })
    }
    const equipamentsFoundText = this.getMoreEquipmentText(results, 20)
    if (results.length > 1) {
      equipEmbed.footer = {
        text: `${str.capitalize(str.equipmentFound[this.lang])}: ${equipamentsFoundText}`
      }
    }
    return equipEmbed

  }

  // To Do: move this function to toher file
  private async reactToMessage (reactions, message) {
    for (let index = 0; index < reactions.length; index++) {
      await message.react(reactions[index])
    }
  }
}