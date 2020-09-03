/**
 * Get command word from user message.
 *
 * @param {string} commandPrefix - Command prefix.
 * @param { import('discord.js').Message } message - Discord message object.
 * @returns {string} Command and arguments.
 */
export function getCommand (commandPrefix, message) {
  const messageContent = message.content
  const command = messageContent.split(' ')[0]
  return command.slice(commandPrefix.length)
}

/**
 * Get arguments from user message.
 *
 * @param {object} message - Discord message object.
 * @returns {string[]} Command and arguments.
 */
export function getArguments (message) {
  const messageContent = message.content
  return messageContent.split(' ').slice(1)
}
