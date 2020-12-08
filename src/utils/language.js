import { getConfig } from './message'

/**
 * Check if the provided language string is valid.
 *
 * @param {string} lang
 * @returns {boolean}
 */
export function isValidLang (lang) {
  const validLangs = ['en', 'es', 'fr', 'pt']
  return validLangs.some(validLang => validLang === lang)
}

/**
 * Set language based on default values, guild setting or option value.
 *
 * @param {object} options
 * @param {string} guildId
 * @returns {string}
 */
export function setLanguage (options, guildId) {
  let lang = getConfig('lang', guildId)
  if (options.lang && isValidLang(options.lang)) {
    lang = options.lang
  }
  return lang
}

/**
 * Guess the language in a given text by comparing it with
 * the mapped texts from the Internacionalization strings
 * database (stringsLang.js file).
 *
 * @param {string} text - Text to have its languages guessed.
 * @param {string} strObject - The str object from 'stringsLang.js'.
 * @returns {'en'|'fr'|'es'|'pt'}
 */
export function guessLanguage (text, strObject) {
  return Object.entries(strObject).reduce((lang, [langEntry, nameEntry]) => {
    if (text.toLowerCase().includes(nameEntry.toLowerCase())) {
      return langEntry
    }
    return lang
  }, 'en')
}
