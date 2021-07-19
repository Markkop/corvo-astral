import {  MessageReaction, User } from 'discord.js'
import GroupFinder from './GroupFinderService'
import mappings from '@utils/mappings'
import { ItemManager } from '@managers'
import { handleReactionError } from '@utils/handleError'
const { classEmoji } = mappings

class ReactionService {
  private messagePool = []
  private groupFinderService = GroupFinder

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

  public async handleReactionAdd(reaction: MessageReaction, user: User) {
    try {
      if (user.bot) return
      const { message } = reaction
  
      if (reaction.partial) {
        await this.fetchReaction(reaction)
      }
  
      const { members, listingGroupId } = await this.groupFinderService.getGroupList(message, user)
      if (members && listingGroupId) {
        const className = classEmoji[reaction.emoji.name]
        if (!className) return
        // return await this.groupFinderService.joinPartyByReaction(reaction, user, members, listingGroupId, className)
      }
  
      const messageId = message.id
      const reactionEmbed = message.embeds[0]
      const title = reactionEmbed.title || ''
      const isEquipMessage = /:(.*?):/.test(title)
      const isValidEquipEmoji = this.validateEmoji('equip', reaction.emoji.name)
      if (isEquipMessage && isValidEquipEmoji) {
        await this.lockMessage(messageId, () => ItemManager.enrichItemMessage(reaction))
      }

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