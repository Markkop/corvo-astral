import MockDiscord from './mockDiscord'

export const defaultConfig = {
  id: '11',
  lang: 'en',
  prefix: '.',
  almanaxChannel: 'almanax',
  partyChannel: 'listagem-de-grupos',
  buildPreview: 'enabled'
}

export function mockMessageAndSpyChannelSend(content) {
  const discord = new MockDiscord({ message: { content }})
  const userMessage = discord.getMessage()
  const spy = jest.spyOn(userMessage.channel, 'send') 
  return { userMessage, spy }
}

export function mockMessageWithOptionsAndSpyChannelSend(options) {
  const discord = new MockDiscord(options)
  const userMessage = discord.getMessage()
  const spy = jest.spyOn(userMessage.channel, 'send') 
  return { userMessage, spy }
}

export function embedContaining(content) {
  return {
    embed: expect.objectContaining(content)
  }
}

export async function executeCommandWithMockedOptionsAndSpySentMessage(command, options, config = {}) {
  const { userMessage, spy } = mockMessageWithOptionsAndSpyChannelSend(options)
  const equipCommand = new command(userMessage, {...defaultConfig, ...config})
  await equipCommand.execute()
  return spy
}

export async function executeCommandAndSpySentMessage(command, content, config = {}) {
  const { userMessage, spy } = mockMessageAndSpyChannelSend(content)
  const equipCommand = new command(userMessage, {...defaultConfig, ...config})
  await equipCommand.execute()
  return spy
}