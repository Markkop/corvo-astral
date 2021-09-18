import { PartyCommand } from '@baseCommands'
import { User, MessageReaction, MessageEmbed } from 'discord.js'
import { GuildConfig } from '@types'

export default class PartyReactionCommand extends PartyCommand {
  protected reaction: MessageReaction
  protected user: User
  protected embed: MessageEmbed

  constructor (reaction: MessageReaction, user: User, guildConfig: GuildConfig) {
    super(reaction.message, guildConfig)
    this.reaction = reaction
    this.user = user
    this.embed = reaction.message.embeds[0]
  }

  protected async editMessageEmbed(updatedEmbed: MessageEmbed) {
    const embed = { ...updatedEmbed }
    const newEmbed = new MessageEmbed(embed)
    await this.message.edit(newEmbed)
  }
}
