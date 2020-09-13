import { partyList } from '../../src/commands'
import { commandsHelp } from '../../src/commands/help'
import { mockMessage } from '../testUtils'
import { handleMessageError } from '../../src/utils/handleError'

jest.mock('../../src/utils/handleError')

jest.mock('discord.js', () => ({
  MessageEmbed: embed => embed
}))

describe('partyList', () => {
  describe('create', () => {
    it('creates the first party message on the party channel if there is no party messages', async () => {
      const content = '.party create nome=group1 data="10/10 21:00" lvl=200'
      const mockedUserMessage = mockMessage(content, [])
      const botResponse = await partyList(mockedUserMessage)
      expect(botResponse.embed).toMatchObject({
        title: 'Grupo: group1',
        fields: [
          { name: ':label: ID', value: '1', inline: true },
          { name: ':calendar_spiral: Data', value: '10/10 21:00', inline: true },
          { name: ':skull: Nível', value: '200', inline: true },
          { name: ':busts_in_silhouette: Participantes', value: ':small_orange_diamond: <@111> | \n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:' }
        ]
      })
    })

    it('creates a party message with the next identifier', async () => {
      const content = '.party create nome=group3 data="10/10 21:00" lvl=200'
      const channelMessages = [{
        embeds: [{
          title: 'Grupo: group2',
          fields: [
            { name: ':label: ID', value: '2', inline: true },
            { name: ':calendar_spiral: Data', value: '10/10 21:00', inline: true },
            { name: ':skull: Nível', value: '200', inline: true },
            { name: ':busts_in_silhouette: Participantes', value: ':small_orange_diamond: <@111> | \n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:' }
          ]
        }]
      }]
      const mockedUserMessage = mockMessage(content, channelMessages)
      const botResponse = await partyList(mockedUserMessage)
      expect(botResponse.embed).toMatchObject({
        title: 'Grupo: group3',
        fields: [
          { name: ':label: ID', value: '3', inline: true },
          { name: ':calendar_spiral: Data', value: '10/10 21:00', inline: true },
          { name: ':skull: Nível', value: '200', inline: true },
          { name: ':busts_in_silhouette: Participantes', value: ':small_orange_diamond: <@111> | \n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:' }
        ]
      })
    })

    it('creates a party message with a description', async () => {
      const content = '.party create nome=group3 desc="ninja tudo"'
      const mockedUserMessage = mockMessage(content)
      const botResponse = await partyList(mockedUserMessage)
      expect(botResponse.embed).toMatchObject({
        title: 'Grupo: group3',
        description: 'ninja tudo',
        fields: [
          { name: ':label: ID', value: '1', inline: true },
          { name: ':calendar_spiral: Data', value: 'A combinar', inline: true },
          { name: ':skull: Nível', value: '1-215', inline: true },
          { name: ':busts_in_silhouette: Participantes', value: ':small_orange_diamond: <@111> | \n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:' }
        ]
      })
    })

    it('creates a party message with the author on footer', async () => {
      const content = '.party create nome=group3'
      const channelMessages = [{
        embeds: [{
          title: 'Grupo: group2',
          fields: [
            { name: ':label: ID', value: '2', inline: true },
            { name: ':calendar_spiral: Data', value: '10/10 21:00', inline: true },
            { name: ':skull: Nível', value: '200', inline: true },
            { name: ':busts_in_silhouette: Participantes', value: ':small_orange_diamond: <@111> | \n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:' }
          ]
        }]
      }]
      const mockedUserMessage = mockMessage(content, channelMessages)
      const botResponse = await partyList(mockedUserMessage)
      expect(botResponse.embed).toMatchObject({
        footer: {
          text: 'Criado por Mark'
        }
      })
    })

    it('creates a party message with max vagas allowed', async () => {
      const content = '.party create nome=group3 data="10/10 21:00" lvl=200 vagas=100'
      const channelMessages = [{
        embeds: [{
          title: 'Grupo: group2',
          fields: [
            { name: ':label: ID', value: '2', inline: true },
            { name: ':calendar_spiral: Data', value: '10/10 21:00', inline: true },
            { name: ':skull: Nível', value: '200', inline: true },
            { name: ':busts_in_silhouette: Participantes', value: ':small_orange_diamond: <@111> | \n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:' }
          ]
        }]
      }]
      const mockedUserMessage = mockMessage(content, channelMessages)
      const botResponse = await partyList(mockedUserMessage)
      const membersList = botResponse.embed.fields.find(field => field.name.includes('Participantes')).value.split('\n').length
      expect(membersList).toEqual(50)
    })

    it('returns an error message if not provided required options', async () => {
      const content = '.party create'
      const mockedUserMessage = mockMessage(content, [])
      const botResponse = await partyList(mockedUserMessage)
      expect(botResponse.embed).toMatchObject({
        description: commandsHelp.party
      })
    })

    it("calls handleMessageError if can't send a message", async () => {
      const content = '.party create'
      await partyList({ content })
      expect(handleMessageError).toHaveBeenCalled()
    })
  })
})
