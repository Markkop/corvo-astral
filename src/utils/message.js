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
 * For options with quotes, it replaces their spaces with underscore and then
 * replaces them back. If you manage to find a regex that extracts them directly,
 * please let me know.
 * Feel free to use getArgumentsAndOptions test file to validate the suggested
 * implementation.
 *
 * @param { import('discord.js').Message } message - Discord message object.
 * @param {string} optionsConector
 * @returns {string[]} Command and arguments.
 */
export function getArgumentsAndOptions (message, optionsConector) {
  let messageContent = message.content
  const quoteOptions = messageContent.match(/(".*?")/g) || []
  quoteOptions.forEach(quoteOption => {
    const quoteOptionWithUnderscore = quoteOption.replace(/ /g, '_')
    messageContent = messageContent.replace(quoteOption, quoteOptionWithUnderscore)
  })
  const args = messageContent.split(' ').slice(1).filter(arg => !arg.includes(optionsConector))
  const options = messageContent.split(' ').slice(1).reduce((options, argument) => {
    if (!argument.includes(optionsConector)) {
      return options
    }
    const splittedArgument = argument.split(optionsConector)
    const argumentName = splittedArgument[0]
    const argumentValue = splittedArgument[1].replace(/_/g, ' ').replace(/"/g, '')
    return { ...options, [argumentName]: argumentValue }
  }, {})
  return { args, options }
}
