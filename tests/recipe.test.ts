import RecipeCommand from '../src/commands/Recipe'
import helpMessages from '../src/utils/helpMessages'
import { executeCommandAndSpySentMessage, embedContaining } from './testutils'

describe('RecipeCommand', () => {
  it('replies a matching recipe by name', async () => {
    const spy = await executeCommandAndSpySentMessage(RecipeCommand, '.recipe kaw breastplate')
    expect(spy).toHaveBeenCalledWith(embedContaining({
      color: 0xfede71,
      title: '<:legendary:888866409382314085> Recipe: Kaw Breastplate',
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
<:rare:888866409583620159> \`4x   \` Whirligig Breastplate
:adhesive_bandage: \`35x  \` Durable Souper-Glou
:white_small_square: \`4x   \` Ice Stick
:white_small_square: \`4x   \` Mekeynism
:white_small_square: \`4x   \` Ponk-tius
:white_small_square: \`4x   \` Eternal Ice`,
          inline: false
        }
      ]
    }))
  })

  it('replies a translated recipe with "translate" option', async () => {
    const spy = await executeCommandAndSpySentMessage(RecipeCommand, '.recipe peace pipe translate=pt')
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: '<:legendary:888866409382314085> Receita: Cachimbo Dapais'
    }))
  })

  it('replies a matching recipe by name and rarity', async () => {
    const spy = await executeCommandAndSpySentMessage(RecipeCommand, '.recipe peace pipe rarity=mythical')
    expect(spy).toHaveBeenCalledWith(embedContaining({
      color: 0xfd8e39,
      title: '<:mythic:888866409734627348> Recipe: Peace Pipe',
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
<:rare:888866409583620159> \`1x   \` Peace Pipe
:white_small_square: \`3x   \` Rancid Fragrance
:white_small_square: \`21x  \` Rough Vapor
:white_small_square: \`3x   \` Hot Ashes`,
          inline: false
        }
      ]
    }))
  })

  it('replies a matching recipe and more matching results on footer', async () => {
    const spy = await executeCommandAndSpySentMessage(RecipeCommand, '.recipe amakna')
    expect(spy).toHaveBeenCalledWith(embedContaining({
      footer: {
        text: 'Recipes found: Amakna Sword (Relic), Amakna Riktus Epaulettes (Mythical), Amakna Riktus Boots (Mythical), Amakna Root Beer, Amakna Riktus Epaulettes, Amakna Riktus Boots, Amakna Bench, Amakna Throne'
      }
    }))
  })

  it('replies a matching recipe and a truncated more results on footer', async () => {
    const spy = await executeCommandAndSpySentMessage(RecipeCommand, '.recipe sword')
    expect(spy).toHaveBeenCalledWith(embedContaining({
      footer: {
        text: "Recipes found: Sufokia Sword (Relic), Bonta Sword (Relic), Brakmar Sword (Relic), Eternal Sword (Relic), Tot's Great Big Sword  (Legendary), Whirly Sword (Legendary), Homely Sword (Legendary), Cease Sword (Legendary), Millennium Sword (Legendary), Steel Beak Sword (Legendary), Relay Kamasword (Legendary), Sworden (Legendary), Infected Cawwot Sword (Legendary), The Spin Ache Sword (Legendary), Black Crow's Sword  (Legendary), Sword of Iop (Legendary), Emerasword (Legendary), Elite Riktus Sword (Legendary), Good Eye Sword (Legendary), Bad Aboum's Sword (Legendary) and other 50 results"
      }
    }))
  })

  it('replies a merged recipe when there are more recipes for the same result', async () => {
    const spy = await executeCommandAndSpySentMessage(RecipeCommand, '.recipe eternal leather')
    expect(spy).toHaveBeenCalledWith(embedContaining({
      color: 0xBCC0C0,
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
          value: ':white_small_square: `4x   ` Rough Vapor\n:white_small_square: `4x   ` Dreggon Shell',
          inline: false
        },
        {
          name: 'Ingredients',
          value: ':white_small_square: `4x   ` Magmatic Embers\n:white_small_square: `4x   ` Badgerox Fang',
          inline: false
        },
        {
          name: 'Ingredients',
          value: ':white_small_square: `4x   ` Pandala Ghostoplasm\n:white_small_square: `4x   ` Blightopard Fur',
          inline: false
        },
        {
          name: 'Ingredients',
          value: ':white_small_square: `8x   ` Bubourg Claw',
          inline: false
        }
      ]
    }))
  })

  it('replies a not found message if no recipe has been found', async () => {
    const spy = await executeCommandAndSpySentMessage(RecipeCommand, '.recipe asdasd')
    expect(spy).toHaveBeenCalledWith(embedContaining({
      color: 0xbb1327,
      description: 'Type `.help recipe` to see some examples of how to search.',
      title: ':x: No results'
    }))
  })

  it('replies a help message if no query was provided', async () => {
    const spy = await executeCommandAndSpySentMessage(RecipeCommand, '.recipe')
    expect(spy).toHaveBeenCalledWith(embedContaining({
      description: helpMessages.recipe.help.en
    }))
  })
})
