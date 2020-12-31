import { getEquipment } from '../src/commands'
import helpMessages from '../src/utils/helpMessages'
import { mockMessage } from './testUtils'

describe('getEquipment', () => {
  it('return a matching equipment by name', async () => {
    const content = '.equip tentacled belt'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed).toEqual({
      url: 'https://www.wakfu.com/en/mmorpg/encyclopedia/armors/27645',
      color: '#fede71',
      title: ':yellow_circle: Tentacled Belt',
      description: "It works like a typical belt, but you can't really say it does any more than that.\nID: 27645",
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

  it('return the matching equipment when using query without accents', async () => {
    const content = '.equip lemico lang=pt'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed.title).toEqual(':yellow_circle: Chapéu Lêmico')
  })

  it('return the matching equipment when using query with accents', async () => {
    const content = '.equip lêmico lang=pt'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed.title).toEqual(':yellow_circle: Chapéu Lêmico')
  })

  it('return a matching equipment by name and rarity with rarity argument is provided', async () => {
    const content = '.equip the eternal rarity=mythical'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed.fields).toEqual(expect.arrayContaining([{
      name: 'Rarity',
      value: 'Mythical',
      inline: true
    }]))
  })

  it('return a matching equipment by name and rarity with rarity argument is provided on another language', async () => {
    const content = '.equip o eterno raridade=mítico lang=pt'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed.title).toEqual(':orange_circle: O Eterno')
    expect(botMessage.embed.fields).toEqual(expect.arrayContaining([{
      name: 'Raridade',
      value: 'Mítico',
      inline: true
    }]))
  })

  it('return a matching equipment by name and rarity with rarity argument with mixed languages', async () => {
    const content = '.equip o eterno raridade=mythical lang=pt'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed.title).toEqual(':orange_circle: O Eterno')
    expect(botMessage.embed.fields).toEqual(expect.arrayContaining([{
      name: 'Raridade',
      value: 'Mítico',
      inline: true
    }]))
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
      { name: 'Conditions', value: 'Unique' }
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
      text: "Equipment found: Dazzling Belt (Epic), Ush's Cards (Epic), Cockabootsledo (Epic), Hazieff's Helmet (Epic), Wa Wabbit's Cwown (Epic), Genetically Modified Epaulettes (Epic), Claymore of Fhenris (Epic), Bax Stab Ax (Epic), Claymus Shushu (Epic), Emiwlet Amulet (Epic), Lenald Walm Pelt (Epic), Vizion Dagger (Epic), Trool Warrior Spikes (Epic), Sanefty Belt (Epic), Happy Sram Kimono (Epic), Durable Shield (Epic), Limited Edition Cape (Epic), Dora Lagoole (Epic), Welder Mask (Epic), Viktorious Rapier (Epic) and other 4846 results"
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
