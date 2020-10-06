
/**
 * An isolated piece of code to avoid nesting try..catch.
 *
 * @param {Promise<object>} message
 */
async function reactWithErrorEmoji (message) {
  try {
    await message.react('❌')
  } catch (err) {
  }
}

/**
 * Handles error on message sending or editing.
 *
 * @param {Error} error
 * @param {object} message
 */
export function handleMessageError (error, message) {
  const guildName = message && message.guild && message.guild.name
  const channelName = message && message.channel && message.channel.name
  const authorName = message && message.author && message.author.username
  console.log(`${error.toString()} on guild "${guildName}", channel "${channelName}" by ${authorName}`)
  reactWithErrorEmoji(message)
}

/**
 * Handles error on reaction.
 *
 * @param {Error} error
 * @param {object} reaction
 * @param {object} user
 */
export function handleReactionError (error, reaction, user) {
  console.log(`${error.toString()} on guild "${reaction.message.guild.name}", channel "${reaction.message.channel.name}" by ${user.username}`)
}
