import EquipCommand, { getData } from '../src/commands/Equip'
import { executeCommandAndSpyReply, embedContaining, getParsedCommand } from './testutils'

describe('EquipmentCommand', () => {
  const commandData = getData('en')

  it('return a matching equipment by name', async () => {
    const stringCommand = '/equip name: tentacled belt lang: en'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(EquipCommand, command)
    expect(spy).toHaveBeenCalledWith(embedContaining({
      url: 'https://www.wakfu.com/en/mmorpg/encyclopedia/armors/27645',
      color: 0xfede71,
      title: '<:legendary:888866409382314085> Tentacled Belt',
      description: "It works like a typical belt, but you can't really say it does any more than that.\nID: 27645",
      thumbnail: {
        url: 'https://static.ankama.com/wakfu/portal/game/item/115/13327644.png'
      },
      fields: [
        {
          name: 'Level',
          value: "215",
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
          value: '286 HP\n47 Dodge\n6% Critical Hit\n218 Mastery of 2 random element\n118 Distance Mastery\n47 <:FIRE:888826773352120331> Resistance\n47 <:EARTH:888826773410820116> Resistance',
          inline: false
        }
      ],
      footer: {
        text: 'Equipment found: Tentacled Belt (Legendary), Tentacled Belt (Mythical)'
      }
    })
    )
  })

  it('return a matching equipment by name with higher rarity by default', async () => {
    const stringCommand = '/equip name: the eternal'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(EquipCommand, command)
    expect(spy).toHaveBeenCalledWith(embedContaining({
      fields: expect.arrayContaining([{
        name: 'Rarity',
        value: 'Souvenir',
        inline: true
      }])
    }))
  })

  it('return a translated equip with "translate" option', async () => {
    const stringCommand = '/equip name: peace pipe translate: pt'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(EquipCommand, command)
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: '<:legendary:888866409382314085> Cachimbo Dapais'
    }))
  })

  it('return the matching equipment when using query without accents', async () => {
    const stringCommand = '/equip name: lemico lang: pt'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(EquipCommand, command)
    expect(spy).toHaveBeenLastCalledWith(embedContaining({
      title: '<:legendary:888866409382314085> Chapéu Lêmico'
    }))
  })

  it('return the matching equipment when using query with accents', async () => {
    const stringCommand = '/equip name: lêmico lang: pt'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(EquipCommand, command)
    expect(spy).toHaveBeenLastCalledWith(embedContaining({
      title: '<:legendary:888866409382314085> Chapéu Lêmico'
    }))
  })

  it('return a matching equipment by name and rarity with rarity argument is provided', async () => {
    const stringCommand = '/equip name: the eternal rarity: mythical'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(EquipCommand, command)
    expect(spy).toHaveBeenLastCalledWith(embedContaining({
      fields: expect.arrayContaining([{
        name: 'Rarity',
        value: 'Mythical',
        inline: true
      }])
    }))
  })

  it('return a matching equipment by name and rarity with rarity argument is provided on another language', async () => {
    const stringCommand = '/equip name: o eterno rarity: mítico lang: pt'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(EquipCommand, command)
    expect(spy).toHaveBeenLastCalledWith(embedContaining({
      title: '<:mythic:888866409734627348> O Eterno',
      fields: expect.arrayContaining([{
        name: 'Raridade',
        value: 'Mítico',
        inline: true
      }])
    }))
  })

  it('return a matching equipment by name and rarity with rarity argument with mixed languages', async () => {
    const stringCommand = '/equip name: o eterno rarity: mythical lang: pt'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(EquipCommand, command)
    expect(spy).toHaveBeenLastCalledWith(embedContaining({
      title: '<:mythic:888866409734627348> O Eterno',
      fields: expect.arrayContaining([{
        name: 'Raridade',
        value: 'Mítico',
        inline: true
      }])
    }))
  })

  it.skip('return the condition if the resulting equipment has one', async () => {
    const stringCommand = '/equip name: amakna sword'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(EquipCommand, command)
    expect(spy).toHaveBeenLastCalledWith(embedContaining({
      fields: expect.arrayContaining([{
        name: 'Conditions',
        value: 'Have Amakna Ring equipped',
        inline: false
      }])
    }))
  })

  it('return the useEffect description if the resulting equipment has one', async () => {
    const stringCommand = '/equip name: Toothpick'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(EquipCommand, command)
    expect(spy).toHaveBeenLastCalledWith(embedContaining({
      fields: expect.arrayContaining([{
        name: 'In use',
        value: '<:LIGHT:888826773360476170> Damage: 46',
        inline: false
      }])
    }))
  })

  it('does not return the effects for an equipment that does not have one ', async () => {
    const stringCommand = '/equip name: brakmar ring'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(EquipCommand, command)
    expect(spy).toHaveBeenLastCalledWith(embedContaining({
      fields: [
        { inline: true, name: 'Level', value: "200" },
        { inline: true, name: 'Type', value: 'Ring' },
        { inline: true, name: 'Rarity', value: 'Epic' },
      ]
    }))
  })

  it('return a footer with more equipment found if results are more than one', async () => {
    const stringCommand = '/equip name: amakna'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(EquipCommand, command)
    expect(spy).toHaveBeenLastCalledWith(embedContaining({
      footer: {
        text: 'Equipment found: Amakna Ring (Epic), Amakna Sword (Relic), Captain Amakna Shield (Relic), Amakna Riktus Boots (Mythical), Amakna Riktus Epaulettes (Mythical), Amakna Riktus Mask (Mythical), Amakna Riktus Breastplate (Mythical), Amakna Riktus Boots (Rare), Amakna Riktus Epaulettes (Rare)'
      }
    }))
  })

  it('return a footer with truncated results if there are too many', async () => {
    const stringCommand = '/equip name: a'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(EquipCommand, command)
    expect(spy).toHaveBeenLastCalledWith(embedContaining({
      footer: {
        text: "Equipment found: Dazzling Belt (Epic), Ush's Cards (Epic), Cockabootsledo (Epic), Hazieff's Helmet (Epic), Wa Wabbit's Cwown (Epic), Genetically Modified Epaulettes (Epic), Claymore of Fhenris (Epic), Bax Stab Ax (Epic), Claymus Shushu (Epic), Emiwlet Amulet (Epic), Lenald Walm Pelt (Epic), Vizion Dagger (Epic), Ancient Trool Warrior Spikes (Epic), Old Sanefty Belt (Epic), Happy Sram Kimono (Epic), Durable Shield (Epic), Limited Edition Cape (Epic), Dora Lagoole (Epic), Welder Mask (Epic), Viktorious Rapier (Epic) and other 5095 results"
      }
    }))
  })

  it('return a not found message if no equip was found', async () => {
    const stringCommand = '/equip name: asdasdasd'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(EquipCommand, command)
    expect(spy).toHaveBeenLastCalledWith(embedContaining({
      color: 0xbb1327,
      description: 'Type `.help equip` to see some examples of how to search.',
      title: ':x: No results'
    }))
  })
})
