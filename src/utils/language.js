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
 * @param {object} config
 * @param {string} guildId
 * @returns {string}
 */
export function setLanguage (options, config, guildId) {
  const guildConfig = config.guildsOptions.find(config => config.id === guildId) || {}
  let lang = guildConfig.lang || config.defaultConfig.lang
  if (options.lang && isValidLang(options.lang)) {
    lang = options.lang
  }
  return lang
}
