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
 * @param { import('discord.js').Message } message - Discord message object.
 * @param {string} optionsConector
 * @returns {string[]} Command and arguments.
 */
export function getArgumentsAndOptions (message, optionsConector) {
  const messageContent = message.content
  const args = messageContent.split(' ').slice(1).filter(arg => !arg.includes(optionsConector))
  const options = messageContent.split(' ').reduce((options, argument) => {
    if (!argument.includes(optionsConector)) {
      return options
    }
    const splittedArgument = argument.split(optionsConector)
    const argumentName = splittedArgument[0]
    const argumentValue = splittedArgument[1]
    return { ...options, [argumentName]: argumentValue }
  }, {})
  return { args, options }
}
