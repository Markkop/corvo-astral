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
          name: 'Profissão',
          value: ':shield: Armeiro',
          inline: true
        },
        {
          name: 'Nível',
          value: 80,
          inline: true
        },
        {
          name: 'Ingredientes',
          value: `:pick: \`7x   \` Rosa do Deserto
:green_circle: \`4x   \` Peitoral Turbilhento
:adhesive_bandage: \`35x  \` Bond, Super Bond durável
:white_small_square: \`4x   \` Bastão de Gelo
:white_small_square: \`4x   \` Deschavadora
:white_small_square: \`4x   \` Pik-tus
:white_small_square: \`4x   \` Gelo Eterno`
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
          name: 'Profissão',
          value: ':crossed_swords: Mestre de armas',
          inline: true
        },
        {
          name: 'Nível',
          value: 128,
          inline: true
        },
        {
          name: 'Ingredientes',
          value: `:palm_tree: \`2x   \` Madeira de Tabas-KO
:adhesive_bandage: \`30x  \` Bond, Super Bond eterna
:shell: \`9x   \` Essência Eterna
:sparkles: \`52x  \` Pó
:green_circle: \`1x   \` Cachimbo Dapais
:white_small_square: \`3x   \` Fragrância Rançosa
:white_small_square: \`21x  \` Vapor Azedo
:white_small_square: \`3x   \` Cinzas Quentes`
        }
      ]
    })
  })

  it('return a matching recipe and more matching results on footer', async () => {
    const content = '.recipe o eterno'
    const userMessage = mockMessage(content)
    const botMessage = await getRecipe(userMessage)
    expect(botMessage.embed).toEqual({
      color: '#8fc7e2',
      title: ':blue_circle: Receita de O Eterno',
      thumbnail: { url: 'https://builder.methodwakfu.com/assets/icons/items/12019145.webp' },
      fields: [
        {
          name: 'Profissão',
          value: ':ring: Joalheiro',
          inline: true
        },
        {
          name: 'Nível',
          value: 140,
          inline: true
        },
        {
          name: 'Ingredientes',
          value: `:sparkles: \`410x \` Pó
:yellow_circle: \`1x   \` O Eterno
:fish: \`105x \` Camarrento
:ring: \`54x  \` Pedra Divina
:droplet: \`400x \` Lágrima de Ogrest
:white_small_square: \`11x  \` Cauda de Estorritardo
:white_small_square: \`9x   \` Cauda de Scorpisoteio
:white_small_square: \`107x \` Cutícula de Estorritardo`
        }
      ],
      footer: {
        text: 'Receitas encontradas: O Eterno (Lendário), Couro eterno, Cabo eterno, Tempero eterno, Óleo eterno, Aço Eterno, Fio Eterno'
      }
    })
  })

  it('return a matching recipe and a truncated more results on footer', async () => {
    const content = '.recipe espada'
    const userMessage = mockMessage(content)
    const botMessage = await getRecipe(userMessage)
    expect(botMessage.embed.footer).toEqual({
      text: 'Receitas encontradas: Espada Eterna (Relíquia), Espada de Brakmar (Relíquia), Espada de Sufokia (Relíquia), Espada de Amakna (Relíquia), Espada Neval (Lendário), Espada Enorme de Tot  (Lendário), Espada Kila (Lendário), Espada Riktus de Madeira (Lendário), Espada de Popopou (Lendário), Espada Quebrada (Lendário), Espada de Tchak Abum (Lendário), Espada Bonzólios (Lendário), Espada Riktus de Elite (Lendário), Espada Turbilária (Lendário), Espada Rústica (Lendário), Espada Enevoada (Lendário), Espada Descontínua (Lendário), Espada milenar (Lendário), Espada do Garra de Aço (Lendário), Colhespada (Lendário) e outros 46 resultados'
    })
  })

  it('returns a merged recipe when there are more recipes for the same result', async () => {
    const content = '.recipe couro eterno'
    const userMessage = mockMessage(content)
    const botMessage = await getRecipe(userMessage)
    expect(botMessage.embed).toEqual({
      color: 'LIGHT_GREY',
      title: 'Receita de Couro eterno',
      thumbnail: { url: 'https://static.ankama.com/wakfu/portal/game/item/115/71919804.png' },
      fields: [
        {
          name: 'Profissão',
          value: ':boot: Coureiro',
          inline: true
        },
        {
          name: 'Nível',
          value: 120,
          inline: true
        },
        {
          name: 'Ingredientes',
          value: ':white_small_square: `4x   ` Vapor Azedo\n:white_small_square: `4x   ` Casca de Dragovo'
        },
        {
          name: 'Ingredientes',
          value: ':white_small_square: `4x   ` Fanctoplasma de Pandala\n:white_small_square: `4x   ` Pelagem de Flagelopardo'
        },
        {
          name: 'Ingredientes',
          value: ':white_small_square: `4x   ` Brasas Magmáticas\n:white_small_square: `4x   ` Presa de Texox'
        },
        {
          name: 'Ingredientes',
          value: ':white_small_square: `8x   ` Pata de Strigifrent'
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
