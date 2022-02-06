import { CommandInteraction } from 'discord.js'
import MockDiscord from './mockDiscord'

export const defaultConfig = {
  id: '11',
  lang: 'en',
  prefix: '.',
  almanaxChannel: 'almanax',
  partyChannel: 'listagem-de-grupos',
  buildPreview: 'enabled'
}

export const optionType = {
  null: 0,
  subCommand: 1,
  subCommandGroup: 2,
  string: 3,
  integer: 4,
  boolean: 5,
  user: 6,
  channel: 7,
  role: 8,
  mentionable: 9,
  number: 10,
}

export function parseCommand(stringCommand) {
  const splittedCommand = stringCommand.replace(/:\s/g , ':').split(' ')
  const secondSplit = splittedCommand[1]
  let command = {
    name: '',
    subcommand: secondSplit?.includes(':') ? '' : secondSplit,
    options: []
  }
  for (let index = 0; index < splittedCommand.length; index++ ) {
    const item = splittedCommand[index]
    if (item.includes('/')) {
      command.name = item.replace('/', '')
      continue
    }

    if (!item.includes(':')) {
      continue 
    }

    const [ name ] = item.split(':')
    const optionArguments = stringCommand.split(/\s\w*:/)
    command.options.push({ 
      name, 
      value: optionArguments[command.options.length + 1].trim()
    })
  }
  return command
}

export function mapParsedSubCommandToInteractionCommand(parsedCommand, { options }) {
  return parsedCommand.options.reduce((command, { name, value }) => {
    const subCommandOption = options.find(option => option.name === parsedCommand.subcommand)
    const option = subCommandOption.options.find(option => option.name === name)
    if (!option) return command
    command.options.push({
      name: parsedCommand.subcommand,
      type: optionType.subCommand,
      options: [{
        name,
        value,
        type: option.type,
      }]
    })
    return command
  }, { 
    id: parsedCommand.name,
    name: parsedCommand.name,
    type: optionType.subCommand,
    options: []
  })
}


export function mapParsedCommandToInteractionCommand(parsedCommand, { options }) {
  return parsedCommand.options.reduce((command, { name, value }) => {
    const option = options.find(option => option.name === name)
    if (!option) return command
    command.options.push({
      name,
      value,
      type: option.type
    })
    return command
  }, { 
    id: parsedCommand.name,
    name: parsedCommand.name,
    type: optionType.subCommand,
    options: []
  })
}

export function getParsedCommand(stringCommand: string, commandData) {
  const parsedCommand = parseCommand(stringCommand)
  if (parsedCommand.subcommand) {
    return mapParsedSubCommandToInteractionCommand(parsedCommand, commandData)
  }
  return mapParsedCommandToInteractionCommand(parsedCommand, commandData)
}

export function embedContaining(content) {
  return {
    embeds: expect.arrayContaining([expect.objectContaining(content)]),
    fetchReply: true
  }
}

export function fieldContainingValue(expectedValue) {
  return expect.objectContaining({
    fields: expect.arrayContaining([expect.objectContaining({
      value: expect.stringContaining(expectedValue)
    })])
  })
}

export function copy(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/* Spy 'reply' */
export function mockInteractionAndSpyReply(command) {
  const discord = new MockDiscord({ command })
  const interaction = discord.getInteraction() as CommandInteraction
  const spy = jest.spyOn(interaction, 'reply') 
  return { interaction, spy }
}

export async function executeCommandAndSpyReply(command, content, config = {}) {
  const { interaction, spy } = mockInteractionAndSpyReply(content)
  const commandInstance = new command(interaction, {...defaultConfig, ...config})
  await commandInstance.execute()
  return spy
}

/* Spy 'send' with mock options */
export function mockMessageWithOptionsAndSpyChannelSend(options) {
  const discord = new MockDiscord(options)
  const userMessage = discord.getMessage()
  const spy = jest.spyOn(userMessage.channel, 'send') 
  return { userMessage, spy }
}

export async function executeCommandWithMockOptionsAndSpySentMessage(command, options, config = {}) {
  const { userMessage, spy } = mockMessageWithOptionsAndSpyChannelSend(options)
  const commandInstance = new command(userMessage, {...defaultConfig, ...config})
  await commandInstance.execute()
  return spy
}

/* Spy 'edit' with mock options */
export function mockMessageWithOptionsAndSpyEdit(options) {
  const discord = new MockDiscord(options)
  const userMessage = discord.getMessage()
  const channel = discord.getBotPartyTextChannel()
  const lastMessage = channel.messages.cache.last()
  const spy = jest.spyOn(lastMessage, 'edit') 
  return { userMessage, spy }
}

export async function executeCommandWithMockOptionsAndSpyEdit(command, options, config = {}) {
  const { userMessage, spy } = mockMessageWithOptionsAndSpyEdit(options)
  const commandInstance = new command(userMessage, {...defaultConfig, ...config})
  await commandInstance.execute()
  return spy
}

/* Spy 'edit' with mock options for a party reaction*/
export function mockPartyReactionAndSpyEdit(options) {
  const discord = new MockDiscord(options)
  const channel = discord.getBotPartyTextChannel()
  const lastMessage = channel.messages.cache.last()
  const userMessage = discord.getMessage()
  const userReaction = discord.getReaction()
  const user = discord.getReactionUser()
  const spy = jest.spyOn(lastMessage, 'edit') 
  return { userMessage, spy, reaction: userReaction, user }
}

export async function executePartyReactionAndSpyEdit(command, action, options, config = {}) {
  const { spy, reaction, user } = mockPartyReactionAndSpyEdit(options)
  const commandInstance = new command(reaction, user, {...defaultConfig, ...config})
  await commandInstance.execute(action)
  return spy
}