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

export function mockMessageWithOptionsAndSpyExistingMessageEdit(options) {
  const discord = new MockDiscord(options)
  const userMessage = discord.getMessage()
  const channel = discord.getBotPartyTextChannel()
  const lasMessage = channel.messages.cache.get('existing-party-message-id-0')
  const spy = jest.spyOn(lasMessage, 'edit') 
  return { userMessage, spy }
}

export function embedContaining(content) {
  return {
    embed: expect.objectContaining(content)
  }
}

export async function executeCommandWithMockOptionsAndSpySentMessage(command, options, config = {}) {
  const { userMessage, spy } = mockMessageWithOptionsAndSpyChannelSend(options)
  const equipCommand = new command(userMessage, {...defaultConfig, ...config})
  await equipCommand.execute()
  return spy
}

export async function executeCommandWithMockOptionsAndSpyExistingMessageEdit(command, options, config = {}) {
  const { userMessage, spy } = mockMessageWithOptionsAndSpyExistingMessageEdit(options)
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