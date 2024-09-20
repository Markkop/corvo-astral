import { openFile, saveFile } from '../utils/files'

export default class ZenithParser {
  private langs = ['fr', 'en', 'pt', 'es']
  private rawSublimationsData
  private rawSublimationsStatesData
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
    this.rawSublimationsStatesData = openFile(`${rawFolderPath}/zenith/zenithSublimationStates.json`)
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
    return replacedText
  }

  private recursivelyAddItemTranslation(modifyArray, consultingArray) {
    if (!modifyArray.translations) {
      modifyArray.translations = []
    }

    if (!consultingArray.translations) {
      consultingArray.translations = []
    }

    consultingArray.forEach(consultingItem => {
      if (!consultingItem.translations) {
        return
      }

      const matchingItem = modifyArray.find(modifyItem => {
        const idProperty = Object.keys(consultingItem).find(prop => prop.includes('id_'))
        return modifyItem[idProperty] === consultingItem[idProperty]
      })

      if (!matchingItem) {
        return
      }


      if (consultingItem.translations) {
        matchingItem.translations.push(...consultingItem.translations)
      }

      Object.keys(consultingItem).forEach(key => {
        if (Array.isArray(consultingItem[key])) {
          this.recursivelyAddItemTranslation(matchingItem[key], consultingItem[key])
        }
      })
    })
  }

  private combineSublimationTranslations(sublimations) {
    return sublimations.reduce((combinedSublimations, languageSublimations) => {
      this.recursivelyAddItemTranslation(combinedSublimations, languageSublimations)
      return combinedSublimations
    }, sublimations[0])
  }

  private splitChildrenSublimations(sublimations) {
    return sublimations.reduce((splittedSublimations, sublimation) => {

      if (sublimation.children?.length) {
        sublimation.children.forEach((childSubli) => {
          childSubli.effects = sublimation.effects
          splittedSublimations.push(childSubli)
        })
      }

      splittedSublimations.push(sublimation)
      return splittedSublimations
    }, [])
  }

  private mapComputedEffectValues(values, level = null) {
    return values.reduce((valuesMapping, { ratio, damage }, index) => {
      let computedValue = damage ? `${ratio.toFixed(2)} + ${damage}` : ratio.toFixed(2)
      if (level) {
        computedValue = (ratio * level) + damage
      }
      return { ...valuesMapping, [`\\[#${index + 1}\\]`]: computedValue }
    }, {})
  }

  private removeCodesAndCharacters(text) {
    return text
      .replace(/\\n/g, '\n')
      .replace(/\n\n/g, '\n')
      .replace(/(<b>)|(<\/b>)/g, '')
      .trim()
  }

  private parseSublimationsText(sublimations, states) {
    return sublimations.map(subli => {
      const parsedSubliEffects = subli.effects.reduce((parsedEffects, effect) => {
        const effectValuesMapping = this.mapComputedEffectValues(effect.values, subli.level)

        const langs = ['fr', 'en', 'es', 'pt']
        langs.forEach(lang => {
          const translation = effect.translations.find(({ locale }) => locale === lang)
          const nameEffect = translation ? translation.value : effect.name_effect

          const effectText = this.replaceValueCodes(nameEffect, effectValuesMapping)
          parsedEffects[lang] = parsedEffects[lang] ? `${parsedEffects[lang]}\n${effectText}` : effectText

          const aditionalStateInfo = []
          effect.inner_states.forEach(state => {
            const innerStateTranslation = state.translations.find(({ locale }) => locale === lang)
            const nameInnerState = innerStateTranslation ? innerStateTranslation.value : state.name_state

            parsedEffects[lang] = parsedEffects[lang].replace(new RegExp(`\\[st${state.id_state}]`, 'g'), `**${nameInnerState}**`)

            const stateData = states.find(({ id_state }) => state.id_state === id_state)
            const stateDataInfo = stateData.effects.reduce((stateDataInfo, stateEffect) => {
              const stateEffectValuesMapping = this.mapComputedEffectValues(stateEffect.values)

              const stateEffectTranslation = stateEffect.translations.find(({ locale }) => locale === lang)
              const nameStateEffect = stateEffectTranslation ? stateEffectTranslation.value : stateEffect.name_effect

              return stateDataInfo + '\n' + this.replaceValueCodes(nameStateEffect, stateEffectValuesMapping)
            }, '')

            const stateInfo = `**${nameInnerState}**:${stateDataInfo}`
            aditionalStateInfo.push(stateInfo)
          })

          parsedEffects[lang] = `${parsedEffects[lang]}\n${aditionalStateInfo.join('\n')}`
          parsedEffects[lang] = this.removeCodesAndCharacters(parsedEffects[lang])
        })

        return parsedEffects
      }, {})
      return {
        ...subli,
        parsedEffects: parsedSubliEffects
      }
    })
  }

  public parseAndSaveZenithSublimations() {
    const combinedZenithStatesLanguages = this.combineSublimationTranslations(this.rawSublimationsStatesData)
    saveFile(combinedZenithStatesLanguages, `${this.generatedFolderPath}/zenithSublimationsStates.json`)

    const combinedTypeSublimations = this.combineSublimationsAndSpecialSublimations()
    const combinedLanguagesSublimations = this.combineSublimationTranslations(combinedTypeSublimations)
    const splittedChildrenSublimations = this.splitChildrenSublimations(combinedLanguagesSublimations)
    const parsedSublimationsText = this.parseSublimationsText(splittedChildrenSublimations, combinedZenithStatesLanguages)
    console.log(`Generated ${parsedSublimationsText.length} sublimations from Zenith`)
    saveFile(parsedSublimationsText, `${this.generatedFolderPath}/zenithSublimations.json`)
  }
}