import { getEquipment } from '../src/commands'
import { commandsHelp } from '../src/commands/help'

describe('getEquipment', () => {
  it('return a matching equipment by name', () => {
    let botMessage = {}
    const userMessage = {
      content: '.equip Cinto Tentacular',
      channel: {
        send: jest.fn(message => {
          botMessage = message
        })
      }
    }
    getEquipment(userMessage)
    expect(botMessage.embed).toEqual({
      color: '#fede71',
      title: ':yellow_circle: Cinto Tentacular',
      thumbnail: {
        url: 'https://builder.methodwakfu.com/assets/icons/items/13327644.webp'
      },
      fields: [
        {
          name: 'Nível',
          value: 215,
          inline: true
        },
        {
          name: 'Tipo',
          value: 'Cinto',
          inline: true
        },
        {
          name: 'Raridade',
          value: 'Lendário',
          inline: true
        },
        {
          name: 'Equipado',
          value:
            '286 PV\n47 de esquiva\n30 de Prospecção\n6% de Golpe crítico\n218 Domínio sobre 2 elementos aleatórios\n118 de Domínio de distância\n47 Resistência a :fire:\n47 Resistência a :herb:'
        }
      ]
    })
  })

  it('return a matching equipment by name with higher rarity by default', () => {
    let botMessage = {}
    const userMessage = {
      content: '.equip o eterno',
      channel: {
        send: jest.fn(message => {
          botMessage = message
        })
      }
    }
    getEquipment(userMessage)
    expect(botMessage.embed.fields).toEqual(expect.arrayContaining([{
      name: 'Raridade',
      value: 'Anelembrança',
      inline: true
    }]))
  })

  it('return a matching equipment by name with lower rarity with rarity argument is provided', () => {
    let botMessage = {}
    const userMessage = {
      content: '.equip o eterno raridade=mítico',
      channel: {
        send: jest.fn(message => {
          botMessage = message
        })
      }
    }
    getEquipment(userMessage)
    expect(botMessage.embed.fields).toEqual(expect.arrayContaining([{
      name: 'Raridade',
      value: 'Mítico',
      inline: true
    }]))
  })

  it('return the condition if the resulting equipment has one', () => {
    let botMessage = {}
    const userMessage = {
      content: '.equip espada de amakna',
      channel: {
        send: jest.fn(message => {
          botMessage = message
        })
      }
    }
    getEquipment(userMessage)
    expect(botMessage.embed.fields).toEqual(expect.arrayContaining([{
      name: 'Condições',
      value: 'Está equipado com Anel de Amakna'
    }]))
  })

  it('return the useEffect description if the resulting equipment has one', () => {
    let botMessage = {}
    const userMessage = {
      content: '.equip Palito de Dente de Ogrest',
      channel: {
        send: jest.fn(message => {
          botMessage = message
        })
      }
    }
    getEquipment(userMessage)
    expect(botMessage.embed.fields).toEqual(expect.arrayContaining([{
      name: 'Em uso:',
      value: 'Dano :star2:: 46 :left_right_arrow:'
    }]))
  })

  it('return a footer with more equip. found if results are more than one', () => {
    let botMessage = {}
    const userMessage = {
      content: '.equip amakna',
      channel: {
        send: jest.fn(message => {
          botMessage = message
        })
      }
    }
    getEquipment(userMessage)
    expect(botMessage.embed.footer).toEqual({
      text: 'Equipamentos encontrados: Botas dos Riktus de Amakna, Peitoral dos Riktus de Amakna, Máscara dos Riktus de Amakna, Escudo do Capitão Amakna, Espada de Amakna, Anel de Amakna, Dragonas dos Riktus de Amakna'
    })
  })

  it('return a footer with truncated results if there are too many', () => {
    let botMessage = {}
    const userMessage = {
      content: '.equip a',
      channel: {
        send: jest.fn(message => {
          botMessage = message
        })
      }
    }
    getEquipment(userMessage)
    expect(botMessage.embed.footer).toEqual({
      text: 'Equipamentos encontrados: Kwal Dhedo Enfraquecido, Botas do Tofu selvagem, Fatiadoras de Milobo, Fatiadoras de Milobo, Fatiadoras de Milobo, Fatiadoras de Milobo, O Amula, O Amula, O Amula, O Amula, Dragoperu de Precisão, Dragoperu de Distância, Dragoperu de Destruição, Manto do Competidor Júnior, Amuleto de Moskito, Lâmina Estrondosa, Sapeado, Vegetacinto, Anel Aventureiro, ChaPiu Azul e outros 3333 resultados'
    })
  })

  it('return a not found message if no equip was found', () => {
    let botMessage = {}
    const userMessage = {
      content: '.equip asdasdasd',
      channel: {
        send: jest.fn(message => {
          botMessage = message
        })
      }
    }
    getEquipment(userMessage)
    expect(botMessage.embed).toEqual({
      color: '#bb1327',
      title: ':x: Nenhum equipamento encontrado',
      description: 'Digite `.help equip` para conferir alguns exemplos de como pesquisar.'
    })
  })

  it('return a help message if no query was provided', () => {
    let botMessage = {}
    const userMessage = {
      content: '.equip',
      channel: {
        send: jest.fn(message => {
          botMessage = message
        })
      }
    }
    getEquipment(userMessage)
    expect(botMessage.embed).toMatchObject({
      description: commandsHelp.equip
    })
  })
})
