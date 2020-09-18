import { getArgumentsAndOptions } from '../utils/message'
import { mountCommandHelpEmbed } from './help'
import { createOrUpdateGuild, getGuildOptions } from '../utils/mongoose'

/**
 * Configure the current guild on MongoDB.
 *
 * @param { import('discord.js').Message } message - Discord message object.
 * @returns {Promise<object>}
 */
export async function configGuild (message) {
  const { args, options } = getArgumentsAndOptions(message, '=')
  const arg = args[0]
  const validArgs = ['get', 'set']
  const validOptions = ['lang']
  const isValidArgs = validArgs.some(validArg => validArg === arg)
  const isValidOptions = Object.keys(options).every(option => validOptions.includes(option))
  if (!isValidArgs || !isValidOptions) {
    const helpEmbed = mountCommandHelpEmbed(message)
    return message.channel.send({ embed: helpEmbed })
  }
  const guildId = String(message.guild.id)
  if (arg === 'set') {
    const validLangs = ['en', 'pt']
    const isValidLang = validLangs.some(lang => options.lang === lang)
    if (!isValidLang) {
      return message.channel.send(`${options.lang} não é um idioma válido. Apenas "en" e "pt" estão disponíveis`)
    }
    await createOrUpdateGuild(guildId, options)
    const optionsText = Object.keys(options).map(option => `${option}: ${options[option]}`)
    return message.channel.send({
      embed: {
        title: 'Config applied correctly',
        description: optionsText.join('\n')
      }
    })
  }

  if (arg === 'get') {
    const [guildConfig] = await getGuildOptions(guildId)

    const guildConfigText = `lang: ${guildConfig.lang}`
    return message.channel.send({
      embed: {
        title: 'Your guild config',
        description: guildConfigText
      }
    })
  }
}
