import { CommandInteraction, Interaction, Message, MessageOptions } from 'discord.js'
import { GuildConfig, PartialEmbed } from '@types'
import { MessageManager } from '@managers'
import commandsHelp from '@utils/helpMessages'
import { handleInteractionError, handleMessageError } from '@utils/handleError'

export default abstract class BaseCommand {
  protected guildConfig: GuildConfig
  protected lang: string
  protected interaction: Interaction
  protected commandWord: string

  constructor (interaction: Interaction|null, guildConfig: GuildConfig) {
    this.guildConfig = guildConfig
    this.lang = guildConfig.lang
    this.interaction = interaction
    this.commandWord = interaction?.isCommand() ? interaction.commandName : '' 
  }

  protected async send (content: MessageOptions | string): Promise<void> {
    try {
      const interaction = this.interaction as CommandInteraction
      const messageContent = typeof content === 'string' ? { content } : content
      await interaction.reply(messageContent)
    } catch (error) {
      handleInteractionError(error, this.interaction)
    }
  }

  protected async sendHelp (command: string = ''): Promise<void> {
    const helpEmbed = this.mountCommandHelpEmbed(command)
    return this.send({ embeds: [helpEmbed] })
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
