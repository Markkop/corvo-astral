import { getArgumentsAndOptions, getCommand } from '../utils/message'
import config from '../config'
import commandsHelp from '../../data/helpMessages'
import { setLanguage } from '../utils/language'
const { defaultConfig: { prefix } } = config
export { commandsHelp }

const commandsListText = Object.keys(commandsHelp).map(command => `\`${command}\``).join(', ')

/**
 * Mounts the help message embed.
 *
 * @param {object|string} messageOrArgument
 * @param {string} lang
 * @returns {object}
 */
export function mountCommandHelpEmbed (messageOrArgument, lang) {
  const command = typeof messageOrArgument === 'string' ? messageOrArgument : getCommand(prefix, messageOrArgument)
  return {
    color: 'LIGHT_GREY',
    title: `:grey_question: Help: \`.help ${command}\``,
    description: commandsHelp[command].help[lang],
    fields: [
      {
        name: 'Examples',
        value: commandsHelp[command].examples.join('\n')
      },
      {
        name: 'Available Commands',
        value: commandsListText
      }
    ]
  }
}

/**
 * Replies the user with a help message.
 *
 * @param { import('discord.js').Message } message - Discord message object.
 * @returns {Promise<object>}
 */
export function getHelp (message) {
  const { args, options } = getArgumentsAndOptions(message, '=')

  const lang = setLanguage(options, config, message.guild.id)

  const hasArguments = Boolean(args.length)
  const hasTooManyArguments = args.length > 1
  const helpArgument = args[0]
  const embed = {
    color: 'LIGHT_GREY',
    title: ':grey_question: Help',
    description: 'type `.help <comando>` to get help for an specific command',
    fields: [
      {
        name: 'Available Commands',
        value: commandsListText
      }
    ]
  }
  if (!hasArguments) {
    return message.channel.send({ embed })
  }

  if (hasTooManyArguments) {
    embed.description = 'You can get help for only one command'
    return message.channel.send({ embed })
  }

  const helpEmbed = mountCommandHelpEmbed(helpArgument, lang)
  return message.channel.send({ embed: helpEmbed })
}
