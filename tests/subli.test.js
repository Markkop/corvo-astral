import { getSublimation } from '../src/commands'
import { commandsHelp } from '../src/commands/help'

describe('getSublimation', () => {
  it('returns a sublimation when finding only one result', () => {
    let botMessage = {}
    const userMessage = {
      content: '.subli brutalidade',
      channel: {
        send: jest.fn(message => { botMessage = message })
      }
    }
    getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
      color: '#fd87ba',
      title: ':gem: Brutalidade',
      url: 'https://www.wakfu.com/pt/mmorpg/enciclopedia/recursos/25796-brutality',
      thumbnail: {
        url: 'https://static.ankama.com/wakfu/portal/game/item/115/68325796.png'
      },
      fields: [
        {
          name: 'Slot',
          value: 'Épico',
          inline: true
        },
        {
          name: 'Max Stacks',
          value: '1',
          inline: true
        },
        {
          name: 'Efeitos',
          value: 'Se Domínio Zona > Domínio Corpo a Corpo, Domínio Corpo a Corpo é adicionado ao Domínio Zona (max 800) no começo do combate, perdendo a mesma quantidade em Domínio Distância.'
        },
        {
          name: 'Obtenção:',
          value: 'Baú de Final de Temporada de Chefe Supremo (UB)'
        }
      ]
    })
  })

  it('returns a sublimation and more results when finding more than one', () => {
    let botMessage = {}
    const userMessage = {
      content: '.subli frenzy',
      channel: {
        send: jest.fn(message => { botMessage = message })
      }
    }
    getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
      color: '#fbfcac',
      title: ':scroll: Frenzy',
      url: 'https://www.wakfu.com/',
      thumbnail: {
        url: 'https://static.ankama.com/wakfu/portal/game/item/115/81227111.png'
      },
      fields: [
        {
          name: 'Slot',
          value: ':red_square: :green_square: :blue_square:',
          inline: true
        },
        {
          name: 'Max Stacks',
          value: '1',
          inline: true
        },
        {
          name: 'Efeitos',
          value: '-20% damage Inflicted, 10% damage inflicted per affected enemy at the start of the next turn'
        },
        {
          name: 'Obtenção:',
          value: 'Aguabrial (2%)'
        }
      ],
      footer: {
        text: 'Sublimações encontradas: Frenzy, Frenzy II, Frenzy III'
      }
    })
  })

  it('returns matching sublimations when searching with three slots', () => {
    let botMessage = {}
    const userMessage = {
      content: '.subli BBR',
      channel: {
        send: jest.fn(message => { botMessage = message })
      }
    }
    getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
      title: ':mag_right: Sublimações encontradas',
      fields: [
        {
          name: 'Busca',
          value: ':blue_square: :blue_square: :red_square:',
          inline: true
        },
        {
          name: 'Resultados',
          value: 3,
          inline: true
        },
        {
          name: 'Sublimações',
          value: 'Ambush, Spines, Integrity'
        }
      ]
    })
  })

  it('returns matching sublimations when searching with one white slot', () => {
    let botMessage = {}
    const userMessage = {
      content: '.subli wbr',
      channel: {
        send: jest.fn(message => { botMessage = message })
      }
    }
    getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
      title: ':mag_right: Sublimações encontradas',
      fields: [
        {
          name: 'Busca',
          value: ':white_large_square: :blue_square: :red_square:',
          inline: true
        },
        {
          name: 'Resultados',
          value: 7,
          inline: true
        },
        {
          name: 'Sublimações',
          value: 'Ambush, Resolute, Moon Scales, Spines, Resolute II, Condemnation II, Integrity'
        }
      ]
    })
  })

  it('returns matching sublimations when searching with two white slots', () => {
    let botMessage = {}
    const userMessage = {
      content: '.subli wwr',
      channel: {
        send: jest.fn(message => { botMessage = message })
      }
    }
    getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
      title: ':mag_right: Sublimações encontradas',
      fields: [
        {
          name: 'Busca',
          value: ':white_large_square: :white_large_square: :red_square:',
          inline: true
        },
        {
          name: 'Resultados',
          value: 19,
          inline: true
        },
        {
          name: 'Sublimações',
          value: 'Ruin, Ambush, Determination, Solidity, Resolute, Theory of Matter, Moon Scales, Swiftness, Save, Ruin II, Spines, Distance Barrier, Tenacity II, Resolute II, Cyclothymia, Condemnation II, Frenzy III, Length, Integrity'
        }
      ]
    })
  })

  it('returns non-repeated matching sublimations when searching with white slots', () => {
    let botMessage = {}
    const userMessage = {
      content: '.subli wwgw',
      channel: {
        send: jest.fn(message => { botMessage = message })
      }
    }
    getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
      title: ':mag_right: Sublimações encontradas',
      fields: [
        {
          name: 'Busca',
          value: ':white_large_square: :white_large_square: :green_square: :white_large_square:',
          inline: true
        },
        {
          name: 'Resultados',
          value: 31,
          inline: true
        },
        {
          name: 'Sublimações',
          value: 'Devastate, Carnage, Evasion, Condemnation, Stupefaction, Dimensionality, Return, Berserk Critical, Visibility, Devastate II, Evasion II, Berserk Dodge, Vitality Well, Influence, Wall, Return II, Influence II, Critical Hit Expert, Lone Wolf, Determination, Tenacity, Solidity, Topology, Frenzy, Theory of Matter, Distance Barrier, Close-Combat Barrier, Tenacity II, Berserk Block, Frenzy II, Cyclothymia'
        }
      ]
    })
  })

  it('returns matching sublimations when searching with four slots', () => {
    let botMessage = {}
    const userMessage = {
      content: '.subli rrgb',
      channel: {
        send: jest.fn(message => { botMessage = message })
      }
    }
    getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
      title: ':mag_right: Sublimações encontradas',
      fields: [
        {
          name: 'Busca',
          value: ':red_square: :red_square: :green_square: :blue_square:',
          inline: true
        },
        {
          name: 'Resultados',
          value: 4,
          inline: true
        },
        {
          name: 'Sublimações',
          value: 'Carnage, Evasion II, Frenzy, Frenzy II'
        }
      ]
    })
  })

  it('returns matching sublimations when searching by 4 slots with the same combinations', () => {
    let botMessage = {}
    const userMessage = {
      content: '.subli gggg',
      channel: {
        send: jest.fn(message => { botMessage = message })
      }
    }
    getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
      title: ':mag_right: Sublimações encontradas',
      fields: [
        {
          name: 'Busca',
          value: ':green_square: :green_square: :green_square: :green_square:',
          inline: true
        },
        {
          name: 'Resultados',
          value: 2,
          inline: true
        },
        {
          name: 'Sublimações',
          value: 'Devastate, Devastate II'
        }
      ]
    })
  })

  it('returns matching sublimations when searching by source', () => {
    let botMessage = {}
    const userMessage = {
      content: '.subli vertox',
      channel: {
        send: jest.fn(message => { botMessage = message })
      }
    }
    getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
      title: ':mag_right: Sublimações encontradas',
      fields: [
        {
          name: 'Busca',
          value: 'vertox',
          inline: true
        },
        {
          name: 'Resultados',
          value: 3,
          inline: true
        },
        {
          name: 'Sublimações',
          value: 'Ambush, Dimensionality, Theory of Matter'
        }
      ]
    })
  })

  it('maps correctly an argument', () => {
    let botMessage = {}
    const userMessage = {
      content: '.subli epic',
      channel: {
        send: jest.fn(message => { botMessage = message })
      }
    }
    getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
      title: ':mag_right: Sublimações encontradas',
      fields: [
        {
          name: 'Busca',
          value: 'épico',
          inline: true
        },
        {
          name: 'Resultados',
          value: 15,
          inline: true
        },
        {
          name: 'Sublimações',
          value: 'Brutalidade, Precisão Cirúrgica, Medida, Desenlace, Inflexibilidade, Constância, Saúde de Ferro, Arte do Posicionamento, Anatomia, Manejo: Duas Mãos, Manejo: Adaga, Manejo: Escudo, Pacto Wakfu, Concentração Elementar, Força Hercúlea'
        }
      ]
    })
  })

  it('replaces wrong query characters when searching by name', () => {
    let botMessage = {}
    const userMessage = {
      content: '.subli frenzy 2',
      channel: {
        send: jest.fn(message => { botMessage = message })
      }
    }
    getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
      color: '#fbfcac',
      title: ':scroll: Frenzy II',
      url: 'https://www.wakfu.com/',
      thumbnail: {
        url: 'https://static.ankama.com/wakfu/portal/game/item/115/81227111.png'
      },
      fields: [
        {
          name: 'Slot',
          value: ':red_square: :green_square: :blue_square:',
          inline: true
        },
        {
          name: 'Max Stacks',
          value: '1',
          inline: true
        },
        {
          name: 'Efeitos',
          value: '-15% damage inflicted, 5% damage inflicted per affected entity at the start of the next turn'
        },
        {
          name: 'Obtenção:',
          value: 'Badgwitch the Furiox (1%) [3 stele/estela]'
        }
      ],
      footer: {
        text: 'Sublimações encontradas: Frenzy II, Frenzy III'
      }
    })
  })

  it('returns a not found message if no sublimation was found', () => {
    let botMessage = {}
    const userMessage = {
      content: '.subli caracas',
      channel: {
        send: jest.fn(message => { botMessage = message })
      }
    }
    getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
      color: '#bb1327',
      title: ':x: Nenhuma sublimação encontrada',
      description: 'Digite `.help subli` para conferir alguns exemplos de como pesquisar.'
    })
  })

  it('returns a help message if no query was provided', () => {
    let botMessage = {}
    const userMessage = {
      content: '.subli',
      channel: {
        send: jest.fn(message => { botMessage = message })
      }
    }
    getSublimation(userMessage)
    expect(botMessage.embed).toMatchObject({
      description: commandsHelp.subli
    })
  })
})
