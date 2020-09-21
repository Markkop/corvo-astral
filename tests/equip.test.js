import { getEquipment } from '../src/commands'
import helpMessages from '../src/utils/helpMessages'
import { mockMessage } from './testUtils'

describe('getEquipment', () => {
  it('return a matching equipment by name', async () => {
    const content = '.equip tentacled belt'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed).toEqual({
      color: '#fede71',
      title: ':yellow_circle: Tentacled Belt',
      description: "It works like a typical belt, but you can't really say it does any more than that.",
      thumbnail: {
        url: 'https://static.ankama.com/wakfu/portal/game/item/115/13327644.png'
      },
      fields: [
        {
          name: 'Level',
          value: 215,
          inline: true
        },
        {
          name: 'Type',
          value: 'Belt',
          inline: true
        },
        {
          name: 'Rarity',
          value: 'Legendary',
          inline: true
        },
        {
          name: 'Equipped',
          value: '286 HP\n47 Dodge\n30 Prospecting\n6% Critical Hit\n218 Mastery of 2 random element\n118 Distance Mastery\n47 :fire: Resistance\n47 :herb: Resistance'
        },
        {
          inline: true,
          name: 'Profession',
          value: ':boot: Leather Dealer'
        },
        {
          inline: true,
          name: 'Level',
          value: 140
        },
        {
          name: 'Ingredients',
          value: `:orange_circle: \`1x   \` Tentacled Belt
:boot: \`38x  \` Divine Leather
:adhesive_bandage: \`63x  \` Divine Souper-Glou
:sunflower: \`8x   \` Delphinia
:sparkles: \`287x \` Powder
:white_small_square: \`75x  \` Sirius Pincer
:white_small_square: \`7x   \` Cerebratacean Carapace
:white_small_square: \`8x   \` Lashing Pincer`
        }
      ],
      footer: {
        text: 'Equipment found: Tentacled Belt (Legendary), Tentacled Belt (Mythical)'
      }
    })
  })

  it('return a matching equipment by name with higher rarity by default', async () => {
    const content = '.equip the eternal'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed.fields).toEqual(expect.arrayContaining([{
      name: 'Rarity',
      value: 'Souvenir',
      inline: true
    }]))
  })

  it('return a translated equip with "translate" option', async () => {
    const content = '.equip peace pipe translate=pt'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed.title).toEqual(':yellow_circle: Cachimbo Dapais')
  })

  it('return a matching equipment by name with lower rarity with rarity argument is provided', async () => {
    const content = '.equip the eternal rarity=mythical'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed.fields).toEqual(expect.arrayContaining([{
      name: 'Rarity',
      value: 'Mythical',
      inline: true
    }]))
  })

  it('return a matching equipment with a recipe', async () => {
    const content = '.equip brakmar sword'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed.fields).toEqual(expect.arrayContaining([
      {
        name: 'Profession',
        value: ':crossed_swords: Weapons Master',
        inline: true
      },
      {
        name: 'Level',
        value: 130,
        inline: true
      },
      {
        name: 'Ingredients',
        value: `:pick: \`80x  \` Polished Ruby
:pick: \`40x  \` Carbon Hara
:adhesive_bandage: \`400x \` Eternal Souper-Glou
:sparkles: \`717x \` Powder
:white_small_square: \`20x  \` Golden Brown Dung
:white_small_square: \`20x  \` Royal Canine
:white_small_square: \`20x  \` Blopzart Essence
:white_small_square: \`20x  \` Stalagmama`
      }
    ]))
  })

  it('return the condition if the resulting equipment has one', async () => {
    const content = '.equip amakna sword'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed.fields).toEqual(expect.arrayContaining([{
      name: 'Conditions',
      value: 'Have Amakna Ring equipped'
    }]))
  })

  it('return the useEffect description if the resulting equipment has one', async () => {
    const content = '.equip Toothpick'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed.fields).toEqual(expect.arrayContaining([{
      name: 'In use',
      value: ':star2: Damage: 46'
    }]))
  })

  it('does not return the effects for an equipment that does not have one ', async () => {
    const content = '.equip brakmar ring'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed.fields).toEqual([
      { inline: true, name: 'Level', value: 200 },
      { inline: true, name: 'Type', value: 'Ring' },
      { inline: true, name: 'Rarity', value: 'Epic' },
      { name: 'Conditions', value: 'Unique' },
      {
        inline: true,
        name: 'Profession',
        value: ':ring: Jeweler'
      },
      {
        inline: true,
        name: 'Level',
        value: 130
      },
      {
        name: 'Ingredients',
        value: `:pick: \`15x  \` Carbon Hara
:sparkles: \`300x \` Powder
:chair: \`25x  \` Eternal Orb
:droplet: \`1400x\` Ogrest's Tear
:adhesive_bandage: \`300x \` Eternal Souper-Glou
:orange_circle: \`5x   \` Pilfer Ring
:ring: \`100x \` Eternal Gem`
      }
    ])
  })

  it('return a footer with more equipment found if results are more than one', async () => {
    const content = '.equip amakna'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed.footer).toEqual({
      text: 'Equipment found: Amakna Ring (Epic), Amakna Sword (Relic), Captain Amakna Shield (Relic), Amakna Riktus Boots (Mythical), Amakna Riktus Epaulettes (Mythical), Amakna Riktus Mask (Mythical), Amakna Riktus Breastplate (Mythical), Amakna Riktus Boots (Rare), Amakna Riktus Epaulettes (Rare)'
    })
  })

  it('return a footer with truncated results if there are too many', async () => {
    const content = '.equip a'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed.footer).toEqual({
      text: "Equipment found: Dazzling Belt (Epic), Ush's Cards (Epic), Cockabootsledo (Epic), Hazieff's Helmet (Epic), Wa Wabbit's Cwown (Epic), Genetically Modified Epaulettes (Epic), Claymore of Fhenris (Epic), Bax Stab Ax (Epic), Claymus Shushu (Epic), Emiwlet Amulet (Epic), Lenald Walm Pelt (Epic), Vizion Dagger (Epic), Trool Warrior Spikes (Epic), Sanefty Belt (Epic), Happy Sram Kimono (Epic), Durable Shield (Epic), Limited Edition Cape (Epic), Dora Lagoole (Epic), Welder Mask (Epic), Viktorious Rapier (Epic) and other 4688 results"
    })
  })

  it('return a not found message if no equip was found', async () => {
    const content = '.equip asdasdasd'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed).toEqual({
      color: '#bb1327',
      description: 'Type `.help equip` to see some examples of how to search.',
      title: ':x: No results'
    })
  })

  it('return a help message if no query was provided', async () => {
    const content = '.equip'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed).toMatchObject({
      description: helpMessages.equip.help.en
    })
  })
})
