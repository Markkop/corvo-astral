import { BaseCommand } from '@baseCommands'
import { Message, TextChannel } from 'discord.js'
import { GuildConfig } from '@types'

export default class PartyCommand extends BaseCommand {
  constructor (message: Message, guildConfig: GuildConfig) {
    super(message, guildConfig)
  }

  protected getPartyChannel () {
    return this.message.guild.channels.cache.find(channel => {
      return channel.name.includes(this.guildConfig.partyChannel)
    })
  }

  protected async getChannelParties () {
    const channel = this.getPartyChannel() as TextChannel
    const messages = await channel.messages.fetch({ limit: 100 })
    return messages.filter(message => {
      const embeds = message.embeds || []
      const partyEmbed = embeds[0]
      if (!partyEmbed || !partyEmbed.title) {
        return false
      }
      return partyEmbed.title.includes('Party')
    })
  }
}
