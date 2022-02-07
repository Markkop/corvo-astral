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
  // 0: null,
  // 1: subCommand,
  // 2: subCommandGroup,
  3: String,
  4: Number,
  5: Boolean,
  // 6: user,
  // 7: channel,
  // 8: role,
  // 9: mentionable,
  10: Number,
}

function getNestedOptions(options) {
  return options.reduce((allOptions, option) => {
    if (!option.options) return [...allOptions, option]
    const nestedOptions = getNestedOptions(option.options)
    return [option, ...allOptions, ...nestedOptions]
  }, [])
}

function castToType(value: string, typeId: number) {
  const typeCaster = optionType[typeId]
  return typeCaster ? typeCaster(value) : value
}

export function getParsedCommand(stringCommand: string, commandData) {
  const options = getNestedOptions(commandData.options)
  const optionsIndentifiers = options.map(option => `${option.name}:`)
  const requestedOptions = options.reduce((requestedOptions, option) => {
    const identifier = `${option.name}:`
    if (!stringCommand.includes(identifier)) return requestedOptions
    const remainder = stringCommand.split(identifier)[1]

    const nextOptionIdentifier = remainder.split(' ').find(word => optionsIndentifiers.includes(word))
    if (nextOptionIdentifier) {
      const value = remainder.split(nextOptionIdentifier)[0].trim()
      return [...requestedOptions, {
        name: option.name,
        value: castToType(value, option.type),
        type: option.type
      }]
    }
    
    return [...requestedOptions, {
      name: option.name,
      value: castToType(remainder.trim(), option.type),
      type: option.type
    }]
  }, [])
  const optionNames = options.map(option => option.name)
  const splittedCommand = stringCommand.split(' ')
  const name = splittedCommand[0].replace('/', '')
  const subcommand = splittedCommand.find(word => optionNames.includes(word))
  return {
    id: name,
    name,
    type: 1,
    options: subcommand ? [{
      name: subcommand,
      type: 1,
      options: requestedOptions
    }] : requestedOptions
  }
}


export function embedContaining(content) {
  return {
    embeds: expect.arrayContaining([expect.objectContaining(content)]),
    fetchReply: true
  }
}


export function embedContainingWithoutFetchReply(content) {
  return {
    embeds: expect.arrayContaining([expect.objectContaining(content)])
  }
}

export function fieldContainingValue(expectedValue) {
  return embedContainingWithoutFetchReply({
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

/* Spy channel 'send' with mock options */
export function mockInteractionWithOptionsAndSpyChannelSend(options) {
  const discord = new MockDiscord(options)
  const interaction = discord.getInteraction() as CommandInteraction
  const channel = discord.getBotPartyTextChannel()
  const spy = jest.spyOn(channel, 'send') 
  return { interaction, spy }
}

export async function executeCommandWithMockOptionsAndSpySentMessage(command, options, config = {}) {
  const { interaction, spy } = mockInteractionWithOptionsAndSpyChannelSend(options)
  const commandInstance = new command(interaction, {...defaultConfig, ...config})
  await commandInstance.execute()
  return spy
}

/* Spy 'edit' with mock options */
export function mockMessageWithOptionsAndSpyEdit(options) {
  const discord = new MockDiscord(options)
  const interaction = discord.getInteraction() as CommandInteraction
  const channel = discord.getBotPartyTextChannel()
  const lastMessage = channel.messages.cache.last()
  const spy = jest.spyOn(lastMessage, 'edit') 
  return { interaction, spy }
}

export async function executeCommandWithMockOptionsAndSpyEdit(command, options, config = {}) {
  const { interaction, spy } = mockMessageWithOptionsAndSpyEdit(options)
  const commandInstance = new command(interaction, {...defaultConfig, ...config})
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