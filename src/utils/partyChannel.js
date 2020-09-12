/**
 * Get the party channel by matching its name.
 *
 * @param {object} message
 * @returns {object}
 */
export function getPartyChannel (message) {
  return message.client.channels.cache.find(channel => channel.name.includes('grupos'))
}

/**
 * Get party messages from the party channel.
 *
 * @param {object} message
 * @returns {object[]}
 */
export async function getChannelParties (message) {
  const channel = getPartyChannel(message)
  const messages = await channel.messages.fetch({ limit: 100 })
  return messages.filter(message => {
    const embeds = message.embeds || []
    const partyEmbed = embeds[0]
    if (!partyEmbed) {
      return false
    }
    return partyEmbed.title.includes('Grupo')
  })
}
