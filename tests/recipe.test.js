import { getRecipe } from '../src/commands'
import helpMessages from '../src/utils/helpMessages'
import { mockMessage } from './testUtils'

describe('getRecipe', () => {
  it('return a matching recipe by name', async () => {
    const content = '.recipe kaw breastplate'
    const userMessage = mockMessage(content)
    const botMessage = await getRecipe(userMessage)
    expect(botMessage.embed).toEqual({
      color: '#fede71',
      title: ':yellow_circle: Recipe: Kaw Breastplate',
      thumbnail: { url: 'https://static.ankama.com/wakfu/portal/game/item/115/13625074.png' },
      fields: [
        {
          name: 'Profession',
          value: ':shield: Armorer',
          inline: true
        },
        {
          name: 'Level',
          value: 80,
          inline: true
        },
        {
          name: 'Ingredients',
          value: `:pick: \`7x   \` Rose of the Sands
:green_circle: \`4x   \` Whirligig Breastplate
:adhesive_bandage: \`35x  \` Durable Souper-Glou
:white_small_square: \`4x   \` Ice Stick
:white_small_square: \`4x   \` Mekeynism
:white_small_square: \`4x   \` Ponk-tius
:white_small_square: \`4x   \` Eternal Ice`
        }
      ]
    })
  })

  it('return a translated recipe with "translate" option', async () => {
    const content = '.recipe peace pipe translate=pt'
    const userMessage = mockMessage(content)
    const botMessage = await getRecipe(userMessage)
    expect(botMessage.embed.title).toEqual(':yellow_circle: Receita: Cachimbo Dapais')
  })

  it('return a matching recipe by name and rarity', async () => {
    const content = '.recipe peace pipe rarity=mythical'
    const userMessage = mockMessage(content)
    const botMessage = await getRecipe(userMessage)
    expect(botMessage.embed).toEqual({
      color: '#fd8e39',
      title: ':orange_circle: Recipe: Peace Pipe',
      thumbnail: { url: 'https://static.ankama.com/wakfu/portal/game/item/115/25321811.png' },
      fields: [
        {
          name: 'Profession',
          value: ':crossed_swords: Weapons Master',
          inline: true
        },
        {
          name: 'Level',
          value: 128,
          inline: true
        },
        {
          name: 'Ingredients',
          value: `:palm_tree: \`2x   \` Tabas'KO Wood
:adhesive_bandage: \`30x  \` Eternal Souper-Glou
:shell: \`9x   \` Eternal Essence
:sparkles: \`52x  \` Powder
:green_circle: \`1x   \` Peace Pipe
:white_small_square: \`3x   \` Rancid Fragrance
:white_small_square: \`21x  \` Rough Vapor
:white_small_square: \`3x   \` Hot Ashes`
        }
      ]
    })
  })

  it('return a matching recipe and more matching results on footer', async () => {
    const content = '.recipe amakna'
    const userMessage = mockMessage(content)
    const botMessage = await getRecipe(userMessage)
    expect(botMessage.embed.footer).toEqual({
      text: 'Recipes found: Amakna Sword (Relic), Amakna Riktus Boots (Mythical), Amakna Riktus Epaulettes (Mythical), Amakna Riktus Boots, Amakna Riktus Epaulettes, Amakna Root Beer'
    })
  })

  it('return a matching recipe and a truncated more results on footer', async () => {
    const content = '.recipe sword'
    const userMessage = mockMessage(content)
    const botMessage = await getRecipe(userMessage)
    expect(botMessage.embed.footer).toEqual({
      text: "Recipes found: Eternal Sword (Relic), Brakmar Sword (Relic), Sufokia Sword (Relic), Amakna Sword (Relic), Tot's Great Big Sword  (Legendary), Kila Sword (Legendary), Wooden Riktus Sword (Legendary), Pepepew Sword (Legendary), Broken Sword (Legendary), Bad Aboum's Sword (Legendary), Good Eye Sword (Legendary), Elite Riktus Sword (Legendary), Whirly Sword (Legendary), Homely Sword (Legendary), Cease Sword (Legendary), Millennium Sword (Legendary), Steel Beak Sword (Legendary), Dizia the Surreal Sword (Legendary), Relay Kamasword (Legendary), Sworden (Legendary) and other 50 results"
    })
  })

  it('returns a merged recipe when there are more recipes for the same result', async () => {
    const content = '.recipe eternal leather'
    const userMessage = mockMessage(content)
    const botMessage = await getRecipe(userMessage)
    expect(botMessage.embed).toEqual({
      color: 'LIGHT_GREY',
      title: 'Recipe: Eternal Leather',
      thumbnail: { url: 'https://static.ankama.com/wakfu/portal/game/item/115/71919804.png' },
      fields: [
        {
          name: 'Profession',
          value: ':boot: Leather Dealer',
          inline: true
        },
        {
          name: 'Level',
          value: 120,
          inline: true
        },
        {
          name: 'Ingredients',
          value: ':white_small_square: `4x   ` Rough Vapor\n:white_small_square: `4x   ` Dreggon Shell'
        },
        {
          name: 'Ingredients',
          value: ':white_small_square: `4x   ` Pandala Ghostoplasm\n:white_small_square: `4x   ` Blightopard Fur'
        },
        {
          name: 'Ingredients',
          value: ':white_small_square: `4x   ` Magmatic Embers\n:white_small_square: `4x   ` Badgerox Fang'
        },
        {
          name: 'Ingredients',
          value: ':white_small_square: `8x   ` Bubourg Claw'
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
      description: 'Type `.help recipe` to see some examples of how to search.',
      title: ':x: No results'
    })
  })

  it('returns a help message if no query was provided', async () => {
    const content = '.recipe'
    const userMessage = mockMessage(content)
    const botMessage = await getRecipe(userMessage)
    expect(botMessage.embed).toMatchObject({
      description: helpMessages.recipe.help.en
    })
  })
})
