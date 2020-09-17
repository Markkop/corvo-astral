import { getRecipe } from '../src/commands'
import { commandsHelp } from '../src/commands/help'
import { mockMessage } from './testUtils'

describe('getRecipe', () => {
  it('return a matching recipe by name', async () => {
    const content = '.recipe peitoral krá'
    const userMessage = mockMessage(content)
    const botMessage = await getRecipe(userMessage)
    expect(botMessage.embed).toEqual({
      color: '#fede71',
      title: ':yellow_circle: Receita de Peitoral Krá',
      thumbnail: { url: 'https://builder.methodwakfu.com/assets/icons/items/13625074.webp' },
      fields: [
        {
          name: ':tools: Profissão',
          value: 'Armeiro',
          inline: true
        },
        {
          name: ':mortar_board: Nível',
          value: 80,
          inline: true
        },
        {
          name: 'Ingredientes',
          value: `:white_small_square: 4x Gelo Eterno
:white_small_square: 4x Pik-tus
:white_small_square: 35x Bond, Super Bond durável
:green_circle: 4x Peitoral Turbilhento
:pick: 7x Rosa do Deserto
:white_small_square: 4x Deschavadora
:white_small_square: 4x Bastão de Gelo`
        }
      ]
    })
  })

  it('return a matching recipe by name and rarity', async () => {
    const content = '.recipe cachimbo dapais raridade=mítico'
    const userMessage = mockMessage(content)
    const botMessage = await getRecipe(userMessage)
    expect(botMessage.embed).toEqual({
      color: '#fd8e39',
      title: ':orange_circle: Receita de Cachimbo Dapais',
      thumbnail: { url: 'https://builder.methodwakfu.com/assets/icons/items/25321811.webp' },
      fields: [
        {
          name: ':tools: Profissão',
          value: 'Mestre de armas',
          inline: true
        },
        {
          name: ':mortar_board: Nível',
          value: 128,
          inline: true
        },
        {
          name: 'Ingredientes',
          value: `:green_circle: 1x Cachimbo Dapais
:white_small_square: 52x Pó
:white_small_square: 3x Cinzas Quentes
:white_small_square: 9x Essência Eterna
:white_small_square: 21x Vapor Azedo
:white_small_square: 30x Bond, Super Bond eterna
:palm_tree: 2x Madeira de Tabas-KO
:white_small_square: 3x Fragrância Rançosa`
        }
      ]
    })
  })

  it('return a matching recipe and more matching results on footer', async () => {
    const content = '.recipe o eterno'
    const userMessage = mockMessage(content)
    const botMessage = await getRecipe(userMessage)
    expect(botMessage.embed).toEqual({
      color: 'LIGHT_GREY',
      title: 'Receita de Fio Eterno',
      thumbnail: { url: 'https://static.ankama.com/wakfu/portal/game/item/115/71919456.png' },
      fields: [
        {
          name: ':tools: Profissão',
          value: 'Herborista',
          inline: true
        },
        {
          name: ':mortar_board: Nível',
          value: 125,
          inline: true
        },
        {
          name: 'Ingredientes',
          value: ':sunflower: 5x Mumusgo\n:sunflower: 5x Folha de Urtiga'
        }
      ],
      footer: {
        text: 'Aço Eterno, Óleo eterno, Tempero eterno, Cabo eterno, Couro eterno, :yellow_circle: O Eterno, :blue_circle: O Eterno'
      }
    })
  })

  it('returns a merged recipe when there are more recipes for the same result', async () => {
    const content = '.recipe couro eterno'
    const userMessage = mockMessage(content)
    const botMessage = await getRecipe(userMessage)
    expect(botMessage.embed).toEqual({
      color: 'LIGHT_GREY',
      title: 'Receita de Couro eterno',
      thumbnail: { url: 'https://static.ankama.com/wakfu/portal/game/item/115/71919456.png' },
      fields: [
        {
          name: ':tools: Profissão',
          value: 'Coureiro',
          inline: true
        },
        {
          name: ':mortar_board: Nível',
          value: 120,
          inline: true
        },
        {
          name: 'Ingredientes',
          value: ':white_small_square: 4x Casca de Dragovo\n:white_small_square: 4x Vapor Azedo'
        },
        {
          name: 'Ingredientes',
          value: ':white_small_square: 4x Presa de Texox\n:white_small_square: 4x Brasas Magmáticas'
        },
        {
          name: 'Ingredientes',
          value: ':white_small_square: 4x Pelagem de Flagelopardo\n:white_small_square: 4x Fanctoplasma de Pandala'
        },
        {
          name: 'Ingredientes',
          value: ':white_small_square: 8x Pata de Strigifrent'
        }
      ]
    })
  })

  it('returns a not found message if no recipe has been found', async () => {
    const content = '.recipe asdasd'
    const userMessage = mockMessage(content)
    const botMessage = await getRecipe(userMessage)
    expect(botMessage.embed).toMatchObject({
      color: '#bb1327',
      title: ':x: Nenhuma receita encontrada',
      description: 'Digite `.help recipe` para conferir alguns exemplos de como pesquisar.'
    })
  })

  it('returns a help message if no query was provided', async () => {
    const content = '.recipe'
    const userMessage = mockMessage(content)
    const botMessage = await getRecipe(userMessage)
    expect(botMessage.embed).toMatchObject({
      description: commandsHelp.recipe
    })
  })
})
