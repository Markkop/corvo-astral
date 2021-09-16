import Downloader from "./Downloader";
import ItemsGenerator from "./ItemsGenerator";
import RecipesGenerator from "./RecipesGenerator";
import { openFile } from '../utils/files'
import ZenithParser from "./ZenithParser";

const downloadFolder = 'data/raw'
const generatedFolder = 'data/generated'

async function importData() {
  const lastImportedVersion = openFile(`${downloadFolder}/cdn/version.json`)
  const downloader = new Downloader(downloadFolder)
  const currentLiveVersion = await downloader.getWakfuCdnVersion()

  if (lastImportedVersion !== currentLiveVersion) {
    await downloader.downloadAndSaveWakfuCdnData()
    await downloader.downloadSublimationDataFromZenith()
  }

  const recipesGenerator = new RecipesGenerator(downloadFolder, generatedFolder)
  recipesGenerator.combineAndSaveRecipes()
  const zenithParser = new ZenithParser(downloadFolder, generatedFolder)
  zenithParser.parseAndSaveZenithSublimations()
  const itemsGenerator = new ItemsGenerator(downloadFolder, generatedFolder)
  itemsGenerator.mountItems()
}

importData()
