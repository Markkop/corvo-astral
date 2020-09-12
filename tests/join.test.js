import { joinParty } from '../src/commands'
import { commandsHelp } from '../src/commands/help'

jest.mock('discord.js', () => ({
  MessageEmbed: (embed) => {
    return embed
  }
}))

describe('joinParty', () => {
  it('updates the party message with the user mention', async () => {
    let botMessage = {}
    const userMessage = {
      content: '.join id=1 class=enu',
      author: {
        id: 111
      },
      client: {
        channels: {
          cache: [
            {
              name: 'grupos',
              messages: {
                fetch: jest.fn().mockResolvedValue({
                  filter: jest.fn().mockResolvedValue({
                    size: 2,
                    find: jest.fn().mockReturnValue({
                      embeds: [
                        {
                          title: 'Grupo: group1',
                          fields: [
                            { name: 'Identificador', value: 1, inline: true },
                            { name: 'Data', value: '10/10 21:00', inline: true },
                            { name: 'Nível', value: '200', inline: true },
                            { name: 'Participantes', value: '*\n*\n*\n*\n*\n*' }
                          ]
                        }
                      ],
                      edit: jest.fn(message => { botMessage = message })
                    })
                  })
                })
              }
            }
          ]
        }
      }
    }
    await joinParty(userMessage)
    expect(botMessage).toMatchObject({
      title: 'Grupo: group1',
      fields: [
        { name: 'Identificador', value: 1, inline: true },
        { name: 'Data', value: '10/10 21:00', inline: true },
        { name: 'Nível', value: '200', inline: true },
        { name: 'Participantes', value: '* <@111 | enu>\n*\n*\n*\n*\n*' }
      ]
    })
  })

  it('returns a help message if not provided required options', async () => {
    let botMessage = {}
    const userMessage = {
      content: '.join',
      channel: {
        send: jest.fn(message => { botMessage = message })
      }
    }
    await joinParty(userMessage)
    expect(botMessage.embed).toMatchObject({
      description: commandsHelp.join
    })
  })
})
