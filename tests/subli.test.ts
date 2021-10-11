import SubliCommand from '../src/commands/Subli'
import helpMessages from '../src/utils/helpMessages'
import { executeCommandAndSpySentMessage, embedContaining } from './testutils'

describe('getSublimation', () => {
  it('returns a sublimation when finding only one result', async () => {
    const spy = await executeCommandAndSpySentMessage(SubliCommand, '.subli brutality')
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
          value: 'At the start of combat, if the state bearer has more Area Mastery than Melee Mastery:\n➥ +20% damage inflicted in close combat and area of effect simultaneously',
          inline: false
        }
      ]
    }))
  })

  it('return a translated subli with "translate" option', async () => {
    const spy = await executeCommandAndSpySentMessage(SubliCommand, '.subli frenzy translate=pt')
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':scroll: Frenesi II'
    }))
  })

  it('returns the matching sublimation when using query without accents', async () => {
    const spy = await executeCommandAndSpySentMessage(SubliCommand, '.subli influencia lang=pt')
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':scroll: Influência I'
    }))
  })

  it('returns a sublimation and more results when finding more than one', async () => {
    const spy = await executeCommandAndSpySentMessage(SubliCommand, '.subli frenzy')
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
    const spy = await executeCommandAndSpySentMessage(SubliCommand, '.subli BBR')
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
          value: 4,
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
    const spy = await executeCommandAndSpySentMessage(SubliCommand, '.subli wbr')
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
          value: 11,
          inline: true
        },
        {
          name: 'Sublimations',
          value: 'Ambush, Berserk Wakfu, Clamor, Integrity, Last Breath, Light Weapons Expert, Moon Scales, Obstinacy, Reinvigoration, Resolute, Spines',
          inline: false
        }
      ]
    }))
  })

  it('returns matching sublimations when searching with two white slots', async () => {
    const spy = await executeCommandAndSpySentMessage(SubliCommand, '.subli wwr')
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
          value: 30,
          inline: true
        },
        {
          name: 'Sublimations',
          value: 'Altruism, Ambush, Berserk Wakfu, Clamor, Counterattack, Cyclical Ruin, Cyclothymia, Determination, Distance Barrier, Firm Foot, Focalization, Integrity, Last Breath, Length, Light Weapons Expert, Lock Steal, Moon Scales, Neutrality, Obstinacy, Persistence, Precaution, Reinvigoration, Resolute, Ruin, Save, Solidity, Spines, Strong Hand, Swiftness, Theory of Matter',
          inline: false
        }
      ]
    }))
  })

  it('returns sublimations with "random" argument', async () => {
    const spy = await executeCommandAndSpySentMessage(SubliCommand, '.subli rgb random')
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':mag_right: Sublimations found',
      fields: [
        {
          name: 'Query',
          value: '<:red:888856996831449109> <:green:888856997112463421> <:blue:888856996726579271> in any order',
          inline: true
        },
        { name: 'Results', value: 23, inline: true },
        {
          name: '<:red:888856996831449109> <:green:888856997112463421> <:blue:888856996726579271> (4)',
          value: 'Frenzy, Fury, Sensitivity, Technical Critical',
          inline: false
        },
        {
          name: '<:red:888856996831449109> <:blue:888856996726579271> <:green:888856997112463421> (4)',
          value: 'Armor Length, Dimensionality, Lone Wolf, Wall',
          inline: false
        },
        {
          name: '<:green:888856997112463421> <:red:888856996831449109> <:blue:888856996726579271> (4)',
          value: 'Abandon, Endurance, Nature, Prosperity',
          inline: false
        },
        {
          name: '<:green:888856997112463421> <:blue:888856996726579271> <:red:888856996831449109> (4)',
          value: 'Clamor, Last Breath, Moon Scales, Reinvigoration',
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
    const spy = await executeCommandAndSpySentMessage(SubliCommand, '.subli wwgw')
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
          value: 49,
          inline: true
        },
        {
          name: 'Sublimations',
          value: 'About-Turn, AP Return, Armor Length, Berserk Critical, Berserk Dodge, Carnage, Condemnation, Critical Hit Expert, Destruction, Devastate, Dimensionality, Evasion, Flaming Return, Influence, Lone Wolf, Mania, MP Return, Offensive Block, Poisoned Weapon, Pretension, Raw Power, Secondary Devastation, Stupefaction, Tactical Critical, Visibility, Vital Return, Vitality Well, Wall, Altruism, Berserk Block, Close-Combat Barrier, Counterattack, Cyclothymia, Determination, Distance Barrier, Dodge Steal, Frenzy, Fury, Lock Steal, Neutrality and other 9 results',
          inline: false
        }
      ]
    }))
  })

  it('returns matching sublimations when searching with four slots', async () => {
    const spy = await executeCommandAndSpySentMessage(SubliCommand, '.subli rrgb')
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
          value: 8,
          inline: true
        },
        {
          name: 'Sublimations',
          value: 'Carnage, Flaming Return, Offensive Block, Slow Evasion, Frenzy, Fury, Sensitivity, Technical Critical',
          inline: false
        }
      ]
    }))
  })

  it('returns matching sublimations when searching by 4 slots with the same combinations', async () => {
    const spy = await executeCommandAndSpySentMessage(SubliCommand, '.subli gggg')
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
          value: 3,
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

  it.skip('returns matching sublimations when searching by source', async () => {
    const spy = await executeCommandAndSpySentMessage(SubliCommand, '.subli vertox')
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
          value: 3,
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
    const spy = await executeCommandAndSpySentMessage(SubliCommand, '.subli épico')
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
          value: 18,
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
    const spy = await executeCommandAndSpySentMessage(SubliCommand, '.subli frenzy 2')
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':scroll: Frenzy II',
    }))
  })

  it('return a matching sublimation with a recipe', async () => {
    const spy = await executeCommandAndSpySentMessage(SubliCommand, '.subli solidity')
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
          value: 60
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
    const spy = await executeCommandAndSpySentMessage(SubliCommand, '.subli caracas')
    expect(spy).toHaveBeenCalledWith(embedContaining({
      color: 0xbb1327,
      description: 'Type `.help subli` to see some examples of how to search.',
      title: ':x: No results'
    }))
  })

  it('returns a help message if no query was provided', async () => {
    const spy = await executeCommandAndSpySentMessage(SubliCommand, '.subli')
    expect(spy).toHaveBeenCalledWith(embedContaining({
      description: helpMessages.subli.help.en
    }))
  })
})
