import { partyList } from '../src/commands'
import { commandsHelp } from '../src/commands/help'
import { mockMessage } from './testUtils'

jest.mock('discord.js', () => ({
  MessageEmbed: embed => embed
}))

describe('partyList', () => {
  it('creates the first party message on the party channel if there is no party messages', async () => {
    const content = '.party create nome=group1 data=10/10 hora=21:00 lvl=200'
    const mockedUserMessage = mockMessage(content, [])
    const botResponse = await partyList(mockedUserMessage)
    expect(botResponse.embed).toMatchObject({
      title: 'Grupo: group1',
      fields: [
        { name: 'Identificador', value: 1, inline: true },
        { name: 'Data', value: '10/10 21:00', inline: true },
        { name: 'Nível', value: '200', inline: true },
        { name: 'Participantes', value: '*\n*\n*\n*\n*\n*' }
      ]
    })
  })

  it('creates a party message with the next identifier', async () => {
    const content = '.party create nome=group3 data=10/10 hora=21:00 lvl=200'
    const channelMessages = [{
      embeds: [{
        title: 'Grupo: group2',
        fields: [
          { name: 'Identificador', value: 2, inline: true },
          { name: 'Data', value: '10/10 21:00', inline: true },
          { name: 'Nível', value: '200', inline: true },
          { name: 'Participantes', value: '*\n*\n*\n*\n*\n*' }
        ]
      }]
    }]
    const mockedUserMessage = mockMessage(content, channelMessages)
    const botResponse = await partyList(mockedUserMessage)
    expect(botResponse.embed).toMatchObject({
      title: 'Grupo: group3',
      fields: [
        { name: 'Identificador', value: 3, inline: true },
        { name: 'Data', value: '10/10 21:00', inline: true },
        { name: 'Nível', value: '200', inline: true },
        { name: 'Participantes', value: '*\n*\n*\n*\n*\n*' }
      ]
    })
  })

  it('returns an error message if not provided required options', async () => {
    const content = '.party create'
    const mockedUserMessage = mockMessage(content, [])
    const botResponse = await partyList(mockedUserMessage)
    expect(botResponse.embed).toMatchObject({
      description: commandsHelp.party
    })
  })
})

describe('partyList', () => {
  it("updates the party message with the user if s/he's the first", async () => {
    const content = '.party join id=1 class=enu'
    const channelMessages = [{
      embeds: [{
        title: 'Grupo: group1',
        fields: [
          { name: 'Identificador', value: 1, inline: true },
          { name: 'Data', value: '10/10 21:00', inline: true },
          { name: 'Nível', value: '200', inline: true },
          { name: 'Participantes', value: '*\n*\n*\n*\n*\n*' }
        ]
      }]
    }]
    const mockedUserMessage = mockMessage(content, channelMessages)
    const botResponse = await partyList(mockedUserMessage)
    expect(botResponse).toMatchObject({
      title: 'Grupo: group1',
      fields: [
        { name: 'Identificador', value: 1, inline: true },
        { name: 'Data', value: '10/10 21:00', inline: true },
        { name: 'Nível', value: '200', inline: true },
        { name: 'Participantes', value: '* <@111 | enu>\n*\n*\n*\n*\n*' }
      ]
    })
  })

  it("updates the party message with the user if s/he's the second", async () => {
    const content = '.party join id=1 class=enu'
    const channelMessages = [{
      embeds: [{
        title: 'Grupo: group1',
        fields: [
          { name: 'Identificador', value: 1, inline: true },
          { name: 'Data', value: '10/10 21:00', inline: true },
          { name: 'Nível', value: '200', inline: true },
          { name: 'Participantes', value: '* <@222 | enu>\n*\n*\n*\n*\n*' }
        ]
      }]
    }]
    const mockedUserMessage = mockMessage(content, channelMessages)
    const botResponse = await partyList(mockedUserMessage)
    expect(botResponse).toMatchObject({
      title: 'Grupo: group1',
      fields: [
        { name: 'Identificador', value: 1, inline: true },
        { name: 'Data', value: '10/10 21:00', inline: true },
        { name: 'Nível', value: '200', inline: true },
        { name: 'Participantes', value: '* <@222 | enu>\n* <@111 | enu>\n*\n*\n*\n*' }
      ]
    })
  })

  it("returns an error message if there's no slots available", async () => {
    const content = '.party join id=1 class=enu'
    const channelMessages = [{
      embeds: [{
        title: 'Grupo: group1',
        fields: [
          { name: 'Identificador', value: 1, inline: true },
          { name: 'Data', value: '10/10 21:00', inline: true },
          { name: 'Nível', value: '200', inline: true },
          { name: 'Participantes', value: '* <@222 | enu>\n* <@333 | enu>\n* <@444 | enu>\n <@555 | enu>*\n* <@666 | enu>\n* <@777 | enu>' }
        ]
      }]
    }]
    const mockedUserMessage = mockMessage(content, channelMessages)
    const botResponse = await partyList(mockedUserMessage)
    expect(botResponse.embed).toMatchObject({
      color: '#bb1327',
      title: ':x: Nenhuma vaga disponível',
      description: 'Parece que você ficou de fora :c'
    })
  })

  it('returns a help message if not provided required options', async () => {
    const content = '.party join'
    const mockedUserMessage = mockMessage(content, [])
    const botResponse = await partyList(mockedUserMessage)
    expect(botResponse.embed).toMatchObject({
      description: commandsHelp.party
    })
  })
})
