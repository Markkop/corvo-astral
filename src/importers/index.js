import { importWakfuCdnData } from './importWakfuCdnData'
import { mountItems } from './mountItems'
import getSublimations from './sublimations'
import { mountRecipes } from './mountRecipes'
import { importMethodEquipment } from './importMethodEquipment'

/**
 * Import and modify data consumed by Corvo Astral.
 */
async function importFiles () {
  try {
    const downloadFolder = 'data/raw'
    await importWakfuCdnData(`${downloadFolder}/cdn`)
    await importMethodEquipment(`${downloadFolder}/method`)
    await mountRecipes()
    await getSublimations()
    await mountItems()
  } catch (error) {
    console.log(error)
  }
}

importFiles()
