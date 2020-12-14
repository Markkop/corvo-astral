import { saveFile, openFile } from '../../utils/files'
import { scrapDropByTypeAndId } from '../../scrappers/drop'

/**
 * Execute this script.
 *
 */
export default async function scrapSublimations () {
  const enrichedSublimations = openFile('data/generated/sublimations/sublimationsWithMethodEffects.json')

  const langs = ['pt', 'en', 'es', 'fr']
  for (let index = 0; index < enrichedSublimations.length; index++) {
    const sublimation = enrichedSublimations[index]
    console.log(`Scrapping drop for ${sublimation.title.en} ${index + 1}/${enrichedSublimations.length}`)
    for (let langIndex = 0; langIndex < langs.length; langIndex++) {
      const lang = langs[langIndex]
      const drops = await scrapDropByTypeAndId(sublimation.id, 812, lang)

      if (!drops || !drops[0] || !drops[0].monster) {
        break
      }
      if (!enrichedSublimations[index].source.drop.monster) {
        enrichedSublimations[index].source.drop.monster = {}
      }
      enrichedSublimations[index].source.drop.monster[lang] = `${drops[0].monster} (${drops[0].dropChance})`
    }
    console.log(enrichedSublimations[index])
    console.log(enrichedSublimations[index].source.drop)
  }
  saveFile(enrichedSublimations, 'data/generated/sublimations/sublimationsDrops.json')
}
