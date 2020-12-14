import itemsData from '../../data/raw/cdn/items.json'
import recipesData from '../../data/generated/recipes'
import { saveFile } from '../utils/files'
import { parseEffect } from './parseEffect'
import sublimations from '../../data/generated/sublimations/sublimationsDrops.json'
import fs from 'fs'

const equipmentList = {
  en: JSON.parse(fs.readFileSync('data/raw/method/methodEquipment_en.json')),
  es: JSON.parse(fs.readFileSync('data/raw/method/methodEquipment_es.json')),
  fr: JSON.parse(fs.readFileSync('data/raw/method/methodEquipment_fr.json')),
  pt: JSON.parse(fs.readFileSync('data/raw/method/methodEquipment_pt.json'))
}

/**
 * Parse slot numbers to text.
 *
 * @param {number[]} slotsArray
 * @returns {string}
 */
function parseSlots (slotsArray) {
  const slotMap = {
    1: 'R',
    2: 'G',
    3: 'B'
  }
  return slotsArray.reduce((slots, slot) => {
    return `${slots}${slotMap[slot]}`
  }, '')
}

/**
 * Check if the given object has any truthy property.
 *
 * @param {object} obj
 * @returns {boolean}
 */
function hasInfo (obj) {
  return obj && Object.keys(obj).some(key => Boolean(obj[key]))
}

/**
 * Parses sublimation source information to a single line of text.
 *
 * @param {object} sublimationData
 * @returns {object}
 */
function parseSublimationSource (sublimationData) {
  const langs = ['en', 'pt', 'fr', 'es']
  const stelesWord = {
    en: 'steles',
    es: 'steles',
    fr: 'steles',
    pt: 'estelas'
  }
  const sources = {
    en: [],
    es: [],
    fr: [],
    pt: []
  }
  langs.forEach(lang => {
    if (!sublimationData.source) {
      console.log(sublimationData)
    }
    const monster = sublimationData.source.drop.monster
    const steles = sublimationData.source.drop.steles
    const stelesText = steles ? `(${steles} ${stelesWord[lang]})` : ''
    if (hasInfo(monster)) {
      sources[lang].push(`${monster[lang]} ${stelesText}`)
    }
    const chest = sublimationData.source.chest
    if (hasInfo(chest)) {
      sources[lang].push(chest[lang])
    }

    const recipe = recipesData.find(recipe => recipe.result.productedItemId === sublimationData.id)
    if (recipe) {
      const job = recipe.job.title[lang]
      const level = recipe.level
      sources[lang].push(`${job} ${level} craft`)
    }
    const quest = sublimationData.source.quest
    if (hasInfo(quest)) {
      sources[lang].push(quest[lang])
    }
    sources[lang] = sources[lang].join(', ')
  })

  return sources
}

/**
 * Builds items with data from wakfu cdn and method.
 */
export function mountItems () {
  console.log(`Mounting ${itemsData.length} items`)
  const mountedItems = itemsData.map(itemData => {
    const mappedItem = {}
    const itemDefinition = itemData.definition.item
    let itemLevel = itemDefinition.level
    const itemTypeId = itemDefinition.baseParameters.itemTypeId
    const isPetOrMount = itemTypeId === 611 || itemTypeId === 582
    if (isPetOrMount) {
      itemLevel = 50
    }
    const isMakabraItem = itemLevel === 0 && !isPetOrMount
    if (isMakabraItem) {
      itemLevel = 100
    }
    const useParameters = itemDefinition.useParameters
    const equipEffects = itemData.definition.equipEffects
      .map(equipEffect => parseEffect(equipEffect.effect, itemLevel))
      .filter(equipEffect => equipEffect.description)
    const useEffects = itemData.definition.useEffects
      .map(useEffect => parseEffect(useEffect.effect, itemLevel))
      .filter(equipEffect => equipEffect.description)

    mappedItem.id = itemDefinition.id
    mappedItem.title = itemData.title
    mappedItem.description = itemData.description
    mappedItem.level = itemLevel
    mappedItem.useEffects = useEffects
    mappedItem.equipEffects = equipEffects
    mappedItem.useParameters = {
      useCostAp: useParameters.useCostAp,
      useCostMp: useParameters.useCostMp,
      useCostWp: useParameters.useCostWp
    }
    mappedItem.imageId = itemDefinition.graphicParameters.gfxId
    mappedItem.itemTypeId = itemDefinition.baseParameters.itemTypeId
    mappedItem.itemSetId = itemDefinition.baseParameters.itemSetId
    mappedItem.rarity = itemDefinition.baseParameters.rarity

    // Enrich conditions information
    mappedItem.conditions = {}
    mappedItem.conditions.description = {}
    const langs = ['en', 'pt', 'fr', 'es']
    langs.forEach(lang => {
      const equip = equipmentList[lang].find(equip => equip.id === itemDefinition.id)
      if (!equip) {
        return
      }
      mappedItem.conditions.criteria = equip.conditions.criteria
      mappedItem.conditions.description = {
        ...mappedItem.conditions.description,
        [lang]: equip.conditions.description[0]
      }
    })

    // Enrich sublimations information
    const sublimation = sublimations.find(subli => subli.id === itemData.definition.item.id)
    if (!sublimation && Array.isArray(itemDefinition.sublimationParameters && itemDefinition.sublimationParameters.slotColorPattern)) {
      console.log('A sublimation item was not found in sublimation list:', { name: itemData.title.en, id: itemDefinition.id })
    }

    if (sublimation) {
      mappedItem.sublimation = {}
      const slots = parseSlots(itemDefinition.sublimationParameters.slotColorPattern)
      if (slots) {
        mappedItem.sublimation.slots = slots
      } else {
        const { isEpic, isRelic } = itemDefinition.sublimationParameters
        mappedItem.sublimation.slots = isEpic ? 'epic' : (isRelic ? 'relic' : '')
      }
      delete mappedItem.sublimation.slotColorPattern
      mappedItem.sublimation.effects = sublimation.effects
      mappedItem.sublimation.source = parseSublimationSource(sublimation)
    }
    return mappedItem
  })
  saveFile(mountedItems, 'data/generated/items.json')
}
