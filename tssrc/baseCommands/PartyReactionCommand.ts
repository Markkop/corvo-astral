import { PartyCommand } from '@baseCommands'
import { User, MessageReaction } from 'discord.js'
import { GuildConfig } from '@types'

export default class PartyReactionCommand extends PartyCommand {
  protected reaction: MessageReaction
  protected user: User

  constructor (reaction: MessageReaction, user: User, guildConfig: GuildConfig) {
    super(reaction.message, guildConfig)
    this.reaction = reaction
    this.user = user
  }
}
