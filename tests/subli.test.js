import { getSublimation } from '../src/commands'
import { commandsHelp } from '../src/commands/help'
import { mockMessage } from './testUtils'

describe('getSublimation', () => {
  it('returns a sublimation when finding only one result', async () => {
    const content = '.subli brutality'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
      color: '#fd87ba',
      title: ':gem: Brutality',
      thumbnail: {
        url: 'https://static.ankama.com/wakfu/portal/game/item/115/68325796.png'
      },
      fields: [
        {
          name: 'Slots',
          value: 'Epic',
          inline: true
        },
        {
          name: 'Max stacking',
          value: '1',
          inline: true
        },
        {
          name: 'Effects',
          value: "If the bearer has more Area Mastery than Melee Mastery, adds the bearer's Melee Mastery to their Area Mastery and removes an equal amount of Distance Mastery at the start of combat."
        },
        {
          name: 'Acquiring',
          value: 'End-of-season Ultimate Boss Chest (UB)'
        }
      ]
    })
  })

  it('returns a sublimation and more results when finding more than one', async () => {
    const content = '.subli frenzy'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
      color: '#fd8e39',
      title: ':scroll: Frenesi',
      thumbnail: {
        url: 'https://static.ankama.com/wakfu/portal/game/item/115/81227111.png'
      },
      fields: [
        {
          name: 'Slots',
          value: ':red_square: :green_square: :blue_square:',
          inline: true
        },
        {
          name: 'Max stacking',
          value: '1',
          inline: true
        },
        {
          name: 'Effects',
          value: '-20% de Danos causados, No começo do turno: 10% dos danos infligidos por inimigo afetado no turno anterior'
        },
        {
          name: 'Acquiring',
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

  it('returns sublimations with "random" argument', async () => {
    const content = '.subli rgb random'
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
          value: 'Dimensionalidade, Muralha, Lobo Solitário'
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
          value: 'Assolação, Carnificina, Evasão, Reprovação, Espanto, Dimensionalidade, Voltar, Crítico Berserk, Visibilidade, Assolação II, Evasão II, Esquiva Berserk, Poço de Vitalidade, Influência, Muralha, Retorno II, Influência II, Especialista em Golpes Críticos, Lobo Solitário, Determinação, Tenacidade, Solidez, Topologia, Frenesi, Teoria da Matéria, Barreira a Distância, Barreira Corpo a Corpo, Tenacidade II, Parada Berserk, Frenesi II, Ciclotimia'
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
          value: 'epic',
          inline: true
        },
        {
          name: 'Resultados',
          value: 15,
          inline: true
        },
        {
          name: 'Sublimações',
          value: 'Inflexibilidade, Constância, Desenlace, Precisão Cirúrgica, Medida, Saúde de Ferro, Arte do posicionamento, Anatomia, Brutalidade, Força Hercúlea, Manejo: Duas mãos, Manejo: Adaga, Manejo: Escudo, Pacto Wakfu, Concentração Elementar'
        }
      ]
    })
  })

  it('replaces wrong query characters when searching by name', async () => {
    const content = '.subli frenesi 2'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
      color: '#fd8e39',
      title: ':scroll: Frenesi II',
      thumbnail: {
        url: 'https://static.ankama.com/wakfu/portal/game/item/115/81227111.png'
      },
      fields: [
        {
          name: 'Slots',
          value: ':red_square: :green_square: :blue_square:',
          inline: true
        },
        {
          name: 'Max stacking',
          value: '1',
          inline: true
        },
        {
          name: 'Effects',
          value: '-15% de Danos causados, No começo do turno: 5% dos danos infligidos por entidade afetada no turno anterior.'
        },
        {
          name: 'Acquiring',
          value: 'Bruxugo de Bler, o Furioso (1%) (3 estelas)'
        }
      ],
      footer: {
        text: 'Sublimações encontradas: Frenesi II, Frenesi III'
      }
    })
  })

  it('return a matching sublimation with a recipe', async () => {
    const content = '.subli solidez'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
    expect(botMessage.embed.fields).toEqual(expect.arrayContaining([
      {
        inline: true,
        name: 'Profissão',
        value: ':chair: Marceneiro'
      },
      {
        inline: true,
        name: 'Nível',
        value: 60
      },
      {
        name: 'Ingredientes',
        value: `:chair: \`10x  \` Suporte bruto
:pick: \`15x  \` Ametista Coração-de-Dragão
:sparkles: \`50x  \` Pó
:white_small_square: \`12x  \` Chifre de Escara
:white_small_square: \`10x  \` Canino Real
:white_small_square: \`40x  \` Sopro de Enxofre`
      }
    ]))
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
