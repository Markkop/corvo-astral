import { Message, MessageOptions } from 'discord.js'
import { GuildConfig, PartialEmbed } from '@types'
import { MessageManager } from '@managers'
import commandsHelp from '@utils/helpMessages'

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
    const messageContent = typeof content === 'string' ? { content } : content
    const sentContent = await this.message.channel.send(messageContent)
    if(Array.isArray(sentContent)) return sentContent[0]
    return sentContent
  }

  protected async sendHelp (): Promise<Message> {
    const helpEmbed = this.mountCommandHelpEmbed()
    return this.send({ embed: helpEmbed })
  }

  private mountCommandHelpEmbed (): PartialEmbed {
    const commandsListText = Object.keys(commandsHelp).map(command => `\`${command}\``).join(', ')
    return {
      color: 0xBCC0C0,
      title: `:grey_question: Help: \`.help ${this.commandWord}\``,
      description: commandsHelp[this.commandWord].help[this.lang],
      fields: [
        {
          name: 'Examples',
          value: commandsHelp[this.commandWord].examples.map(example => `\`${example}\``).join('\n'),
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

  private isValidLang (lang: string) {
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
