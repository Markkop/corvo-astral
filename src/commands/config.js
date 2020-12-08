import { getArgumentsAndOptions } from '../utils/message'
import { isValidLang } from '../utils/language'
import { mountCommandHelpEmbed } from './help'
import { createOrUpdateGuild, getGuildOptions } from '../utils/mongoose'
import config from '../config'

/**
 * Mount config embed message.
 *
 * @param {string} title
 * @param {object} config
 * @returns {object}
 */
function mountConfigEmbed (title, config) {
  const guildConfigText = JSON.stringify(config, null, 2)
  return {
    title,
    description: '```json\n' + guildConfigText + '\n```'
  }
}

/**
 * Set config command.
 *
 * @param {object} message
 * @param {string} guildId
 * @param {object} options
 * @returns {object}
 */
async function setConfig (message, guildId, options) {
  const guildConfig = config.guildsOptions.find(config => config.id === message.guild.id)

  if (guildConfig) {
    const guildConfigIndex = config.guildsOptions.indexOf(guildConfig)
    const newOptions = Object.assign(guildConfig, options)
    const response = await createOrUpdateGuild(guildId, newOptions)
    config.guildsOptions[guildConfigIndex] = response
    return options
  }

  const response = await createOrUpdateGuild(guildId, options)
  config.guildsOptions.push(response)
  return response
}

/**
 * Configure the current guild on MongoDB.
 *
 * @param { import('discord.js').Message } message - Discord message object.
 * @returns {Promise<object>}
 */
export async function configGuild (message) {
  try {
    const { args, options } = getArgumentsAndOptions(message, '=')
    const arg = args[0]
    const validArgs = ['get', 'set']
    const validOptions = ['lang', 'almanaxChannel', 'partyChannel', 'buildPreview']
    const isValidArgs = validArgs.some(validArg => validArg === arg)
    const isValidOptions = Object.keys(options).every(option => validOptions.includes(option))

    if (!isValidArgs || !isValidOptions) {
      const helpEmbed = mountCommandHelpEmbed(message, 'en')
      return message.channel.send({ embed: helpEmbed })
    }
    const guildId = String(message.guild.id)
    if (arg === 'set') {
      if (!message.member.hasPermission('ADMINISTRATOR')) {
        return message.channel.send('You need administrator permission for this')
      }

      if (options.lang && !isValidLang(options.lang)) {
        return message.channel.send(`${options.lang} is not a valid language.`)
      }

      const config = await setConfig(message, guildId, options)
      const configEmbed = mountConfigEmbed('Config updated', config)
      return message.channel.send({ embed: configEmbed })
    }

    const guildConfig = await getGuildOptions(guildId)
    if (!guildConfig) {
      const configEmbed = mountConfigEmbed('No custom config found. Using default', config.defaultConfig)
      return message.channel.send({ embed: configEmbed })
    }
    const configEmbed = mountConfigEmbed(`Config for "${message.guild.name}"`, guildConfig)
    return message.channel.send({ embed: configEmbed })
  } catch (error) {
    message.react('❌')
    console.log(error)
  }
}
