import { BaseCommand } from '@baseCommands'
import { Interaction, MessageEmbed, TextChannel, Message } from 'discord.js'
import { GuildConfig } from '@types'

export default class PartyCommand extends BaseCommand {
  constructor (interaction: Interaction, guildConfig: GuildConfig) {
    super(interaction, guildConfig)
  }

  protected getPartyChannel () {
    return this.interaction.guild.channels.cache.find(channel => {
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

  protected updateEmbedFieldByName(embed: MessageEmbed, fieldName: string, newValue: string) {
    const embedField = this.getEmbedFieldByName(embed, fieldName)
    embedField.value = newValue || embedField.value
    return embed
  }
  protected updatePartyFieldByName(embed: MessageEmbed, partyFieldName: string, newValue: string) {
    const updatedEmbed = { ...embed } as MessageEmbed
    if (partyFieldName === 'name') {
      updatedEmbed.title = newValue ? `<:dungeon:888873201512362035> Party: ${newValue}` : embed.title
    } else if (partyFieldName === 'description') {
      updatedEmbed.description = newValue
    } else if (partyFieldName === 'date') {
      this.updateEmbedFieldByName(updatedEmbed, 'Date', newValue)
    } else if (partyFieldName === 'level') {
      this.updateEmbedFieldByName(updatedEmbed, 'Level', newValue)
    } else if (partyFieldName === 'members') {
      this.updateEmbedFieldByName(updatedEmbed, 'Members', newValue)
    }
    return updatedEmbed
  }
}
