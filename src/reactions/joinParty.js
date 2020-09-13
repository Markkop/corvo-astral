import { partyList } from '../commands/party'

/**
 * Join a group party or updates the user listed classes.
 *
 * @param {object} reaction
 * @param {object} user
 * @param {string[]} members
 * @param {string} listingGroupId
 * @param {string} className
 * @returns {Promise<object>}
 */
export async function joinPartyByReaction (reaction, user, members, listingGroupId, className) {
  const isUserAlreadyMember = members.includes(user.id)
  const message = {
    client: reaction.message.client,
    author: user,
    react: () => {},
    channel: { send: () => {} },
    guild: reaction.message.guild
  }
  if (isUserAlreadyMember) {
    const memberRow = members.split('\n').find(member => member.includes(user.id))
    if (memberRow.includes(className)) return
    const memberClasses = memberRow.split('| ')[1].split(',').map(word => word.trim()).filter(Boolean)
    if (memberClasses.length >= 3) return
    memberClasses.push(className)
    const newMemberRow = memberClasses.join(', ')
    message.content = `.party update id=${listingGroupId} class="${newMemberRow}"`
  } else {
    message.content = `.party join id=${listingGroupId} class=${className}`
  }

  return partyList(message)
}
