import axios from 'axios'
import { saveFile } from '../utils/files'

const baseUrl = 'https://wakfu.cdn.ankama.com/gamedata'

const dataNames = [
  'actions',
  'collectibleResources',
  'equipmentItemTypes',
  'harvestLoots',
  'itemProperties',
  'items',
  'jobsItems',
  'recipeCategories',
  'recipeIngredients',
  'recipeResults',
  'recipes',
  'resourceTypes',
  'resources',
  'states'
]

/**
 * Get Wakfu CDN files.
 * Reference: https://www.wakfu.com/en/forum/332-development/236779-json-data.
 *
 * @param {string} downloadFolder
 * @returns {Promise}
 */
export async function importWakfuCdnData (downloadFolder) {
  try {
    const { data: { version } } = await axios.get(`${baseUrl}/config.json`)
    for (let index = 0; index < dataNames.length; index++) {
      console.log(`Fetching ${dataNames[index]}...`)
      const { data: responseData } = await axios.get(`${baseUrl}/${version}/${dataNames[index]}.json`)
      saveFile(responseData, `${downloadFolder}/${dataNames[index]}.json`)
    }
  } catch (error) {
    console.log(error)
  }
}
