import { PartyCommand } from '@baseCommands'
import { User, MessageReaction, MessageEmbed, Message } from 'discord.js'
import { GuildConfig } from '@types'

export default class PartyReactionCommand extends PartyCommand {
  protected reaction: MessageReaction
  protected user: User
  protected embed: MessageEmbed
  protected message: Message

  constructor (reaction: MessageReaction, user: User, guildConfig: GuildConfig) {
    super(null, guildConfig)
    this.reaction = reaction
    this.user = user
    this.embed = reaction.message.embeds[0]
  }

  protected async editMessageEmbed(updatedEmbed: MessageEmbed) {
    try {
      const embed = { ...updatedEmbed }
      const newEmbed = new MessageEmbed(embed)
      await this.reaction.message.edit({ embeds: [newEmbed] })
    } catch (error) {
      console.log(error)
    }
  }
}
