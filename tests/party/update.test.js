import { partyList } from '../../src/commands'
import { mockMessage } from '../testUtils'

jest.mock('discord.js', () => ({
  MessageEmbed: embed => embed
}))

describe('updateParty', () => {
  it('updates the user listed class', async () => {
    const content = '.party update id=1 class=feca'
    const channelMessages = [{
      embeds: [{
        title: 'Party: group1',
        fields: [
          { name: ':label: ID', value: '1', inline: true },
          { name: ':calendar_spiral: Date', value: '10/10 21:00', inline: true },
          { name: ':skull: Level', value: '200', inline: true },
          { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@222> | enu\n:small_orange_diamond: <@111> | enu\n:small_orange_diamond: <@444> | enu\n <@555> | enu:small_orange_diamond:\n:small_orange_diamond: <@666> | enu\n:small_orange_diamond: <@777> | enu' }
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
        { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@222> | enu\n:small_orange_diamond: <@111> | feca\n:small_orange_diamond: <@444> | enu\n <@555> | enu:small_orange_diamond:\n:small_orange_diamond: <@666> | enu\n:small_orange_diamond: <@777> | enu' }
      ]
    })
  })

  it('updates a description', async () => {
    const content = '.party update id=1 desc="test"'
    const channelMessages = [{
      embeds: [{
        title: 'Party: group1',
        fields: [
          { name: ':label: ID', value: '1', inline: true },
          { name: ':calendar_spiral: Date', value: '10/10 21:00', inline: true },
          { name: ':skull: Level', value: '200', inline: true },
          { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@111> | enu\n:small_orange_diamond: <@222> | enu\n:small_orange_diamond: <@444> | enu\n <@555> | enu:small_orange_diamond:\n:small_orange_diamond: <@666> | enu\n:small_orange_diamond: <@777> | enu' }
        ]
      }]
    }]
    const mockedUserMessage = mockMessage(content, channelMessages)
    const botResponse = await partyList(mockedUserMessage)
    expect(botResponse).toMatchObject({
      title: 'Party: group1',
      description: 'test',
      fields: [
        { name: ':label: ID', value: '1', inline: true },
        { name: ':calendar_spiral: Date', value: '10/10 21:00', inline: true },
        { name: ':skull: Level', value: '200', inline: true },
        { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@111> | enu\n:small_orange_diamond: <@222> | enu\n:small_orange_diamond: <@444> | enu\n <@555> | enu:small_orange_diamond:\n:small_orange_diamond: <@666> | enu\n:small_orange_diamond: <@777> | enu' }
      ]
    })
  })

  it('updates the party if the user is the party leader', async () => {
    const content = '.party update id=1 name="new Name" lvl=100'
    const channelMessages = [{
      embeds: [{
        title: 'Party: group1',
        fields: [
          { name: ':label: ID', value: '1', inline: true },
          { name: ':calendar_spiral: Date', value: '10/10 21:00', inline: true },
          { name: ':skull: Level', value: '200', inline: true },
          { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@111> | enu\n:small_orange_diamond: <@222> | enu\n:small_orange_diamond: <@444> | enu\n <@555> | enu:small_orange_diamond:\n:small_orange_diamond: <@666> | enu\n:small_orange_diamond: <@777> | enu' }
        ]
      }]
    }]
    const mockedUserMessage = mockMessage(content, channelMessages)
    const botResponse = await partyList(mockedUserMessage)
    expect(botResponse).toMatchObject({
      title: 'Party: new Name',
      fields: [
        { name: ':label: ID', value: '1', inline: true },
        { name: ':calendar_spiral: Date', value: '10/10 21:00', inline: true },
        { name: ':skull: Level', value: '100', inline: true },
        { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@111> | enu\n:small_orange_diamond: <@222> | enu\n:small_orange_diamond: <@444> | enu\n <@555> | enu:small_orange_diamond:\n:small_orange_diamond: <@666> | enu\n:small_orange_diamond: <@777> | enu' }
      ]
    })
  })

  it('updates the party leader class', async () => {
    const content = '.party update id=1 class=osa'
    const channelMessages = [{
      embeds: [{
        title: 'Party: group1',
        fields: [
          { name: ':label: ID', value: '1', inline: true },
          { name: ':calendar_spiral: Date', value: '10/10 21:00', inline: true },
          { name: ':skull: Level', value: '100', inline: true },
          { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@111> | enu\n:small_orange_diamond: <@222> | enu\n:small_orange_diamond: <@444> | enu\n <@555> | enu:small_orange_diamond:\n:small_orange_diamond: <@666> | enu\n:small_orange_diamond: <@777> | enu' }
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
        { name: ':skull: Level', value: '100', inline: true },
        { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@111> | osa\n:small_orange_diamond: <@222> | enu\n:small_orange_diamond: <@444> | enu\n <@555> | enu:small_orange_diamond:\n:small_orange_diamond: <@666> | enu\n:small_orange_diamond: <@777> | enu' }
      ]
    })
  })

  it('returns an error if the user is not the party leader to update party options', async () => {
    const content = '.party update id=1 name=azul'
    const channelMessages = [{
      embeds: [{
        title: 'Party: group1',
        fields: [
          { name: ':label: ID', value: '1', inline: true },
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
      title: ':x: Error while updating party',
      description: "You're not the leader =/"
    })
  })

  it('returns a help message if no party id was provided', async () => {
    const content = '.party update name=azul'
    const mockedUserMessage = mockMessage(content)
    const botResponse = await partyList(mockedUserMessage)
    expect(botResponse.embed).toMatchObject({
      title: ':grey_question: Help: `.help party`'
    })
  })

  it('returns an error message if no party was found with the given id', async () => {
    const content = '.party update id=1 class=eni'
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
      title: ':x: Error while updating party'
    })
  })

  it('displays an error message if no party message was found in the channel', async () => {
    const content = '.party update id=5 class=enu'
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
    const content = '.party update id=1 class=eni'
    const channelMessages = [{
      embeds: [{
        title: 'Party: group1',
        fields: [
          { name: ':label: ID', value: '1', inline: true },
          { name: ':calendar_spiral: Date', value: '10/10 21:00', inline: true },
          { name: ':skull: Level', value: '100', inline: true },
          { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <222@> | enu\n:small_orange_diamond: <@888> | enu\n:small_orange_diamond: <@444> | enu\n <@555> | enu:small_orange_diamond:\n:small_orange_diamond: <@666> | enu\n:small_orange_diamond: <@777> | enu' }
        ]
      }]
    }]
    const mockedUserMessage = mockMessage(content, channelMessages)
    const botResponse = await partyList(mockedUserMessage)
    expect(botResponse.embed).toMatchObject({
      color: '#bb1327',
      title: ':x: Error while updating party',
      description: "You're not in this party :eyes:"
    })
  })
})
