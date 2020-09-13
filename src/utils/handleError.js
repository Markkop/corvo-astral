
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
  console.log(`${error.toString()} on guild "${message.guild.name}", channel "${message.channel.name}" by ${message.author.username}`)
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
