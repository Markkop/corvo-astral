import { CommandInteraction, Interaction, Message, MessageOptions } from 'discord.js'
import { GuildConfig, PartialEmbed } from '@types'
import commandsHelp from '@utils/helpMessages'
import { handleInteractionError, handleMessageError } from '@utils/handleError'
import stringsLang from '@stringsLang'
import { openFile } from '@utils/files'

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

  protected async send (content: MessageOptions | string): Promise<Message> {
    try {
      const interaction = this.interaction as CommandInteraction
      const messageContent = typeof content === 'string' ? { content } : content

      // Add wakfu version to embeds
      if (typeof content !== 'string' && messageContent?.embeds) {
        const wakfuVersion = openFile('data/raw/cdn/version.json')
        const embed = messageContent.embeds[0]
        const fields = embed.fields || []
        fields.push({ name: 'Wakfu Version', value: wakfuVersion, inline: false })
        messageContent.embeds[0].fields = fields
      }
      const sentContent = await interaction.reply({...messageContent, fetchReply: true })
      return sentContent as Message
    } catch (error) {
      handleInteractionError(error, this.interaction)
    }
  }

  protected async sendHelp (command): Promise<Message> {
    const helpEmbed = this.mountCommandHelpEmbed(command)
    return this.send({ embeds: [helpEmbed] })
  }

  private mountCommandHelpEmbed (command): PartialEmbed {
    const commandWord = command || this.commandWord
    const commandsListText = Object.keys(commandsHelp).filter(cmd => cmd !== 'default').map(command => `\`${command}\``).join(', ')
    const commandHelp = commandsHelp[commandWord]
    return {
      color: 0xBCC0C0,
      title: `:grey_question: Help: \`.help ${commandsHelp[commandWord] ? commandWord : ''}\``,
      description: commandHelp.help[this.lang],
      fields: [
        {
          name: stringsLang.examples[this.lang],
          value: commandHelp.examples.map(example => `\`${example}\``).join('\n'),
          inline: false
        },
        {
          name: stringsLang.internationalization[this.lang],
          value: stringsLang.internationalizationText[this.lang],
          inline: false
        },
        {
          name: stringsLang.availableCommands[this.lang],
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
