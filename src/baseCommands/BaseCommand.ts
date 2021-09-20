import { Message, MessageOptions } from 'discord.js'
import { GuildConfig, PartialEmbed } from '@types'
import { MessageManager } from '@managers'
import commandsHelp from '@utils/helpMessages'
import { handleMessageError } from '@utils/handleError'

export default abstract class BaseCommand {
  protected guildConfig: GuildConfig
  protected lang: string
  protected message: Message
  protected commandWord: string

  constructor (message: Message, guildConfig: GuildConfig) {
    this.guildConfig = guildConfig
    this.lang = guildConfig.lang
    this.message = message
    this.commandWord = MessageManager.getCommandWord(guildConfig.prefix, message)
  }

  protected async send (content: MessageOptions | string): Promise<Message> {
    try {
      const messageContent = typeof content === 'string' ? { content } : content
      const sentContent = await this.message.channel.send(messageContent)
      if(Array.isArray(sentContent)) return sentContent[0]
      return sentContent
    } catch (error) {
      handleMessageError(error, this.message)
    }
  }

  protected async sendHelp (command: string = ''): Promise<Message> {
    const helpEmbed = this.mountCommandHelpEmbed(command)
    return this.send({ embed: helpEmbed })
  }

  private mountCommandHelpEmbed (command: string = ''): PartialEmbed {
    const commandWord = command || this.commandWord
    const commandsListText = Object.keys(commandsHelp).filter(cmd => cmd !== 'default').map(command => `\`${command}\``).join(', ')
    const commandHelp = commandsHelp[commandWord] || commandsHelp.default
    return {
      color: 0xBCC0C0,
      title: `:grey_question: Help: \`.help ${commandsHelp[commandWord] ? commandWord : ''}\``,
      description: commandHelp.help[this.lang],
      fields: [
        {
          name: 'Examples',
          value: commandHelp.examples.map(example => `\`${example}\``).join('\n'),
          inline: false
        },
        {
          name: 'Internationalization',
          value: 'Some commands support `lang=<lang>` and `translate=<lang>` options.\nAvailable languages: `en`, `pt`, `fr` and `es`.',
          inline: false
        },
        {
          name: 'Available Commands',
          value: commandsListText,
          inline: false
        }
      ]
    }
  }

  protected isValidLang (lang: string) {
    const validLangs = ['en', 'es', 'fr', 'pt']
    return validLangs.some(validLang => validLang === lang)
  }

  protected changeLang (targetLanguage: string): void {
    const isValidLang = this.isValidLang(targetLanguage)
    if (isValidLang) {
      this.lang = targetLanguage
    }
  }
}
