import { getSublimation } from '../src/commands'
import { commandsHelp } from '../src/commands/help'
import { mockMessage } from './testUtils'

describe('getSublimation', () => {
  it('returns a sublimation when finding only one result', async () => {
    const content = '.subli brutalidade'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
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

  it('returns a sublimation and more results when finding more than one', async () => {
    const content = '.subli frenesi'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
      color: 'LIGHT_GREY',
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

  it('returns matching sublimations when searching with three slots', async () => {
    const content = '.subli BBR'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
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

  it('returns matching sublimations when searching with one white slot', async () => {
    const content = '.subli wbr'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
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

  it('returns matching sublimations when searching with two white slots', async () => {
    const content = '.subli wwr'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
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

  it('returns sublimations with --any-order flag', async () => {
    const content = '.subli rgb --any-order'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
      title: ':mag_right: Sublimações encontradas',
      fields: [
        {
          name: 'Busca',
          value: ':red_square: :green_square: :blue_square: em qualquer ordem',
          inline: true
        },
        { name: 'Resultados', value: 13, inline: true },
        {
          name: ':red_square: :green_square: :blue_square: (2)',
          value: 'Frenesi, Frenesi II'
        },
        {
          name: ':red_square: :blue_square: :green_square: (3)',
          value: 'Dimensionalidade, Muralha, Lobo solitário'
        },
        {
          name: ':green_square: :red_square: :blue_square: (2)',
          value: 'Resistência, Resistência II'
        },
        {
          name: ':green_square: :blue_square: :red_square: (2)',
          value: 'Escamas de Lua, Reprovação II'
        },
        {
          name: ':blue_square: :red_square: :green_square: (2)',
          value: 'Voltar, Retorno II'
        },
        {
          name: ':blue_square: :green_square: :red_square: (2)',
          value: 'Teoria da Matéria, Ciclotimia'
        }
      ]
    })
  })

  it('returns non-repeated matching sublimations when searching with white slots', async () => {
    const content = '.subli wwgw'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
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
          value: 'Assolação, Carnificina, Evasão, Reprovação, Espanto, Dimensionalidade, Voltar, Crítico Berserk, Visibilidade, Assolação II, Evasão II, Esquiva Berserk, Poço de Vitalidade, Influência, Muralha, Retorno II, Influência II, Especialista em Golpes Críticos, Lobo solitário, Determinação, Tenacidade, Solidez, Topologia, Frenesi, Teoria da Matéria, Barreira a Distância, Barreira Corpo a Corpo, Tenacidade II, Parada Berserk, Frenesi II, Ciclotimia'
        }
      ]
    })
  })

  it('returns matching sublimations when searching with four slots', async () => {
    const content = '.subli rrgb'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
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

  it('returns matching sublimations when searching by 4 slots with the same combinations', async () => {
    const content = '.subli gggg'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
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

  it('returns matching sublimations when searching by source', async () => {
    const content = '.subli vertox'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
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

  it('maps correctly an argument', async () => {
    const content = '.subli epic'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
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

  it('replaces wrong query characters when searching by name', async () => {
    const content = '.subli frenesi 2'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
      color: 'LIGHT_GREY',
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

  it('returns the correct sublimation by matching its alias', async () => {
    const content = '.subli retorno'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
    expect(botMessage.embed.title).toEqual(':scroll: Voltar')
    expect(botMessage.embed.footer.text).toEqual('Sublimações encontradas: Voltar, Retorno II')
  })

  it('returns a not found message if no sublimation was found', async () => {
    const content = '.subli caracas'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
      color: '#bb1327',
      title: ':x: Nenhuma sublimação encontrada',
      description: 'Digite `.help subli` para conferir alguns exemplos de como pesquisar.'
    })
  })

  it('returns a help message if no query was provided', async () => {
    const content = '.subli'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
    expect(botMessage.embed).toMatchObject({
      description: commandsHelp.subli
    })
  })
})
