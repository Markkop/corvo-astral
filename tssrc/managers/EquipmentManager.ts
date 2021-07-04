import { hasTextOrNormalizedTextIncluded } from '@utils/strings'
import mappings from '@utils/mappings'
import str from '@stringsLang'
import { ItemData } from '@types'
const itemsData = require('../../data/generated/items.json')
const { equipTypesMap, rarityMap } = mappings

class EquipmentManager {
  private itemsList: ItemData[]
  private equipmentList: ItemData[]

  constructor () {
    this.itemsList = itemsData
    this.setEquipmentList()
  }

  private setEquipmentList () {
    const equipTypesIds = Object.keys(equipTypesMap).map(Number).filter(id => id !== 647) // Remove costumes
    this.equipmentList = this.itemsList
      .filter(item => equipTypesIds.includes(item.itemTypeId))
      .sort((itemA, itemB) => itemB.rarity - itemA.rarity)
  }

  public findEquipmentByName (query, options, lang) {
    const optionsKeys = Object.keys(options)
    const optionRarityKey = Object.values<string>(str.rarity).find(rarityWord => {
      return optionsKeys.some(optionsKey => hasTextOrNormalizedTextIncluded(rarityWord, optionsKey))
    })

    if (!optionRarityKey) {
      return this.equipmentList.filter(equip => hasTextOrNormalizedTextIncluded(equip.title[lang], query))
    }

    return this.equipmentList.filter(equip => {
      let filterAssertion = true
      const includeQuery = hasTextOrNormalizedTextIncluded(equip.title[lang], query)
      const rarityIdOption = this.getRarityIdByRarityNameInAnyLanguage(options[optionRarityKey])
      const hasRarity = rarityIdOption === equip.rarity
      filterAssertion = filterAssertion && hasRarity

      return includeQuery && filterAssertion
    })
  }

  // TO Do: move this function
  private getRarityIdByRarityNameInAnyLanguage (rarityName) {
    return Object.entries(rarityMap).reduce((idDetected, [rarityId, rarityDetails]) => {
      const names = Object.values(rarityDetails.name)
      return names.some(name => rarityName.toLowerCase() === name.toLowerCase()) ? Number(rarityId) : idDetected
    }, 0)
  }
}

const equipmentManager = new EquipmentManager()
export default equipmentManager
