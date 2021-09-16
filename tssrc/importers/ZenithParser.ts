import { saveFile, openFile } from '../utils/files'

// I'm not THAT proud of this code, but it works
export default class ZenithParser {
  private rawSublimationsData
  private langs = ['pt', 'en', 'fr', 'es']
  private generatedFolderPath

  constructor(rawFolderPath: string, generatedFolderPath: string) {
    this.loadRawSublimationsData(rawFolderPath)
    this.generatedFolderPath = generatedFolderPath
  }

  private loadRawSublimationsData(rawFolderPath: string) {
    const rawSublimationsData = this.langs.map(lang => {
      return openFile(`${rawFolderPath}/zenith/zenithSublimation_${lang}.json`)
    })

    this.rawSublimationsData = rawSublimationsData
  }

  private combineSublimationsAndSpecialSublimations() {
    return this.rawSublimationsData.map(subliData => {
      return [...subliData.sublimations, ...subliData.special_sublimations]
    })
  }

  private replaceValueCodes(text, mapping) {
    const codes = Object.keys(mapping)
    let replacedText = text
    codes.forEach(code => {
      const regex = new RegExp(code, 'g')
      replacedText = replacedText.replace(regex, mapping[code])
    })

    replacedText = replacedText.replace(/(<b>)|(<\/b>)/g, '')
    return replacedText
  }

  private combineSublimationsLanguages(sublimations) {
    return sublimations.reduce((combinedSublimations, languageSublimations) => {
      languageSublimations.forEach(languageSublimation => {
        const matchingSublimation = combinedSublimations.find(combinedSubli => {
          return combinedSubli.id_shard === languageSublimation.id_shard
        })

        matchingSublimation.effects.forEach(effect => {
          const existingLangs = effect.lang
            if (!existingLangs) {
              effect.lang = {}
            }

            const translation = languageSublimation.effects[0].translations[0]
            effect.lang = {
              ...effect.lang,
              [translation?.locale || 'fr']: translation?.value || effect.name_effect
            }

            effect.inner_states.forEach(state => {
              const existingStateLangs = state.lang
              if (!existingStateLangs) {
                state.lang = {}
              }
  
              const stateTranslation = languageSublimation.effects[0].inner_states[0].translations[0]
              state.lang = {
                ...state.lang,
                [stateTranslation?.locale || 'fr']: stateTranslation?.value || state.name_state
              }
            })
          })
        })

      return combinedSublimations
    }, sublimations[0])
  }

  private splitChildrenSublimations(sublimations) {
    return sublimations.reduce((splittedSublimations, sublimation) => {
      
      if (sublimation.children?.length) {
        sublimation.children.forEach((childSubli, index) => {
          childSubli.effects = [sublimation.effects[index + 1] || sublimation.effects[0]]
          splittedSublimations.push(childSubli)
        })
      }
      
      splittedSublimations.push(sublimation)
      return splittedSublimations
    }, [])
  }

  private parseSublimationsText(sublimations) {
    return sublimations.map(subli => {
      const parsedSubliEffects = subli.effects.map(effect => {
        const effectValuesMapping = effect.values.reduce((valuesMapping, value, index) => ({
          ...valuesMapping,
          [`\\[#${index + 1}\\]`]: (value.ratio * subli.level) + value.damage
        }), {})

        const parsedLangs = Object.keys(effect.lang).reduce((parsedLangs, lang) => {
          parsedLangs[lang] = this.replaceValueCodes(effect.lang[lang], effectValuesMapping).replace(/\\n/g, '\n').replace(/\n\n/g, '\n')
          effect.inner_states.forEach(state => {
            parsedLangs[lang] = parsedLangs[lang].replace(new RegExp(`\\[st${state.id_state}]`, 'g'), state.lang[lang])
          })
          return parsedLangs
        }, {})



        return {
          ...effect,
          lang: parsedLangs
        }
      })
      return { 
        ...subli,
        effects: parsedSubliEffects
      }
    })
  }

  public parseAndSaveZenithSublimations() {
    const combinedTypeSublimations = this.combineSublimationsAndSpecialSublimations()
    const combinedLanguagesSublimations = this.combineSublimationsLanguages(combinedTypeSublimations)
    const splittedChildrenSublimations = this.splitChildrenSublimations(combinedLanguagesSublimations)
    const parsedSublimationsText = this.parseSublimationsText(splittedChildrenSublimations)
    console.log(`Generated ${parsedSublimationsText.length} sublimations from Zenith`)
    saveFile(parsedSublimationsText, `${this.generatedFolderPath}/zenithSublimations.json`)
  }
}