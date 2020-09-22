import { getArgumentsAndOptions, getCommand, getConfig } from '../utils/message'
import commandsHelp from '../utils/helpMessages'
import { setLanguage } from '../utils/language'

/**
 * Get fields with more help information.
 *
 * @returns {object[]}
 */
function getMoreHelpFields () {
  const commandsListText = Object.keys(commandsHelp).map(command => `\`${command}\``).join(', ')
  return [
    {
      name: 'Internationalization',
      value: 'Some commands support `lang=<lang>` and `translate=<lang>` options.\nAvailable languages: `en`, `pt`, `fr` and `es`.'
    },
    {
      name: 'Available Commands',
      value: commandsListText
    }
  ]
}

/**
 * Mounts the help message embed.
 *
 * @param {object|string} messageOrArgument
 * @param {string} lang
 * @returns {object}
 */
export function mountCommandHelpEmbed (messageOrArgument, lang) {
  let command
  if (typeof messageOrArgument === 'string') {
    command = messageOrArgument
  } else {
    const prefix = getConfig('prefix', messageOrArgument.guild.id)
    command = getCommand(prefix, messageOrArgument)
  }
  return {
    color: 'LIGHT_GREY',
    title: `:grey_question: Help: \`.help ${command}\``,
    description: commandsHelp[command].help[lang],
    fields: [
      {
        name: 'Examples',
        value: commandsHelp[command].examples.map(example => `\`${example}\``).join('\n')
      },
      ...getMoreHelpFields()
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

  const lang = setLanguage(options, message.guild.id)

  const hasArguments = Boolean(args.length)
  const hasTooManyArguments = args.length > 1
  const helpArgument = args[0]
  const embed = {
    color: 'LIGHT_GREY',
    title: ':grey_question: Help',
    description: 'type `.help <command>` to get help for an specific command',
    fields: getMoreHelpFields()
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
