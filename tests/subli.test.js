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
      content: '.subli frenesi',
      channel: {
        send: jest.fn(message => { botMessage = message })
      }
    }
    getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
      color: '#fbfcac',
      title: ':scroll: Frenesi',
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
          value: '-20% de Danos causados, No começo do turno: 10% dos danos infligidos por inimigo afetado no turno anterior'
        },
        {
          name: 'Obtenção:',
          value: 'Aguabrial (2%)'
        }
      ],
      footer: {
        text: 'Sublimações encontradas: Frenesi, Frenesi II, Frenesi III'
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
          value: 'Emboscada, Espinhos, Integridade'
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
          value: 'Emboscada, Firmeza, Escamas de Lua, Espinhos, Firmeza II, Reprovação II, Integridade'
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
          value: 'Ruína, Emboscada, Determinação, Solidez, Firmeza, Teoria da Matéria, Escamas de Lua, Presteza, Salvaguarda, Ruína II, Espinhos, Barreira a Distância, Tenacidade II, Firmeza II, Ciclotimia, Reprovação II, Frenesi III, Extensão, Integridade'
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
          value: 'Assolação, Carnificina, Evasão, Reprovação, Espanto, Dimensionalidade, Voltar, Crítico Berserk, Visibilidade, Assolação II, Evasão II, Esquiva Berserk, Poço de Vitalidade, Influência, Muralha, Retorno II, Influence II, Especialista em Golpes Críticos, Lobo solitário, Determinação, Tenacidade, Solidez, Topologia, Frenesi, Teoria da Matéria, Barreira a Distância, Barreira Corpo a Corpo, Tenacidade II, Parada Berserk, Frenesi II, Ciclotimia'
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
          value: 'Carnificina, Evasão II, Frenesi, Frenesi II'
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
          value: 'Assolação, Assolação II'
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
          value: 'Emboscada, Dimensionalidade, Teoria da Matéria'
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
      content: '.subli frenesi 2',
      channel: {
        send: jest.fn(message => { botMessage = message })
      }
    }
    getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
      color: '#fbfcac',
      title: ':scroll: Frenesi II',
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
          value: '-15% de Danos causados, No começo do turno: 5% dos danos infligidos por entidade afetada no turno anterior.'
        },
        {
          name: 'Obtenção:',
          value: 'Bruxugo de Bler, o Furioso (1%) [3 stele/estela]'
        }
      ],
      footer: {
        text: 'Sublimações encontradas: Frenesi II, Frenesi III'
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
