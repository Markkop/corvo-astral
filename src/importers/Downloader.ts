import axios, { AxiosInstance } from 'axios'
import { openFile, saveFile } from '../utils/files'

export default class Downloader {
  private httpClient: AxiosInstance
  private wakfuCdnBaseUrl = 'https://wakfu.cdn.ankama.com/gamedata'
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

  private getStates(sublimations) {
    return sublimations.reduce((states, sublimation) => {
      sublimation.effects.forEach(effect => {
        effect.inner_states.forEach(({ id_state }) => {
          if (states.indexOf(id_state) <= -1) {
            states.push(id_state)
          }
        })
      })
      return states
    }, [])
  }

  public async downloadSublimationStatesFromZenith() {
    const langs = ['fr', 'pt', 'es', 'en']
    try {
      const { sublimations, special_sublimations} = openFile(`${this.downloadFolder}/zenith/zenithSublimation_en.json`)
      const states = this.getStates([...sublimations, ...special_sublimations])
      console.log(`Getting ${states.length} zenith states for each language...`)
      const zenithStates = []
      for (let index = 0; index < langs.length; index++) {
        const lang = langs[index]
        const langStates = []
        for (let index = 0; index < states.length; index++) {
          const state = states[index];
          const { data: zenithState } = await this.httpClient.get(`https://api.zenithwakfu.com/builder/api/state/${state}`, {
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "Cookie": `lang=${lang}`
            }
          })
          langStates.push(zenithState)
        }
        zenithStates.push(langStates)
      }
      console.log(`Saving zenith states...`)
      saveFile(zenithStates, `${this.downloadFolder}/zenith/zenithSublimationStates.json`)
    } catch (error) {
      console.log(error)
    }
  }
}