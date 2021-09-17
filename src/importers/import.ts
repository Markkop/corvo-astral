import Downloader from "./Downloader";
import ItemsGenerator from "./ItemsGenerator";
import RecipesGenerator from "./RecipesGenerator";
import { openFile } from '../utils/files'
import ZenithParser from "./ZenithParser";
import { performance } from 'perf_hooks'

const downloadFolder = 'data/raw'
const generatedFolder = 'data/generated'

async function importData() {
  const t0 = performance.now();

  const lastImportedVersion = openFile(`${downloadFolder}/cdn/version.json`)
  const downloader = new Downloader(downloadFolder)
  const currentLiveVersion = await downloader.getWakfuCdnVersion()

  if (lastImportedVersion !== currentLiveVersion) {
    await downloader.downloadAndSaveWakfuCdnData()
    await downloader.downloadSublimationDataFromZenith()
    await downloader.downloadSublimationStatesFromZenith()
  }

  const recipesGenerator = new RecipesGenerator(downloadFolder, generatedFolder)
  recipesGenerator.combineAndSaveRecipes()
  const zenithParser = new ZenithParser(downloadFolder, generatedFolder)
  zenithParser.parseAndSaveZenithSublimations()
  const itemsGenerator = new ItemsGenerator(downloadFolder, generatedFolder)
  itemsGenerator.mountItems()

  const t1 = performance.now();
  const time = ((t1 - t0) / 1000) / 60
  console.log(`Data importation took ${time.toFixed(2)} minutes.`);
}

importData()

