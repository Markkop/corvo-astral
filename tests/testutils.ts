import MockDiscord from './mockDiscord'

export const defaultConfig = {
  id: '11',
  lang: 'en',
  prefix: '.',
  almanaxChannel: 'almanax',
  partyChannel: 'listagem-de-grupos',
  buildPreview: 'enabled'
}

export function embedContaining(content) {
  return {
    embed: expect.objectContaining(content)
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

/* Spy 'send' */
export function mockMessageAndSpyChannelSend(content) {
  const discord = new MockDiscord({ message: { content }})
  const userMessage = discord.getMessage()
  const spy = jest.spyOn(userMessage.channel, 'send') 
  return { userMessage, spy }
}

export async function executeCommandAndSpySentMessage(command, content, config = {}) {
  const { userMessage, spy } = mockMessageAndSpyChannelSend(content)
  const commandInstance = new command(userMessage, {...defaultConfig, ...config})
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