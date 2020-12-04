import { partyList } from '../../src/commands'
import { mockMessage } from '../testUtils'

jest.mock('discord.js', () => ({
  MessageEmbed: embed => embed
}))

describe('updateParty', () => {
  it('updates the user listed class', async () => {
    const content = '.party update id=1 class=feca mode=legacy'
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
    const content = '.party update id=1 desc="test" mode=legacy'
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
    const content = '.party update id=1 name="new Name" lvl=100 mode=legacy'
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
    const content = '.party update id=1 class=osa mode=legacy'
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
})
