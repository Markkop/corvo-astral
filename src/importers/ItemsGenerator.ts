import { saveFile, openFile } from '../utils/files'
import { parseEffect } from './parseEffect'

export default class ItemsGenerator {
  private itemsData
  private recipesData
  private generatedFolderPath

  constructor(rawFolderPath: string, generatedFolderPath: string) {
    this.itemsData = openFile(`${rawFolderPath}/cdn/items.json`)
    this.generatedFolderPath = generatedFolderPath
    this.recipesData = openFile(`${generatedFolderPath}/recipes.json`)
  }

  parseSlots (slotsArray) {
    const slotMap = {
      1: 'R',
      2: 'G',
      3: 'B'
    }
    return slotsArray.reduce((slots, slot) => {
      return `${slots}${slotMap[slot]}`
    }, '')
  }

  hasInfo (obj) {
    return obj && Object.keys(obj).some(key => Boolean(obj[key]))
  }

  parseSublimationSource (sublimationData) {
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
      const steles = sublimationData.source.drop.steles
      const stelesText = steles ? `(${steles} ${stelesWord[lang]})` : ''
      const chest = sublimationData.source.chest
      if (this.hasInfo(chest)) {
        sources[lang].push(chest[lang])
      }

      const recipe = this.recipesData.find(recipe => recipe.result.productedItemId === sublimationData.id)
      if (recipe) {
        const job = recipe.job.title[lang]
        const level = recipe.level
        sources[lang].push(`${job} ${level} craft`)
      }
      const quest = sublimationData.source.quest
      if (this.hasInfo(quest)) {
        sources[lang].push(quest[lang])
      }
      sources[lang] = sources[lang].join(', ')
    })

    return sources
  }

  mountItems () {
    console.log(`Mounting ${this.itemsData.length} items`)
    const mountedItems = this.itemsData.map((itemData, index) => {
      if ((index + 1) % 750 === 0) {
        console.log(`Mounting item ${index + 1} from ${this.itemsData.length}`)
      }
      const mappedItem = {} as any
      const itemDefinition = itemData.definition.item
      let itemLevel = itemDefinition.level

      // Set item level
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

      // Parse effect codes to values
      const equipEffects = itemData.definition.equipEffects
        .map(equipEffect => parseEffect(equipEffect.effect, itemLevel))
        .filter(equipEffect => equipEffect.description)
      const useEffects = itemData.definition.useEffects
        .map(useEffect => parseEffect(useEffect.effect, itemLevel))
        .filter(useEffect => useEffect.description)

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

      // Enrich sublimations information
      const isSublimation = itemTypeId === 812
      if (isSublimation) {
        mappedItem.sublimation = {}

        // Slots
        const slots = this.parseSlots(itemDefinition.sublimationParameters.slotColorPattern)
        if (slots) {
          mappedItem.sublimation.slots = slots
        } else {
          const { isEpic, isRelic } = itemDefinition.sublimationParameters
          mappedItem.sublimation.slots = isEpic ? 'epic' : (isRelic ? 'relic' : '')
        }
        delete mappedItem.sublimation.slotColorPattern

        // Text Effects
        const zenithSublimations = openFile(`${this.generatedFolderPath}/zenithSublimations.json`)
        const zenithSublimation = zenithSublimations.find(subli => {
          return subli.id_shard === mappedItem.id
        })
        if (zenithSublimation) {
          mappedItem.sublimation.effects = zenithSublimation.effects[0].lang
        }

      }
      return mappedItem
    })
    console.log('Saving items.json file...')
    saveFile(mountedItems, `${this.generatedFolderPath}/items.json`)
    console.log('items.json file saved!')
  }

}