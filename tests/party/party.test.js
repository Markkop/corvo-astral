import { partyList } from '../../src/commands'
import { commandsHelp } from '../../src/commands/help'
import { mockMessage } from '../testUtils'

jest.mock('discord.js', () => ({
  MessageEmbed: embed => embed
}))

describe('party', () => {
  it('displays a help message if no argument was provided', async () => {
    const content = '.party aaa'
    const mockedUserMessage = mockMessage(content, [])
    const botResponse = await partyList(mockedUserMessage)
    expect(botResponse.embed).toMatchObject({
      description: commandsHelp.party
    })
  })
})
