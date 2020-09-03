import config from './config'
const { prefix } = config

/**
 * @typedef CommandBody
 * @param { String } command
 * @param { String[] } args
 */

/**
 * Get command and arguments from user message
 * @param { Object } message discord message object
 * @returns { CommandBody } command and arguments
 */
export function parseCommandAndArgsFromMessage (message) {
  const commandBody = message.content.slice(prefix.length)
  const args = commandBody.split(' ')
  const command = args.shift().toLowerCase()
  return { command, args }
}
