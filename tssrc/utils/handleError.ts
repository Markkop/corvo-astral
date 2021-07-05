import { DMChannel, Message, MessageReaction, User } from 'discord.js'

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
export function handleMessageError (error: Error, message: Message): void {
  const guildName = message.guild.name
  const channelName = message.channel instanceof DMChannel ? '' : message.channel.name
  const authorName = message.author.username
  const authorTag = message.author.tag
  const errorText = error.toString() || ''
  console.log(`${errorText} on guild "${guildName}", channel "${channelName}" by ${authorName}(${authorTag}) with content "${message.content}"`)
  if (errorText.includes('TypeError')) {
    console.log(error)
  }
  reactWithErrorEmoji(message)
}

/**
 * Handles error on reaction.
 *
 * @param {Error} error
 * @param {object} reaction
 * @param {object} user
 */
export function handleReactionError (error: Error, reaction: MessageReaction, user: User): void {
  const errorText = error.toString() || ''
  const channelName = reaction.message.channel instanceof DMChannel ? '' : reaction.message.channel.name
  console.log(`${errorText} on guild "${reaction.message.guild.name}", channel "${channelName}" by ${user.username}`)
  if (errorText.includes('TypeError')) {
    console.log(error)
  }
}
