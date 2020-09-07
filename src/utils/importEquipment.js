/* eslint-disable no-unused-vars */
import axios from 'axios'
import fs from 'fs'
import equipmentList from '../../data/equipment.json'

/**
 * Get and save to file equipament from an external api.
 */
async function getEquipment () {
  try {
    let results = []
    let skip = 0
    for (let rarity = 1; rarity <= 7; rarity++) {
      skip = 0
      const { data } = await axios.get(`https://builder.methodwakfu.com/mw-api/items/?filters={%22rarity%22:[${rarity}],%22typeId%22:[],%22level%22:[1,215],%22actionIds%22:[],%22skip%22:${skip},%22limit%22:24,%22upgrade%22:true}&lang=pt`)
      const { count, items: firstItems } = data
      results = [...results, ...firstItems]
      const numberOfSearchs = Math.ceil(count / 24) - 1
      for (let search = 1; search <= numberOfSearchs; search++) {
        skip = 24 * search
        const url = `https://builder.methodwakfu.com/mw-api/items/?filters={%22rarity%22:[${rarity}],%22typeId%22:[],%22level%22:[1,215],%22actionIds%22:[],%22skip%22:${skip},%22limit%22:24,%22upgrade%22:true}&lang=pt`
        const { data: { items } } = await axios.get(url)
        results = [...results, ...items]
        console.log({ rarity }, { skip }, results.length)
      }
    }

    fs.writeFileSync('data/equipment.json', JSON.stringify(results, null, 2))
  } catch (err) {
    console.error(err)
  }
}

/**
 * Get a list with all equipment id, title and rarity.
 *
 * @returns {object[]}
 */
async function getLightList () {
  const { data } = await axios.get('https://builder.methodwakfu.com/mw-api/items/lightlist?lang=pt')
  return data
}

/**
 * Return the same equipment list, but without repeated ids.
 *
 * @param {object[]} equipmentList
 * @returns {object[]}
 */
function removeRepeated (equipmentList) {
  return Array.from(new Set(equipmentList.map(equip => equip.id))).map(id => {
    return equipmentList.find(equip => equip.id === id)
  })
}

/**
 * Get equipment that are missing by id.
 *
 * @returns {string[]}
 */
async function getMissingIds () {
  const lightList = await getLightList()
  const idLightList = lightList.map(item => item.id)
  const equipList = removeRepeated(equipmentList)
  const idEquipList = equipList.map(item => item.id)
  const missingIds = idLightList.filter(item => {
    return !idEquipList.includes(item)
  })
  console.log('Missing IDs quantity', missingIds.length)
  return missingIds
}

/**
 * Get equipments that are missing.
 */
async function enrichEquipListWithMissingIds () {
  let skip = 0
  let results = []
  const missingIds = await getMissingIds()
  if (!missingIds.length) {
    return
  }
  const { data } = await axios.get(`https://builder.methodwakfu.com/mw-api/items/?filters={%22ids%22:[${missingIds.join(',')}],%22skip%22:${skip}}&lang=pt`)
  const { count, items: firstItems } = data
  results = [...results, ...firstItems]
  const numberOfSearchs = Math.ceil(count / 24) - 1
  for (let search = 1; search <= numberOfSearchs; search++) {
    skip = 24 * search
    const url = `https://builder.methodwakfu.com/mw-api/items/?filters={%22ids%22:[${missingIds.join(',')}],%22skip%22:${skip}}&lang=pt`
    const { data: { items } } = await axios.get(url)
    results = [...results, ...items]
    console.log({ skip }, results.length)
  }
  const finalList = removeRepeated([...equipmentList, ...results])
  console.log(finalList.length)
  fs.writeFileSync('data/equipment.json', JSON.stringify(finalList, null, 2))
}
