import { BaseCommand } from '@baseCommands'
import str from '@stringsLang'
import { Message } from 'discord.js'
import { GuildConfig, PartialEmbed } from '@types'

export default class FinderCommand extends BaseCommand {
  constructor (message: Message, guildConfig: GuildConfig) {
    super(message, guildConfig)
  }

  private mountNotFoundEmbed (lang: string): PartialEmbed {
    return {
      color: 0xbb1327,
      title: `:x: ${str.capitalize(str.noResults[lang])}`,
      description: str.capitalize(str.noResultsMessage(this.commandWord)[lang])
    }
  }

  protected returnNotFound () {
    const notFoundEmbed = this.mountNotFoundEmbed(this.lang)
    return this.reply({ embed: notFoundEmbed })
  }
}
