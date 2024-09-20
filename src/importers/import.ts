import { performance } from 'perf_hooks';
import { openFile } from '../utils/files';
import Downloader from "./Downloader";
import ItemsGenerator from "./ItemsGenerator";
import RecipesGenerator from "./RecipesGenerator";
import ZenithParser from "./ZenithParser";

const downloadFolder = 'data/raw'
const generatedFolder = 'data/generated'

async function importData() {
  const startTime = performance.now();

  const lastImportedVersion = openFile(`${downloadFolder}/cdn/version.json`)
  const downloader = new Downloader(downloadFolder)
  const currentLiveVersion = await downloader.getWakfuCdnVersion()

  if (lastImportedVersion !== currentLiveVersion) {
    console.log('New version found: ', currentLiveVersion)
    await downloader.downloadAndSaveWakfuCdnData()
    await downloader.downloadSublimationDataFromZenith()
    // Zenith's API is giving us 500 for states
    // await downloader.downloadSublimationStatesFromZenith()
  }

  const recipesGenerator = new RecipesGenerator(downloadFolder, generatedFolder)
  recipesGenerator.combineAndSaveRecipes()
  const zenithParser = new ZenithParser(downloadFolder, generatedFolder)
  zenithParser.parseAndSaveZenithSublimations()
  const itemsGenerator = new ItemsGenerator(downloadFolder, generatedFolder)
  itemsGenerator.mountItems()

  const endTime = performance.now();
  const time = ((endTime - startTime) / 1000) / 60
  console.log(`Data importation took ${time.toFixed(2)} minutes.`);
}

importData()

