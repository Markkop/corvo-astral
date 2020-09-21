import { partyList } from '../../src/commands'
import commandsHelp from '../../src/utils/helpMessages'
import { mockMessage } from '../testUtils'

jest.mock('discord.js', () => ({
  MessageEmbed: embed => embed
}))

describe('joinParty', () => {
  it("updates the party message with the user if s/he's the first", async () => {
    const content = '.party join id=1 class=enu'
    const channelMessages = [{
      embeds: [{
        title: 'Party: group1',
        fields: [
          { name: ':label: ID', value: '1', inline: true },
          { name: ':calendar_spiral: Date', value: '10/10 21:00', inline: true },
          { name: ':skull: Level', value: '200', inline: true },
          { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:' }
        ]
      }]
    }]
    const mockedUserMessage = mockMessage(content, channelMessages)
    const botResponse = await partyList(mockedUserMessage)
    expect(botResponse).toMatchObject({
      title: 'Party: group1',
      fields: [
        { name: ':label: ID', value: '1', inline: true },
        { name: ':calendar_spiral: Date', value: '10/10 21:00', inline: true },
        { name: ':skull: Level', value: '200', inline: true },
        { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@111> | enu\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:' }
      ]
    })
  })

  it("updates the party message with the user if s/he's the second", async () => {
    const content = '.party join id=1 class=enu'
    const channelMessages = [{
      embeds: [{
        title: 'Party: group1',
        fields: [
          { name: ':label: ID', value: '1', inline: true },
          { name: ':calendar_spiral: Date', value: '10/10 21:00', inline: true },
          { name: ':skull: Level', value: '200', inline: true },
          { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@222> | enu\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:' }
        ]
      }]
    }]
    const mockedUserMessage = mockMessage(content, channelMessages)
    const botResponse = await partyList(mockedUserMessage)
    expect(botResponse).toMatchObject({
      title: 'Party: group1',
      fields: [
        { name: ':label: ID', value: '1', inline: true },
        { name: ':calendar_spiral: Date', value: '10/10 21:00', inline: true },
        { name: ':skull: Level', value: '200', inline: true },
        { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@222> | enu\n:small_orange_diamond: <@111> | enu\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:' }
      ]
    })
  })

  it("returns an error message if there's no slots available", async () => {
    const content = '.party join id=1 class=enu'
    const channelMessages = [{
      embeds: [{
        title: 'Party: group1',
        fields: [
          { name: ':label: ID', value: '1', inline: true },
          { name: ':calendar_spiral: Date', value: '10/10 21:00', inline: true },
          { name: ':skull: Level', value: '200', inline: true },
          { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@222> | enu\n:small_orange_diamond: <@333> | enu\n:small_orange_diamond: <@444> | enu\n <@555> | enu:small_orange_diamond:\n:small_orange_diamond: <@666> | enu\n:small_orange_diamond: <@777> | enu' }
        ]
      }]
    }]
    const mockedUserMessage = mockMessage(content, channelMessages)
    const botResponse = await partyList(mockedUserMessage)
    expect(botResponse.embed).toMatchObject({
      color: '#bb1327',
      description: "It seems you're out :c",
      title: ':x: No slot available'
    })
  })

  it('returns an error message if the user is already in the party', async () => {
    const content = '.party join id=1 class=enu'
    const channelMessages = [{
      embeds: [{
        title: 'Party: group1',
        fields: [
          { name: ':label: ID', value: '1', inline: true },
          { name: ':calendar_spiral: Date', value: '10/10 21:00', inline: true },
          { name: ':skull: Level', value: '200', inline: true },
          { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@111> | enu\n:small_orange_diamond: <@333> | enu\n:small_orange_diamond: <@444> | enu\n <@555> | enu:small_orange_diamond:\n:small_orange_diamond: <@666> | enu\n:small_orange_diamond: <@777> | enu' }
        ]
      }]
    }]
    const mockedUserMessage = mockMessage(content, channelMessages)
    const botResponse = await partyList(mockedUserMessage)
    expect(botResponse.embed).toMatchObject({
      color: '#bb1327',
      description: 'You are already in it. Maybe you want to `.party update`?',
      title: ':x: Error while joining group'
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
      description: 'No party message has been found on channel "grupos"',
      title: ':x: Error on using party command'
    })
  })

  it('returns an error message if no party was found with the given id', async () => {
    const content = '.party join id=2 class=eni'
    const channelMessages = [{
      embeds: [{
        title: 'Party: group1',
        fields: [
          { name: ':label: ID', value: '1', inline: true },
          { name: ':calendar_spiral: Date', value: '10/10 21:00', inline: true },
          { name: ':skull: Level', value: '200', inline: true },
          { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@111> | enu\n:small_orange_diamond: <@333> | enu\n:small_orange_diamond: <@444> | enu\n <@555> | enu:small_orange_diamond:\n:small_orange_diamond: <@666> | enu\n:small_orange_diamond: <@777> | enu' }
        ]
      }]
    }]
    const mockedUserMessage = mockMessage(content, channelMessages)
    const botResponse = await partyList(mockedUserMessage)
    expect(botResponse.embed).toMatchObject({
      color: '#bb1327',
      description: 'This ID was not found in the last 100 parties',
      title: ':x: Error while updating party'
    })
  })

  it('returns a help message if not provided required options', async () => {
    const content = '.party join'
    const mockedUserMessage = mockMessage(content, [])
    const botResponse = await partyList(mockedUserMessage)
    expect(botResponse.embed).toMatchObject({
      description: commandsHelp.party.help.en
    })
  })
})
