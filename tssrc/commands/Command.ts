import { Message } from "discord.js"
import { GuildConfig } from "../types"
import commandsHelp from '../utils/helpMessages'

export default abstract class Command {
  protected guildConfig: GuildConfig
  protected lang: string
  protected message: Message
  protected commandWord: string

  constructor(message: Message, commandWord: string, guildConfig: GuildConfig) {
    this.guildConfig = guildConfig
    this.lang = guildConfig.lang
    this.message = message
    this.commandWord = commandWord
  }

  public return() {}

  protected async returnHelp() {
    const helpEmbed = this.mountCommandHelpEmbed()
    return this.message.channel.send({ embed: helpEmbed })
  }

  private mountCommandHelpEmbed() {
    const commandsListText = Object.keys(commandsHelp).map(command => `\`${command}\``).join(', ')
    return {
      color: 'LIGHT_GREY',
      title: `:grey_question: Help: \`.help ${this.commandWord}\``,
      description: commandsHelp[this.commandWord].help[this.lang],
      fields: [
        {
          name: 'Examples',
          value: commandsHelp[this.commandWord].examples.map(example => `\`${example}\``).join('\n')
        },
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
  }

  protected getArgumentsAndOptions(message: Message, optionsConector = '=') {
    let messageContent = message.content.replace(/“|”/g, '"')
    const quoteOptions = messageContent.match(/(".*?")/g) || []
    quoteOptions.forEach(quoteOption => {
      const quoteOptionWithUnderscore = quoteOption.replace(/ /g, '_')
      messageContent = messageContent.replace(quoteOption, quoteOptionWithUnderscore)
    })
    const args = messageContent.split(' ').slice(1).filter(arg => !arg.includes(optionsConector))
    // TO DO: Better type this any
    const options: any = messageContent.split(' ').slice(1).reduce((options, argument) => {
      if (!argument.includes(optionsConector)) {
        return options
      }
      const splittedArgument = argument.split(optionsConector)
      const argumentName = splittedArgument[0]
      const argumentValue = splittedArgument[1].replace(/_/g, ' ').replace(/"/g, '')
      return { ...options, [argumentName]: argumentValue }
    }, {})
    return { args, options }
  }

  private isValidLang(lang) {
    const validLangs = ['en', 'es', 'fr', 'pt']
    return validLangs.some(validLang => validLang === lang)
  }

  protected changeLang(targetLanguage) {
    const isValidLang = this.isValidLang(targetLanguage)
    if (isValidLang) {
      this.lang = targetLanguage
    }
  }
}