import MockDiscord from './mockDiscord'

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