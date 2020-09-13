import { partyList } from '../../src/commands'
import { commandsHelp } from '../../src/commands/help'
import { mockMessage } from '../testUtils'

jest.mock('discord.js', () => ({
  MessageEmbed: embed => embed
}))

describe('joinParty', () => {
  it("updates the party message with the user if s/he's the first", async () => {
    const content = '.party join id=1 class=enu'
    const channelMessages = [{
      embeds: [{
        title: 'Grupo: group1',
        fields: [
          { name: ':label: ID', value: '1', inline: true },
          { name: ':calendar_spiral: Data', value: '10/10 21:00', inline: true },
          { name: ':skull: Nível', value: '200', inline: true },
          { name: ':busts_in_silhouette: Participantes', value: ':small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:' }
        ]
      }]
    }]
    const mockedUserMessage = mockMessage(content, channelMessages)
    const botResponse = await partyList(mockedUserMessage)
    expect(botResponse).toMatchObject({
      title: 'Grupo: group1',
      fields: [
        { name: ':label: ID', value: '1', inline: true },
        { name: ':calendar_spiral: Data', value: '10/10 21:00', inline: true },
        { name: ':skull: Nível', value: '200', inline: true },
        { name: ':busts_in_silhouette: Participantes', value: ':small_orange_diamond: <@111> | enu\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:' }
      ]
    })
  })

  it("updates the party message with the user if s/he's the second", async () => {
    const content = '.party join id=1 class=enu'
    const channelMessages = [{
      embeds: [{
        title: 'Grupo: group1',
        fields: [
          { name: ':label: ID', value: '1', inline: true },
          { name: ':calendar_spiral: Data', value: '10/10 21:00', inline: true },
          { name: ':skull: Nível', value: '200', inline: true },
          { name: ':busts_in_silhouette: Participantes', value: ':small_orange_diamond: <@222> | enu\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:' }
        ]
      }]
    }]
    const mockedUserMessage = mockMessage(content, channelMessages)
    const botResponse = await partyList(mockedUserMessage)
    expect(botResponse).toMatchObject({
      title: 'Grupo: group1',
      fields: [
        { name: ':label: ID', value: '1', inline: true },
        { name: ':calendar_spiral: Data', value: '10/10 21:00', inline: true },
        { name: ':skull: Nível', value: '200', inline: true },
        { name: ':busts_in_silhouette: Participantes', value: ':small_orange_diamond: <@222> | enu\n:small_orange_diamond: <@111> | enu\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:' }
      ]
    })
  })

  it("returns an error message if there's no slots available", async () => {
    const content = '.party join id=1 class=enu'
    const channelMessages = [{
      embeds: [{
        title: 'Grupo: group1',
        fields: [
          { name: ':label: ID', value: '1', inline: true },
          { name: ':calendar_spiral: Data', value: '10/10 21:00', inline: true },
          { name: ':skull: Nível', value: '200', inline: true },
          { name: ':busts_in_silhouette: Participantes', value: ':small_orange_diamond: <@222> | enu\n:small_orange_diamond: <@333> | enu\n:small_orange_diamond: <@444> | enu\n <@555> | enu:small_orange_diamond:\n:small_orange_diamond: <@666> | enu\n:small_orange_diamond: <@777> | enu' }
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

  it('returns an error message if the user is already in the party', async () => {
    const content = '.party join id=1 class=enu'
    const channelMessages = [{
      embeds: [{
        title: 'Grupo: group1',
        fields: [
          { name: ':label: ID', value: '1', inline: true },
          { name: ':calendar_spiral: Data', value: '10/10 21:00', inline: true },
          { name: ':skull: Nível', value: '200', inline: true },
          { name: ':busts_in_silhouette: Participantes', value: ':small_orange_diamond: <@111> | enu\n:small_orange_diamond: <@333> | enu\n:small_orange_diamond: <@444> | enu\n <@555> | enu:small_orange_diamond:\n:small_orange_diamond: <@666> | enu\n:small_orange_diamond: <@777> | enu' }
        ]
      }]
    }]
    const mockedUserMessage = mockMessage(content, channelMessages)
    const botResponse = await partyList(mockedUserMessage)
    expect(botResponse.embed).toMatchObject({
      color: '#bb1327',
      title: ':x: Erro ao entrar no grupo',
      description: 'Você já está nele. Talvez queira dar um `.party update`?'
    })
  })

  it('displays an error message if no party message was found in the channel', async () => {
    const content = '.party join id=5 class=enu'
    const channelMessages = [{
      content: 'random message'
    }]
    const mockedUserMessage = mockMessage(content, channelMessages)
    const botResponse = await partyList(mockedUserMessage)
    expect(botResponse.embed).toMatchObject({
      color: '#bb1327',
      title: ':x: Erro ao usar o comando party',
      description: 'Não foi encontrada nenhuma mensagem de grupo no canal "grupos"'
    })
  })

  it('returns an error message if no party was found with the given id', async () => {
    const content = '.party join id=2 class=eni'
    const channelMessages = [{
      embeds: [{
        title: 'Grupo: group1',
        fields: [
          { name: ':label: ID', value: '1', inline: true },
          { name: ':calendar_spiral: Data', value: '10/10 21:00', inline: true },
          { name: ':skull: Nível', value: '200', inline: true },
          { name: ':busts_in_silhouette: Participantes', value: ':small_orange_diamond: <@111> | enu\n:small_orange_diamond: <@333> | enu\n:small_orange_diamond: <@444> | enu\n <@555> | enu:small_orange_diamond:\n:small_orange_diamond: <@666> | enu\n:small_orange_diamond: <@777> | enu' }
        ]
      }]
    }]
    const mockedUserMessage = mockMessage(content, channelMessages)
    const botResponse = await partyList(mockedUserMessage)
    expect(botResponse.embed).toMatchObject({
      color: '#bb1327',
      title: ':x: Erro ao atualizar o grupo',
      description: 'Nenhum dos últimos 100 grupos encontrado com esse id'
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
