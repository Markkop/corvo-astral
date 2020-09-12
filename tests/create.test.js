import { createParty } from '../src/commands'
import { commandsHelp } from '../src/commands/help'

describe('createParty', () => {
  it('creates the first party message on the party channel if there is no party messages', async () => {
    let botMessage = {}
    const userMessage = {
      content: '.create nome=group1 data=10/10 hora=21:00 lvl=200',
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
    await createParty(userMessage)
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
      content: '.create nome=group1 data=10/10 hora=21:00 lvl=200',
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
    await createParty(userMessage)
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
      content: '.create',
      channel: {
        send: jest.fn(message => { botMessage = message })
      }
    }
    await createParty(userMessage)
    expect(botMessage.embed).toMatchObject({
      description: commandsHelp.create
    })
  })
})
