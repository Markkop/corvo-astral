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
