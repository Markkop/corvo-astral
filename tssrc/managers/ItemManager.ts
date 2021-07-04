import { hasTextOrNormalizedTextIncluded } from '@utils/strings'
import str from '@stringsLang'
import { CommandOptions, ItemData, Language } from '@types'
import mappings from '@utils/mappings'
const { equipTypesMap, rarityMap } = mappings
const itemsData = require('../../data/generated/items.json')

class ItemManager {
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

  public getEquipmentByName(name: string, options: CommandOptions, lang: string) {
    return this.getItemByName(this.equipmentList, name, options, lang)
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

  // TO Do: move this function
  private getRarityIdByRarityNameInAnyLanguage (rarityName) {
    return Object.entries(rarityMap).reduce((idDetected, [rarityId, rarityDetails]) => {
      const names = Object.values(rarityDetails.name)
      return names.some(name => rarityName.toLowerCase() === name.toLowerCase()) ? Number(rarityId) : idDetected
    }, 0)
  }
}

const itemManager = new ItemManager()
export default itemManager
