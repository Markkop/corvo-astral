import EquipCommand from '../src/commands/Equip'
import helpMessages from '../src/utils/helpMessages'
import { executeCommandAndSpySentMessage, embedContaining } from './testutils'

describe('EquipmentCommand', () => {
  it('return a matching equipment by name', async () => {
    const spy = await executeCommandAndSpySentMessage(EquipCommand, '.equip tentacled belt')
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
            value: '286 HP\n47 Dodge\n30 Prospecting\n6% Critical Hit\n218 Mastery of 2 random element\n118 Distance Mastery\n47 <:FIRE:888826773352120331> Resistance\n47 <:EARTH:888826773410820116> Resistance',
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
    const spy = await executeCommandAndSpySentMessage(EquipCommand, '.equip the eternal')
    expect(spy).toHaveBeenCalledWith(embedContaining({
      fields: expect.arrayContaining([{
        name: 'Rarity',
        value: 'Souvenir',
        inline: true
      }])
    }))
  })

  it('return a translated equip with "translate" option', async () => {
    const spy = await executeCommandAndSpySentMessage(EquipCommand, '.equip peace pipe translate=pt')
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: '<:legendary:888866409382314085> Cachimbo Dapais'
    }))
  })

  it('return the matching equipment when using query without accents', async () => {
    const spy = await executeCommandAndSpySentMessage(EquipCommand, '.equip lemico lang=pt')
    expect(spy).toHaveBeenLastCalledWith(embedContaining({
      title: '<:legendary:888866409382314085> Chapéu Lêmico'
    }))
  })

  it('return the matching equipment when using query with accents', async () => {
    const spy = await executeCommandAndSpySentMessage(EquipCommand, '.equip lêmico lang=pt')
    expect(spy).toHaveBeenLastCalledWith(embedContaining({
      title: '<:legendary:888866409382314085> Chapéu Lêmico'
    }))
  })

  it('return a matching equipment by name and rarity with rarity argument is provided', async () => {
    const spy = await executeCommandAndSpySentMessage(EquipCommand, '.equip the eternal rarity=mythical')
    expect(spy).toHaveBeenLastCalledWith(embedContaining({
      fields: expect.arrayContaining([{
        name: 'Rarity',
        value: 'Mythical',
        inline: true
      }])
    }))
  })

  it('return a matching equipment by name and rarity with rarity argument is provided on another language', async () => {
    const spy = await executeCommandAndSpySentMessage(EquipCommand, '.equip o eterno raridade=mítico lang=pt')
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
    const spy = await executeCommandAndSpySentMessage(EquipCommand, '.equip o eterno raridade=mythical lang=pt')
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
    const spy = await executeCommandAndSpySentMessage(EquipCommand, '.equip amakna sword')
    expect(spy).toHaveBeenLastCalledWith(embedContaining({
      fields: expect.arrayContaining([{
        name: 'Conditions',
        value: 'Have Amakna Ring equipped',
        inline: false
      }])
    }))
  })

  it('return the useEffect description if the resulting equipment has one', async () => {
    const spy = await executeCommandAndSpySentMessage(EquipCommand, '.equip Toothpick')
    expect(spy).toHaveBeenLastCalledWith(embedContaining({
      fields: expect.arrayContaining([{
        name: 'In use',
        value: '<:LIGHT:888826773360476170> Damage: 46',
        inline: false
      }])
    }))
  })

  it('does not return the effects for an equipment that does not have one ', async () => {
    const spy = await executeCommandAndSpySentMessage(EquipCommand, '.equip brakmar ring')
    expect(spy).toHaveBeenLastCalledWith(embedContaining({
      fields: [
        { inline: true, name: 'Level', value: 200 },
        { inline: true, name: 'Type', value: 'Ring' },
        { inline: true, name: 'Rarity', value: 'Epic' },
      ]
    }))
  })

  it('return a footer with more equipment found if results are more than one', async () => {
    const spy = await executeCommandAndSpySentMessage(EquipCommand, '.equip amakna')
    expect(spy).toHaveBeenLastCalledWith(embedContaining({
      footer: {
        text: 'Equipment found: Amakna Ring (Epic), Amakna Sword (Relic), Captain Amakna Shield (Relic), Amakna Riktus Boots (Mythical), Amakna Riktus Epaulettes (Mythical), Amakna Riktus Mask (Mythical), Amakna Riktus Breastplate (Mythical), Amakna Riktus Boots (Rare), Amakna Riktus Epaulettes (Rare)'
      }
    }))
  })

  it('return a footer with truncated results if there are too many', async () => {
    const spy = await executeCommandAndSpySentMessage(EquipCommand, '.equip a')
    expect(spy).toHaveBeenLastCalledWith(embedContaining({
      footer: {
        text: "Equipment found: Dazzling Belt (Epic), Ush's Cards (Epic), Cockabootsledo (Epic), Hazieff's Helmet (Epic), Wa Wabbit's Cwown (Epic), Genetically Modified Epaulettes (Epic), Claymore of Fhenris (Epic), Bax Stab Ax (Epic), Claymus Shushu (Epic), Emiwlet Amulet (Epic), Lenald Walm Pelt (Epic), Vizion Dagger (Epic), Trool Warrior Spikes (Epic), Sanefty Belt (Epic), Happy Sram Kimono (Epic), Durable Shield (Epic), Limited Edition Cape (Epic), Dora Lagoole (Epic), Welder Mask (Epic), Viktorious Rapier (Epic) and other 4846 results"
      }
    }))
  })

  it('return a not found message if no equip was found', async () => {
    const spy = await executeCommandAndSpySentMessage(EquipCommand, '.equip asdasdasd')
    expect(spy).toHaveBeenLastCalledWith(embedContaining({
      color: 0xbb1327,
      description: 'Type `.help equip` to see some examples of how to search.',
      title: ':x: No results'
    }))
  })



  it('return a help message if no query was provided', async () => {
    const spy = await executeCommandAndSpySentMessage(EquipCommand, '.equip')
    expect(spy).toHaveBeenLastCalledWith(embedContaining({
      description: helpMessages.equip.help.en
    }))
  })
})
