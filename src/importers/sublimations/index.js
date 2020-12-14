import { parseSublimationsToInput } from './parseSublimationsToInput'
import { getSublimationsEffects } from './getSublimationsEffects'
import getSublimationsDrops from './getSublimationsDrops'

/**
 * Get sublimations and enrich them with custom inputs,
 * method's effecst and wakfu's website drops.
 */
export default async function getSublimations () {
  parseSublimationsToInput()
  await getSublimationsEffects()
  await getSublimationsDrops()
}
