import { Message, MessageReaction, User } from 'discord.js'
import { ItemManager } from '@managers'
import { handleReactionError } from '@utils/handleError'
import { GuildConfig } from '@types'
import { PartyReaction } from '@commands'
import mappings from '@utils/mappings'
const { classEmoji } = mappings

class ReactionService {
  private messagePool = []

  private allowedEmojis = {
    equip: ['🛠️']
  }
  
  private validateEmoji (commandReaction: string, emoji: string) {
    const emojiList = this.allowedEmojis[commandReaction]
    if (!emojiList) return false
    return emojiList.includes(emoji)
  }

  private async fetchReaction(reaction: MessageReaction) {
    try {
      await reaction.fetch()
    } catch (error) {
      console.log('Something went wrong when fetching reaction: ', error)
    }
  }

  private handlePartyReaction(reaction: MessageReaction, user: User, guildConfig: GuildConfig, action: 'join'|'leave') {
    const isPartyMessage = reaction.message.embeds[0]?.title?.includes('Party')
    if (isPartyMessage) {
      const className = classEmoji[`<:${reaction.emoji.name}:${reaction.emoji.id}>`]
      if (!className) return
      const PartyReactionCommand = new PartyReaction(reaction, user, guildConfig)
      this.lockMessage(reaction.message.id, () => PartyReactionCommand.execute(action))
    }
  }

  async handleEquipEnrichmentReaction(reaction: MessageReaction) {
    const reactionEmbed = reaction.message?.embeds[0]
    if (!reactionEmbed) {
      return
    }
    const title = reactionEmbed.title || ''
    const isEquipMessage = /:(.*?):/.test(title)
    const isValidEquipEmoji = this.validateEmoji('equip', reaction.emoji.name)
    if (isEquipMessage && isValidEquipEmoji) {
      await this.lockMessage(reaction.message.id, () => ItemManager.enrichItemMessage(reaction))
    }
  }

  public async handleReactionAdd(reaction: MessageReaction, user: User, guildConfig: GuildConfig) {
    try {
      if (user.bot) return
  
      if (reaction.partial) {
        await this.fetchReaction(reaction)
      }

      this.handlePartyReaction(reaction, user, guildConfig, 'join')
      this.handleEquipEnrichmentReaction(reaction)
  
    } catch (error) {
      handleReactionError(error, reaction, user)
    }
  }

  public async handleReactionRemove(reaction: MessageReaction, user: User, guildConfig: GuildConfig) {
    try {
      if (user.bot) return
  
      if (reaction.partial) {
        await this.fetchReaction(reaction)
      }

      this.handlePartyReaction(reaction, user, guildConfig, 'leave')

    } catch (error) {
      handleReactionError(error, reaction, user)
    }
  }

  // Change this so locked message dont trigger any reaction so code becomes cleaner
  async lockMessage (messageId: string, unlockedFunction: () => Promise<void>) {
    if (this.messagePool.includes(messageId)) {
      return
    }
    this.messagePool.push(messageId)
    await unlockedFunction()
    this.messagePool = this.messagePool.filter(id => id !== messageId)
  }
}

const reactionService = new ReactionService()
export default reactionService