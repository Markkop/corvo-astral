import { DMChannel, Interaction, Message, MessageReaction, User } from 'discord.js'

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
  const channelName = message.channel instanceof DMChannel ? 'DM' : message.channel.id
  const authorName = message.author.username
  const authorTag = message.author.tag
  const errorText = error.toString() || ''
  console.log(`${error.name}: ${error.message} on guild "${guildName}", channel "${channelName}" by ${authorName}(${authorTag}) with content "${message.content}"`)
  if (errorText.includes('TypeError')) {
    console.log(error)
  }
  reactWithErrorEmoji(message)
}

/**
 * Handles error on interaction sending.
 *
 * @param {Error} error
 * @param {object} message
 */
 export function handleInteractionError (error: Error, interaction: Interaction): void {
  const guildName = interaction.guild.name
  const channelName = interaction.channel instanceof DMChannel ? 'DM' : interaction.channel.id
  const authorName = interaction.user.username
  const authorTag = interaction.user.tag
  const errorText = error.toString() || ''
  console.log(`${error.name}: ${interaction.isCommand() && interaction.commandName} on guild "${guildName}", channel "${channelName}" by ${authorName}(${authorTag})`)
  if (errorText.includes('TypeError') || errorText.includes('RangeError')) {
    console.log(error)
  }
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
  const channelName = reaction.message.channel instanceof DMChannel ? '' : reaction.message.channel.id
  console.log(`${errorText} on guild "${reaction.message.guild.name}", channel "${channelName}" by ${user.username}`)
  if (errorText.includes('TypeError')) {
    console.log(error)
  }
}
