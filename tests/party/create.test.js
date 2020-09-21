import { partyList } from '../../src/commands'
import commandsHelp from '../../src/utils/helpMessages'
import { mockMessage } from '../testUtils'
import { handleMessageError } from '../../src/utils/handleError'

jest.mock('../../src/utils/handleError')

jest.mock('discord.js', () => ({
  MessageEmbed: embed => embed
}))

describe('partyList', () => {
  describe('create', () => {
    it('creates the first party message on the party channel if there is no party messages', async () => {
      const content = '.party create name=group1 date="10/10 21:00" lvl=200'
      const mockedUserMessage = mockMessage(content, [])
      const botResponse = await partyList(mockedUserMessage)
      expect(botResponse.embed).toMatchObject({
        title: 'Party: group1',
        fields: [
          { name: ':label: ID', value: '1', inline: true },
          { name: ':calendar_spiral: Date', value: '10/10 21:00', inline: true },
          { name: ':skull: Level', value: '200', inline: true },
          { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@111> | \n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:' }
        ]
      })
    })

    it('creates a party message with the next identifier', async () => {
      const content = '.party create name=group3 date="10/10 21:00" lvl=200'
      const channelMessages = [{
        embeds: [{
          title: 'Party: group2',
          fields: [
            { name: ':label: ID', value: '2', inline: true },
            { name: ':calendar_spiral: Date', value: '10/10 21:00', inline: true },
            { name: ':skull: Level', value: '200', inline: true },
            { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@111> | \n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:' }
          ]
        }]
      }]
      const mockedUserMessage = mockMessage(content, channelMessages)
      const botResponse = await partyList(mockedUserMessage)
      expect(botResponse.embed).toMatchObject({
        title: 'Party: group3',
        fields: [
          { name: ':label: ID', value: '3', inline: true },
          { name: ':calendar_spiral: Date', value: '10/10 21:00', inline: true },
          { name: ':skull: Level', value: '200', inline: true },
          { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@111> | \n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:' }
        ]
      })
    })

    it('creates a party message with a description', async () => {
      const content = '.party create name=group3 desc="ninja tudo"'
      const mockedUserMessage = mockMessage(content)
      const botResponse = await partyList(mockedUserMessage)
      expect(botResponse.embed).toMatchObject({
        title: 'Party: group3',
        description: 'ninja tudo',
        fields: [
          { name: ':label: ID', value: '1', inline: true },
          { name: ':calendar_spiral: Date', value: 'To be defined', inline: true },
          { name: ':skull: Level', value: '1-215', inline: true },
          { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@111> | \n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:' }
        ]
      })
    })

    it('creates a party message with the author on footer', async () => {
      const content = '.party create name=group3'
      const channelMessages = [{
        embeds: [{
          title: 'Party: group2',
          fields: [
            { name: ':label: ID', value: '2', inline: true },
            { name: ':calendar_spiral: Date', value: '10/10 21:00', inline: true },
            { name: ':skull: Level', value: '200', inline: true },
            { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@111> | \n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:' }
          ]
        }]
      }]
      const mockedUserMessage = mockMessage(content, channelMessages)
      const botResponse = await partyList(mockedUserMessage)
      expect(botResponse.embed).toMatchObject({
        footer: {
          text: 'Created by Mark'
        }
      })
    })

    it('creates a party message with max slots allowed', async () => {
      const content = '.party create name=group3 date="10/10 21:00" lvl=200 slots=100'
      const channelMessages = [{
        embeds: [{
          title: 'Party: group2',
          fields: [
            { name: ':label: ID', value: '2', inline: true },
            { name: ':calendar_spiral: Date', value: '10/10 21:00', inline: true },
            { name: ':skull: Level', value: '200', inline: true },
            { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@111> | \n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:' }
          ]
        }]
      }]
      const mockedUserMessage = mockMessage(content, channelMessages)
      const botResponse = await partyList(mockedUserMessage)
      const membersList = botResponse.embed.fields.find(field => field.name.includes('Members')).value.split('\n').length
      expect(membersList).toEqual(50)
    })

    it('returns an error message if not provided required options', async () => {
      const content = '.party create'
      const mockedUserMessage = mockMessage(content, [])
      const botResponse = await partyList(mockedUserMessage)
      expect(botResponse.embed).toMatchObject({
        description: commandsHelp.party.help.en
      })
    })

    it("calls handleMessageError if can't send a message", async () => {
      const content = '.party create'
      await partyList({ content })
      expect(handleMessageError).toHaveBeenCalled()
    })
  })
})
