
/**
 * Get members and group list id from the reacted message.
 *
 * @param {object} reaction
 * @param {object} user
 * @returns {Promise<object>}
 */
export async function getGroupList (reaction, user) {
  if (user.bot) return {}

  const messageEmbed = reaction.message.embeds[0]
  if (!messageEmbed) return {}

  const listingGroupIdField = messageEmbed.fields.find(field => field.name.includes('ID'))
  if (!listingGroupIdField) return {}
  const listingGroupId = listingGroupIdField.value

  const listingGroupMembersField = messageEmbed.fields.find(field => field.name.includes('Members'))
  if (!listingGroupMembersField) return {}
  const members = listingGroupMembersField.value

  return { listingGroupId, members }
}
