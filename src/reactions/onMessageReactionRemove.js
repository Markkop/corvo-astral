import { handleReactionError } from '../utils/handleError'
import { getGroupList } from '../utils/getGroupList'
import leavePartyByReaction from './leaveParty'
import config from '../config'

const { classEmoji } = config

/**
 * Handles messages reactions.
 *
 * @param {object} reaction
 * @param {object} user
 * @returns {object}
 */
export default async function onMessageReactionRemove (reaction, user) {
  try {
    if (user.bot) return

    const { members, listingGroupId } = await getGroupList(reaction, user)
    if (!members || !listingGroupId) return

    const className = classEmoji[reaction.emoji.name]
    if (!className) return

    await leavePartyByReaction(reaction, user, members, listingGroupId, className)
  } catch (error) {
    handleReactionError(error, reaction, user)
  }
}
