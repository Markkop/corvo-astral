import SubliCommand, { getData } from '../src/commands/Subli'
import { executeCommandAndSpyReply, embedContaining, getParsedCommand } from './testutils'

describe('getSublimation', () => {
  const commandData = getData('en')

  it('returns a sublimation when finding only one result', async () => {
    const stringCommand = '/subli by-name name: brutality'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(SubliCommand, command)
    expect(spy).toHaveBeenCalledWith(embedContaining({
      url: 'https://www.wakfu.com/en/mmorpg/encyclopedia/resources/25796',
      color: 0xfd87ba,
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
          inline: true,
          name: "Rarity",
          value: "Mythical",
        },
        {
          name: 'Effects',
          value: 'At the start of combat, if the state bearer has more Area Mastery than Melee Mastery:\n➥ +20% damage inflicted in melee and area of effect simultaneously',
          inline: false
        }
      ]
    }))
  })

  it('return a translated subli with "translate" option', async () => {
    const stringCommand = '/subli by-name name: frenzy translate: pt'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(SubliCommand, command)
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':scroll: Frenesi II'
    }))
  })

  it('returns the matching sublimation when using query without accents', async () => {
    const stringCommand = '/subli by-name name: influencia lang: pt'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(SubliCommand, command)
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':scroll: Influência I'
    }))
  })

  it('returns a sublimation and more results when finding more than one', async () => {
    const stringCommand = '/subli by-name name: frenzy'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(SubliCommand, command)
    expect(spy).toHaveBeenCalledWith(embedContaining({
      url: 'https://www.wakfu.com/en/mmorpg/encyclopedia/resources/27126',
      color: 0xfd8e39,
      title: ':scroll: Frenzy II',
      thumbnail: {
        url: 'https://static.ankama.com/wakfu/portal/game/item/115/81228823.png'
      },
      fields: [
        {
          name: 'Slots',
          value: '<:red:888856996831449109> <:green:888856997112463421> <:blue:888856996726579271>',
          inline: true
        },
        {
          name: 'Max stacking',
          value: '2',
          inline: true
        },
        {
          inline: true,
          name: "Rarity",
          value: "Mythical",
        },
        {
          name: 'Effects',
          value: '-20% Damage inflicted\nAt start of turn:\n10% Damage inflicted per enemy hit in the previous turn.',
          inline: false
        }
      ]
    }))
  })

  it('returns matching sublimations when searching with three slots', async () => {
    const stringCommand = '/subli by-slots slots: BBR'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(SubliCommand, command)
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':mag_right: Sublimations found',
      fields: [
        {
          name: 'Query',
          value: '<:blue:888856996726579271> <:blue:888856996726579271> <:red:888856996831449109>',
          inline: true
        },
        {
          name: 'Results',
          value: "4",
          inline: true
        },
        {
          name: 'Sublimations',
          value: 'Ambush, Berserk Wakfu, Integrity, Spines',
          inline: false
        }
      ]
    }))
  })

  it('returns matching sublimations when searching with one white slot', async () => {
    const stringCommand = '/subli by-slots slots: wbr'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(SubliCommand, command)
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':mag_right: Sublimations found',
      fields: [
        {
          name: 'Query',
          value: '<:white:888856997066330172> <:blue:888856996726579271> <:red:888856996831449109>',
          inline: true
        },
        {
          name: 'Results',
          value: "12",
          inline: true
        },
        {
          name: 'Sublimations',
          value: 'Ambition, Ambush, Berserk Wakfu, Clamor, Integrity, Last Breath, Light Weapons Expert, Moon Scales, Obstinacy, Reinvigoration, Resolute, Spines',
          inline: false
        }
      ]
    }))
  })

  it('returns matching sublimations when searching with two white slots', async () => {
    const stringCommand = '/subli by-slots slots: wwr'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(SubliCommand, command)
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':mag_right: Sublimations found',
      fields: [
        {
          name: 'Query',
          value: '<:white:888856997066330172> <:white:888856997066330172> <:red:888856996831449109>',
          inline: true
        },
        {
          name: 'Results',
          value: "32",
          inline: true
        },
        {
          name: 'Sublimations',
          value: 'Altruism, Ambition, Ambush, Berserk Wakfu, Clamor, Counterattack, Cyclical Ruin, Cyclothymia, Determination, Distance Barrier, Featherweight I, Firm Foot, Focalization, Integrity, Last Breath, Length, Light Weapons Expert, Lock Steal, Moon Scales, Neutrality, Obstinacy, Persistence, Precaution, Reinvigoration, Resolute, Ruin, Save, Solidity, Spines, Strong Hand and other 2 results',
          inline: false
        }
      ]
    }))
  })

  it('returns sublimations with "random" argument', async () => {
    const stringCommand = '/subli by-slots slots: rgb random: true'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(SubliCommand, command)
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':mag_right: Sublimations found',
      fields: [
        {
          name: 'Query',
          value: '<:red:888856996831449109> <:green:888856997112463421> <:blue:888856996726579271> in any order',
          inline: true
        },
        { name: 'Results', value: "27", inline: true },
        {
          name: '<:red:888856996831449109> <:green:888856997112463421> <:blue:888856996726579271> (6)',
          value: 'Brawling, Frenzy, Fury, Heavy Armor I, Sensitivity, Technical Critical',
          inline: false
        },
        {
          name: '<:red:888856996831449109> <:blue:888856996726579271> <:green:888856997112463421> (4)',
          value: 'Armor Length, Dimensionality, Lone Wolf, Wall',
          inline: false
        },
        {
          name: '<:green:888856997112463421> <:red:888856996831449109> <:blue:888856996726579271> (5)',
          value: 'Abandon, Delay, Endurance, Nature, Prosperity',
          inline: false
        },
        {
          name: '<:green:888856997112463421> <:blue:888856996726579271> <:red:888856996831449109> (5)',
          value: 'Ambition, Clamor, Last Breath, Moon Scales, Reinvigoration',
          inline: false
        },
        {
          name: '<:blue:888856996726579271> <:red:888856996831449109> <:green:888856997112463421> (3)',
          value: 'AP Return, Mania, MP Return',
          inline: false
        },
        {
          name: '<:blue:888856996726579271> <:green:888856997112463421> <:red:888856996831449109> (4)',
          value: 'Altruism, Cyclothymia, Neutrality, Theory of Matter',
          inline: false
        }
      ]
    }))
  })

  it('returns non-repeated matching sublimations when searching with white slots', async () => {
    const stringCommand = '/subli by-slots slots: wwgw'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(SubliCommand, command)
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':mag_right: Sublimations found',
      fields: [
        {
          name: 'Query',
          value: '<:white:888856997066330172> <:white:888856997066330172> <:green:888856997112463421> <:white:888856997066330172>',
          inline: true
        },
        {
          name: 'Results',
          value: "53",
          inline: true
        },
        {
          name: 'Sublimations',
          value: 'About-Turn, AP Return, Armor Length, Berserk Critical, Berserk Dodge, Carnage, Condemnation, Critical Hit Expert, Critical Preparation, Destruction, Devastate, Dimensionality, Evasion, Flaming Return, Influence, Locking, Lone Wolf, Mania, MP Return, Offensive Block, Poisoned Weapon, Pretension, Raw Power, Secondary Devastation, Stupefaction, Tactical Critical, Visibility, Vital Return, Vitality Well, Wall and other 23 results',
          inline: false
        }
      ]
    }))
  })

  it('returns matching sublimations when searching with four slots', async () => {
    const stringCommand = '/subli by-slots slots: rrgb'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(SubliCommand, command)
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':mag_right: Sublimations found',
      fields: [
        {
          name: 'Query',
          value: '<:red:888856996831449109> <:red:888856996831449109> <:green:888856997112463421> <:blue:888856996726579271>',
          inline: true
        },
        {
          name: 'Results',
          value: "10",
          inline: true
        },
        {
          name: 'Sublimations',
          value: 'Carnage, Flaming Return, Offensive Block, Slow Evasion, Brawling, Frenzy, Fury, Heavy Armor I, Sensitivity, Technical Critical',
          inline: false
        }
      ]
    }))
  })

  it('returns matching sublimations when searching by 4 slots with the same combinations', async () => {
    const stringCommand = '/subli by-slots slots: gggg'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(SubliCommand, command)
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':mag_right: Sublimations found',
      fields: [
        {
          name: 'Query',
          value: '<:green:888856997112463421> <:green:888856997112463421> <:green:888856997112463421> <:green:888856997112463421>',
          inline: true
        },
        {
          name: 'Results',
          value: "3",
          inline: true
        },
        {
          name: 'Sublimations',
          value: 'Devastate, Raw Power, Secondary Devastation',
          inline: false
        }
      ]
    }))
  })

  // Removed
  it.skip('returns matching sublimations when searching by source', async () => {
    const stringCommand = '/subli source: vertox'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(SubliCommand, command)
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':mag_right: Sublimations found',
      fields: [
        {
          name: 'Query',
          value: 'vertox',
          inline: true
        },
        {
          name: 'Results',
          value: "3",
          inline: true
        },
        {
          name: 'Sublimations',
          value: 'Ambush, Dimensionality, Theory of Matter',
          inline: false
        }
      ]
    }))
  })

  // TODO: map multi langue arguments
  it('maps correctly an argument', async () => {
    const stringCommand = '/subli by-slots slots: epic'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(SubliCommand, command)
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':mag_right: Sublimations found',
      fields: [
        {
          name: 'Query',
          value: 'epic',
          inline: true
        },
        {
          name: 'Results',
          value: "18",
          inline: true
        },
        {
          name: 'Sublimations',
          value: 'Anatomy, Brutality, Controlling Space, Elemental Concentration, Herculean Strength, Inflexibility, Measure, Outrage, Pillar, Positioning Knowledge, Robust Health, Steadfast, Surgical Precision, Unraveling, Wakfu Pact, Wield type: Dagger, Wield type: Shield, Wield type: Two-handed',
          inline: false
        }
      ]
    }))
  })

  it('replaces wrong query characters when searching by name', async () => {
    const stringCommand = '/subli by-name name: frenzy 2'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(SubliCommand, command)
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':scroll: Frenzy II',
    }))
  })

  it('return a matching sublimation with a recipe', async () => {
    const stringCommand = '/subli by-name name: solidity'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(SubliCommand, command)
    expect(spy).toHaveBeenCalledWith(embedContaining({
      fields: expect.arrayContaining([
        {
          inline: true,
          name: 'Slots',
          value: '<:red:888856996831449109> <:green:888856997112463421> <:red:888856996831449109>'
        },
        {
          inline: true,
          name: 'Max stacking',
          value: '2'
        },
        {
          inline: true,
          name: 'Rarity',
          value: 'Mythical'
        },
        {
          name: 'Effects',
          value: 'Reduces direct damage received greater than 20% of max HP by 400% of level (once per round)',
          inline: false
        },
        {
          inline: true,
          name: 'Profession',
          value: ':chair: Handyman'
        },
        {
          inline: true,
          name: 'Level',
          value: "60"
        },
        {
          name: 'Ingredients',
          value: `:chair: \`10x  \` Raw Bracket
:pick: \`15x  \` Dragonheart Amethyst
:sparkles: \`50x  \` Powder
:white_small_square: \`12x  \` Scara Horn
:white_small_square: \`10x  \` Royal Canine
:white_small_square: \`40x  \` Sip of Sulfur`,
          inline: false
        }
      ])
    }))
  })

  it('returns a not found message if no sublimation was found', async () => {
    const stringCommand = '/subli by-name name: caracas'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(SubliCommand, command)
    expect(spy).toHaveBeenCalledWith(embedContaining({
      color: 0xbb1327,
      description: 'Type `.help subli` to see some examples of how to search.',
      title: ':x: No results'
    }))
  })
})
