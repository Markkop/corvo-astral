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

export function embedContaining(content) {
  return {
    embed: expect.objectContaining(content)
  }
}

export function executeCommandAndSpySentMessage(command, content) {
  const { userMessage, spy } = mockMessageAndSpyChannelSend(content)
  const equipCommand = new command(userMessage, defaultConfig)
  equipCommand.execute()
  return spy
}