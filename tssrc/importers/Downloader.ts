import axios, { AxiosInstance } from 'axios'
import { saveFile } from '../utils/files'

export default class Downloader {
  private httpClient: AxiosInstance
  private wakfuCdnBaseUrl = 'https://wakfu.cdn.ankama.com/gamedata'
  private wakfuVersion: string
  private dataNames = [
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
  private downloadFolder: string

  constructor(downloadFolder) {
    this.httpClient = axios.create()
    this.downloadFolder = downloadFolder
  }

  public async getWakfuCdnVersion() {
    const { data: { version } } = await this.httpClient.get(`${this.wakfuCdnBaseUrl}/config.json`)
    return version
  }

  public async downloadAndSaveWakfuCdnData () {
    try {
      const version = await this.getWakfuCdnVersion()
      saveFile(version, `${this.downloadFolder}/cdn/version.json`)
      for (let index = 0; index < this.dataNames.length; index++) {
        console.log(`Fetching ${this.dataNames[index]}...`)
        const { data: responseData } = await this.httpClient.get(`${this.wakfuCdnBaseUrl}/${version}/${this.dataNames[index]}.json`)
        saveFile(responseData, `${this.downloadFolder}/cdn/${this.dataNames[index]}.json`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async downloadSublimationDataFromZenith() {
    try {
      const langs = ['en', 'pt', 'es', 'fr']
      for (let index = 0; index < langs.length; index++) {
        const lang = langs[index]
        const { data: zenithSublimation } = await this.httpClient.get('https://api.zenithwakfu.com/builder/api/shards', {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Cookie": `lang=${lang}`
          }
        })
        saveFile(zenithSublimation, `${this.downloadFolder}/zenith/zenithSublimation_${lang}.json`)
      }
    } catch (error) {
      console.log(error)
    }
  }
}