import { partyList } from '../../src/commands'
import { mockMessage } from '../testUtils'

jest.mock('discord.js', () => ({
  MessageEmbed: embed => embed
}))

describe('leaveParty', () => {
  it('leaves the party updating the message if the user is in the last slot', async () => {
    const content = '.party leave id=1'
    const channelMessages = [{
      embeds: [{
        title: 'Party: group1',
        fields: [
          { name: ':label: ID', value: '1', inline: true },
          { name: ':calendar_spiral: Date', value: '10/10 21:00', inline: true },
          { name: ':skull: Level', value: '200', inline: true },
          { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@222> | enu\n:small_orange_diamond: <@777> | enu\n:small_orange_diamond: <@444> | enu\n:small_orange_diamond: <@555> | enu\n:small_orange_diamond: <@666> | enu\n:small_orange_diamond: <@111> | enu' }
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
        { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@222> | enu\n:small_orange_diamond: <@777> | enu\n:small_orange_diamond: <@444> | enu\n:small_orange_diamond: <@555> | enu\n:small_orange_diamond: <@666> | enu\n:small_orange_diamond:' }
      ]
    })
  })

  it('leaves the party updating the message if the user is in the first slot', async () => {
    const content = '.party leave id=1'
    const channelMessages = [{
      embeds: [{
        title: 'Party: group1',
        fields: [
          { name: ':label: ID', value: '1', inline: true },
          { name: ':calendar_spiral: Date', value: '10/10 21:00', inline: true },
          { name: ':skull: Level', value: '200', inline: true },
          { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@111> | enu\n:small_orange_diamond: <@222> | enu\n:small_orange_diamond: <@333> | enu\n:small_orange_diamond: <@444> | enu\n:small_orange_diamond: <@555> | enu\n:small_orange_diamond: <@666> | enu' }
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
        { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@222> | enu\n:small_orange_diamond: <@333> | enu\n:small_orange_diamond: <@444> | enu\n:small_orange_diamond: <@555> | enu\n:small_orange_diamond: <@666> | enu\n:small_orange_diamond:' }
      ]
    })
  })

  it('returns a help message if no party id was provided', async () => {
    const content = '.party leave'
    const mockedUserMessage = mockMessage(content)
    const botResponse = await partyList(mockedUserMessage)
    expect(botResponse.embed).toMatchObject({
      title: ':grey_question: Help: `.help party`'
    })
  })

  it('returns an error message if no party was found', async () => {
    const content = '.party leave id=1'
    const channelMessages = [{
      embeds: [{
        title: 'Party: group1',
        fields: [
          { name: ':label: ID', value: '2', inline: true },
          { name: ':calendar_spiral: Date', value: '10/10 21:00', inline: true },
          { name: ':skull: Level', value: '100', inline: true },
          { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <222@> | enu\n:small_orange_diamond: <@111> | enu\n:small_orange_diamond: <@444> | enu\n <@555> | enu:small_orange_diamond:\n:small_orange_diamond: <@666> | enu\n:small_orange_diamond: <@777> | enu' }
        ]
      }]
    }]
    const mockedUserMessage = mockMessage(content, channelMessages)
    const botResponse = await partyList(mockedUserMessage)
    expect(botResponse.embed).toMatchObject({
      color: '#bb1327',
      description: 'This ID was not found in the last 100 parties',
      title: ':x: Error while leaving party'
    })
  })

  it('displays an error message if no party message was found in the channel', async () => {
    const content = '.party leave id=5'
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

  it('returns an error message if the user is not in the provided party', async () => {
    const content = '.party leave id=1'
    const channelMessages = [{
      embeds: [{
        title: 'Party: group1',
        fields: [
          { name: ':label: ID', value: '1', inline: true },
          { name: ':calendar_spiral: Date', value: '10/10 21:00', inline: true },
          { name: ':skull: Level', value: '100', inline: true },
          { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <222@> | enu\n:small_orange_diamond: <@888> | enu\n:small_orange_diamond: <@444> | enu\n:small_orange_diamond: <@555> | enu\n:small_orange_diamond: <@666> | enu\n:small_orange_diamond: <@777> | enu' }
        ]
      }]
    }]
    const mockedUserMessage = mockMessage(content, channelMessages)
    const botResponse = await partyList(mockedUserMessage)
    expect(botResponse.embed).toMatchObject({
      color: '#bb1327',
      description: "You're not in this party :eyes:",
      title: ':x: Error while leaving party'
    })
  })
})
