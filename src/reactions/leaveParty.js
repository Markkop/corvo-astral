
import { partyList } from '../commands/party'

/**
 * Leave a group party or updates the user listed classes.
 *
 * @param {object} reaction
 * @param {object} user
 * @param {string[]} members
 * @param {string} listingGroupId
 * @param {string} className
 * @returns {Promise<object>}
 */
export async function leavePartyByReaction (reaction, user, members, listingGroupId, className) {
  const isUserAlreadyMember = members.includes(user.id)
  const message = {
    client: reaction.message.client,
    author: user,
    react: () => {},
    channel: { send: () => {} }
  }

  if (!isUserAlreadyMember) return

  const memberRow = members.split('\n').find(member => member.includes(user.id))
  const memberClasses = memberRow.split('| ')[1].split(',').map(word => word.trim()).filter(Boolean)
  const memberNewClasses = memberClasses.filter(word => word !== className)
  if (!memberNewClasses.length) {
    message.content = `.party leave id=${listingGroupId}`
  } else {
    const newMemberRow = memberNewClasses.join(', ')
    message.content = `.party update id=${listingGroupId} class="${newMemberRow}"`
  }
  return partyList(message)
}
