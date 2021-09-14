import { BaseCommand } from '@baseCommands'
import { Message, MessageEmbed, TextChannel } from 'discord.js'
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

  protected async getPartyById(id: string) {
    const parties = await this.getChannelParties()
    return parties.find(party => party.embeds[0].title.includes(id))
  }

  protected getEmbedFieldByName(embed: MessageEmbed, fieldName: string) {
    return embed.fields.find(field => field.name.includes(fieldName))
  }

  protected getEmbedFieldValueByName(embed: MessageEmbed, fieldName: string): string {
    return this.getEmbedFieldByName(embed, fieldName)?.value || ''
  }

  protected getPartyId(message: Message): string {
    const idField = this.getEmbedFieldByName(message.embeds[0], 'ID')
    return idField.value
  }
}
