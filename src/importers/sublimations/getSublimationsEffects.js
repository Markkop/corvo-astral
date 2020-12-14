import { saveFile, openFile } from '../../utils/files'
import axios from 'axios'

/**
 * Execute this script.
 */
export async function getSublimationsEffects () {
  const sublimations = openFile('data/raw/sublimations/sublimations.json')

  const sublimationsWithMethodEffects = []
  const langs = ['pt', 'en', 'es', 'fr']
  for (let langIndex = 0; langIndex < langs.length; langIndex++) {
    const lang = langs[langIndex]
    const url = `https://builder.methodwakfu.com/mw-api/enchant/sublimations?lang=${lang}`
    console.log(`Getting effects on ${url}`)
    const { data: sublimationsLang } = await axios.get(url)
    sublimationsLang.forEach((subli, index) => {
      const id = subli.id
      const effects = subli.effects.map(eff => eff.descriptions.join(' ')).join(', ')
      if (sublimationsWithMethodEffects[index]) {
        sublimationsWithMethodEffects[index].effects[lang] = effects
      } else {
        const sublimation = { id: 0, effects: {} }
        sublimation.id = id
        sublimation.effects[lang] = effects
        sublimationsWithMethodEffects.push(sublimation)
      }
    })
  }
  const enrichedSublimarions = []
  sublimations.forEach(rawSubli => {
    const subliWithMethodEffect = sublimationsWithMethodEffects.find(subliWithMethodEffect => subliWithMethodEffect.id === rawSubli.id)
    if (!subliWithMethodEffect) {
      console.log(`${rawSubli.title.en} (${rawSubli.id}) not found on sublimations with effects from Method`)
      enrichedSublimarions.push(rawSubli)
      return
    }
    const langs = Object.keys(subliWithMethodEffect.effects)
    langs.forEach(lang => {
      if (rawSubli.effects[lang]) return
      rawSubli.effects[lang] = subliWithMethodEffect.effects[lang]
    })
    enrichedSublimarions.push(rawSubli)
  })
  saveFile(enrichedSublimarions, 'data/generated/sublimations/sublimationsWithMethodEffects.json')
}
