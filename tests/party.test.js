import { partyList } from '../src/commands'
import { commandsHelp } from '../src/commands/help'

jest.mock('discord.js', () => ({
  MessageEmbed: (embed) => {
    return embed
  }
}))

describe('partyList', () => {
  it('creates the first party message on the party channel if there is no party messages', async () => {
    let botMessage = {}
    const userMessage = {
      content: '.party create nome=group1 data=10/10 hora=21:00 lvl=200',
      client: {
        channels: {
          cache: [
            {
              name: 'grupos',
              messages: {
                fetch: jest.fn().mockResolvedValue({
                  filter: jest.fn().mockResolvedValue({})
                })
              },
              send: jest.fn(message => { botMessage = message })
            }
          ]
        }
      }
    }
    await partyList(userMessage)
    expect(botMessage.embed).toMatchObject({
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
    let botMessage = {}
    const userMessage = {
      content: '.party create nome=group1 data=10/10 hora=21:00 lvl=200',
      client: {
        channels: {
          cache: [
            {
              name: 'grupos',
              messages: {
                fetch: jest.fn().mockResolvedValue({
                  filter: jest.fn().mockResolvedValue({
                    size: 2,
                    first: jest.fn().mockReturnValue({
                      embeds: [
                        {
                          title: 'Grupo: undefined',
                          fields: [
                            { name: 'Identificador', value: 2, inline: true },
                            { name: 'Data', value: '10/10 21:00', inline: true },
                            { name: 'Nível', value: '200', inline: true },
                            { name: 'Participantes', value: '*\n*\n*\n*\n*\n*' }
                          ]
                        }
                      ]
                    })
                  })
                })
              },
              send: jest.fn(message => { botMessage = message })
            }
          ]
        }
      }
    }
    await partyList(userMessage)
    expect(botMessage.embed).toMatchObject({
      title: 'Grupo: group1',
      fields: [
        { name: 'Identificador', value: 3, inline: true },
        { name: 'Data', value: '10/10 21:00', inline: true },
        { name: 'Nível', value: '200', inline: true },
        { name: 'Participantes', value: '*\n*\n*\n*\n*\n*' }
      ]
    })
  })

  it('returns an error message if not provided required options', async () => {
    let botMessage = {}
    const userMessage = {
      content: '.party create',
      channel: {
        send: jest.fn(message => { botMessage = message })
      }
    }
    await partyList(userMessage)
    expect(botMessage.embed).toMatchObject({
      description: commandsHelp.party
    })
  })
})

describe('partyList', () => {
  it("updates the party message with the user if s/he's the first", async () => {
    let botMessage = {}
    const userMessage = {
      content: '.party join id=1 class=enu',
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
    await partyList(userMessage)
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

  it("updates the party message with the user if s/he's the second", async () => {
    let botMessage = {}
    const userMessage = {
      content: '.party join id=1 class=enu',
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
                            { name: 'Participantes', value: '* <@222 | enu>\n*\n*\n*\n*\n*' }
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
    await partyList(userMessage)
    expect(botMessage).toMatchObject({
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
    let botMessage = {}
    const userMessage = {
      channel: {
        send: jest.fn(message => { botMessage = message })
      },
      content: '.party join id=1 class=enu',
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
                            { name: 'Participantes', value: '* <@222 | enu>\n* <@333 | enu>\n* <@444 | enu>\n <@555 | enu>*\n* <@666 | enu>\n* <@777 | enu>' }
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
    await partyList(userMessage)
    expect(botMessage.embed).toMatchObject({
      color: '#bb1327',
      title: ':x: Nenhuma vaga disponível',
      description: 'Parece que você ficou de fora :c'
    })
  })

  it('returns a help message if not provided required options', async () => {
    let botMessage = {}
    const userMessage = {
      content: '.party join',
      channel: {
        send: jest.fn(message => { botMessage = message })
      }
    }
    await partyList(userMessage)
    expect(botMessage.embed).toMatchObject({
      description: commandsHelp.party
    })
  })
})
