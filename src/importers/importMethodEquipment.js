import axios from 'axios'
import { saveFile, openFile } from '../utils/files'
import items from '../../data/raw/cdn/items.json'
/**
 * Get and save equipment from Method API.
 *
 * @param {string} folder
 */
async function getEquipment (folder) {
  try {
    const langs = ['en', 'pt', 'fr', 'es']
    for (let langIndex = 0; langIndex < langs.length; langIndex++) {
      let results = []
      let skip = 0
      for (let rarity = 1; rarity <= 7; rarity++) {
        skip = 0

        const { data } = await axios.get(encodeURI(`https://builder.methodwakfu.com/mw-api/items?filters=[{"$filter":"level","values":[1,215]},{"$filter":"rarity","values":[${rarity}]}]&skip=${skip}&limit=20&lang=${langs[langIndex]}`))
        const { count, items: firstItems } = data
        results = [...results, ...firstItems]
        const numberOfSearchs = Math.ceil(count / 24) - 1
        for (let search = 1; search <= numberOfSearchs; search++) {
          skip = 24 * search
          const url = encodeURI(`https://builder.methodwakfu.com/mw-api/items?filters=[{"$filter":"level","values":[1,215]},{"$filter":"rarity","values":[${rarity}]}]&skip=${skip}&limit=20&lang=${langs[langIndex]}`)
          const { data: { items } } = await axios.get(url)
          results = [...results, ...items]
          console.log({ lang: langs[langIndex] }, { rarity }, { skip }, results.length)
        }
      }
      saveFile(results, `${folder}/methodEquipment_${langs[langIndex]}.json`)
    }
    return
  } catch (err) {
    console.error(err)
  }
}

/**
 * Get a list with all equipment id, title and rarity.
 *
 * @returns {object[]}
 */
async function getAllIds () {
  return items.map(item => item.definition.item.id)
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
 * Get equipment that are missing.
 * Method API has a bug on pagination where some equipment are repeated
 * and other don't are retrieved.
 * This function check which ones are missing and enrich the list with them.
 *
 * @param {object[]} equipmentList
 * @returns {Promise<string[]>}
 */
async function getMissingIds (equipmentList) {
  const ids = await getAllIds()
  const equipList = removeRepeated(equipmentList)
  const idEquipList = equipList.map(item => item.id)
  const missingIds = ids.filter(item => {
    return !idEquipList.includes(item)
  })
  console.log('Missing IDs quantity', missingIds.length)
  return missingIds
}

/**
 * Get equipments that are missing.
 *
 * @param {string} folder
 */
async function enrichEquipListWithMissingIds (folder) {
  const langs = ['en', 'pt', 'fr', 'es']
  const maxIdsPerUrl = 1000
  for (let langIndex = 0; langIndex < langs.length; langIndex++) {
    let equipmentList = openFile(`${folder}/methodEquipment_${langs[langIndex]}.json`)
    let missingIds = await getMissingIds(equipmentList)
    if (missingIds.length > maxIdsPerUrl) {
      missingIds.length = maxIdsPerUrl
    }
    while (missingIds.length) {
      let skip = 0
      let results = []
      const { data } = await axios.get(`https://builder.methodwakfu.com/mw-api/items?filters=[{"$filter":"ids","values":[${missingIds.join(',')}]}]&skip=${skip}&limit=20&lang=${langs[langIndex]}`)
      const { count, items: firstItems } = data
      results = [...results, ...firstItems]
      const numberOfSearchs = Math.ceil(count / 24) - 1
      for (let search = 1; search <= numberOfSearchs; search++) {
        skip = 24 * search
        const url = `https://builder.methodwakfu.com/mw-api/items?filters=[{"$filter":"ids","values":[${missingIds.join(',')}]}]&skip=${skip}&limit=20&lang=${langs[langIndex]}`
        const { data: { items } } = await axios.get(url)
        results = [...results, ...items]
        console.log({ lang: langs[langIndex] }, { skip }, results.length)
      }
      const finalList = removeRepeated([...equipmentList, ...results])
      console.log(finalList.length)
      saveFile(finalList, `${folder}/methodEquipment_${langs[langIndex]}.json`)
      equipmentList = openFile(`${folder}/methodEquipment_${langs[langIndex]}.json`)
      const previousMissingIdsQuantity = missingIds.length
      missingIds = await getMissingIds(finalList)
      if (missingIds.length > maxIdsPerUrl) {
        missingIds.length = maxIdsPerUrl
      }
      const hasSameMissingIdsQuantity = previousMissingIdsQuantity === missingIds.length
      if (hasSameMissingIdsQuantity) {
        break
      }
    }
  }
}
/**
 * Runs these scripts.
 *
 * @param {string} folder
 */
export async function importMethodEquipment (folder) {
  // console.log(openFile(`${folder}/methodEquipment_en.json`))
  await getEquipment(folder)
  await enrichEquipListWithMissingIds(folder)
}
