import Command from './Command'
import str from '../stringsLang'
import { Message } from 'discord.js'
import { GuildConfig } from '../types'

export default class FinderCommand extends Command {

  constructor(message: Message, commandWord: string, guildConfig: GuildConfig) {
    super(message, commandWord, guildConfig)
  }

  private mountNotFoundEmbed (message: Message, lang: string) {
    return {
      color: '#bb1327',
      title: `:x: ${str.capitalize(str.noResults[lang])}`,
      description: str.capitalize(str.noResultsMessage(this.commandWord)[lang])
    }
  }

  protected returnNotFound() {
    const notFoundEmbed = this.mountNotFoundEmbed(this.message, this.lang)
    return this.message.channel.send({ embed: notFoundEmbed })
  }
}