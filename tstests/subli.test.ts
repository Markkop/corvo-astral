import SubliCommand from '../tssrc/commands/Subli'
import helpMessages from '../tssrc/utils/helpMessages'
import { mockMessageAndSpyChannelSend, embedContaining, defaultConfig } from './testutils'

describe('getSublimation', () => {
  it('returns a sublimation when finding only one result', async () => {
    const content = '.subli brutality'
    const { userMessage, spy } = mockMessageAndSpyChannelSend(content)
    const subliCommand = new SubliCommand(userMessage, defaultConfig)
    subliCommand.execute()
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
          name: 'Effects',
          value: 'If the bearer has more Area Mastery than Melee Mastery: [pl]+20% damage inflicted in close combat and area of effect',
          inline: false
        },
        {
          name: 'Acquiring',
          value: 'End-of-season Ultimate Boss Chest (UB)',
          inline: false
        }
      ]
    }))
  })

  it('return a translated subli with "translate" option', async () => {
    const content = '.subli frenzy translate=pt'
    const { userMessage, spy } = mockMessageAndSpyChannelSend(content)
    const subliCommand = new SubliCommand(userMessage, defaultConfig)
    subliCommand.execute()
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':scroll: Frenesi'
    }))
  })

  it('returns the matching sublimation when using query without accents', async () => {
    const content = '.subli influencia lang=pt'
    const { userMessage, spy } = mockMessageAndSpyChannelSend(content)
    const subliCommand = new SubliCommand(userMessage, defaultConfig)
    subliCommand.execute()
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':scroll: Influência'
    }))
  })

  it('returns a sublimation and more results when finding more than one', async () => {
    const content = '.subli frenzy'
    const { userMessage, spy } = mockMessageAndSpyChannelSend(content)
    const subliCommand = new SubliCommand(userMessage, defaultConfig)
    subliCommand.execute()
    expect(spy).toHaveBeenCalledWith(embedContaining({
      url: 'https://www.wakfu.com/en/mmorpg/encyclopedia/resources/27126',
      color: 0xfd8e39,
      title: ':scroll: Frenzy',
      thumbnail: {
        url: 'https://static.ankama.com/wakfu/portal/game/item/115/81227111.png'
      },
      fields: [
        {
          name: 'Slots',
          value: ':red_square: :green_square: :blue_square:',
          inline: true
        },
        {
          name: 'Max stacking',
          value: '1',
          inline: true
        },
        {
          name: 'Effects',
          value: ', -20% Damage inflicted At start of turn: 10% damage inflicted per enemy hit in the previous turn.',
          inline: false
        },
        {
          name: 'Acquiring',
          value: 'Aguabrial (2%)',
          inline: false
        }
      ],
      footer: {
        text: 'Sublimations found: Frenzy, Frenzy II, Frenzy III'
      }
    }))
  })

  it('returns matching sublimations when searching with three slots', async () => {
    const content = '.subli BBR'
    const { userMessage, spy } = mockMessageAndSpyChannelSend(content)
    const subliCommand = new SubliCommand(userMessage, defaultConfig)
    subliCommand.execute()
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':mag_right: Sublimations found',
      fields: [
        {
          name: 'Query',
          value: ':blue_square: :blue_square: :red_square:',
          inline: true
        },
        {
          name: 'Results',
          value: 3,
          inline: true
        },
        {
          name: 'Sublimations',
          value: 'Ambush, Spines, Integrity',
          inline: false
        }
      ]
    }))
  })

  it('returns matching sublimations when searching with one white slot', async () => {
    const content = '.subli wbr'
    const { userMessage, spy } = mockMessageAndSpyChannelSend(content)
    const subliCommand = new SubliCommand(userMessage, defaultConfig)
    subliCommand.execute()
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':mag_right: Sublimations found',
      fields: [
        {
          name: 'Query',
          value: ':white_large_square: :blue_square: :red_square:',
          inline: true
        },
        {
          name: 'Results',
          value: 7,
          inline: true
        },
        {
          name: 'Sublimations',
          value: 'Ambush, Resolute, Moon Scales, Spines, Resolute II, Condemnation II, Integrity',
          inline: false
        }
      ]
    }))
  })

  it('returns matching sublimations when searching with two white slots', async () => {
    const content = '.subli wwr'
    const { userMessage, spy } = mockMessageAndSpyChannelSend(content)
    const subliCommand = new SubliCommand(userMessage, defaultConfig)
    subliCommand.execute()
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':mag_right: Sublimations found',
      fields: [
        {
          name: 'Query',
          value: ':white_large_square: :white_large_square: :red_square:',
          inline: true
        },
        {
          name: 'Results',
          value: 19,
          inline: true
        },
        {
          name: 'Sublimations',
          value: 'Ruin, Ambush, Determination, Solidity, Resolute, Theory of Matter, Moon Scales, Swiftness, Save, Ruin II, Spines, Distance Barrier, Tenacity II, Resolute II, Cyclothymia, Condemnation II, Frenzy III, Length, Integrity',
          inline: false
        }
      ]
    }))
  })

  it('returns sublimations with "random" argument', async () => {
    const content = '.subli rgb random'
    const { userMessage, spy } = mockMessageAndSpyChannelSend(content)
    const subliCommand = new SubliCommand(userMessage, defaultConfig)
    subliCommand.execute()
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':mag_right: Sublimations found',
      fields: [
        {
          name: 'Query',
          value: ':red_square: :green_square: :blue_square: in any order',
          inline: true
        },
        { name: 'Results', value: 13, inline: true },
        {
          name: ':red_square: :green_square: :blue_square: (2)',
          value: 'Frenzy, Frenzy II',
          inline: false
        },
        {
          name: ':red_square: :blue_square: :green_square: (3)',
          value: 'Dimensionality, Wall, Lone Wolf',
          inline: false
        },
        {
          name: ':green_square: :red_square: :blue_square: (2)',
          value: 'Endurance, Endurance II',
          inline: false
        },
        {
          name: ':green_square: :blue_square: :red_square: (2)',
          value: 'Moon Scales, Condemnation II',
          inline: false
        },
        {
          name: ':blue_square: :red_square: :green_square: (2)',
          value: 'Return, Return II',
          inline: false
        },
        {
          name: ':blue_square: :green_square: :red_square: (2)',
          value: 'Theory of Matter, Cyclothymia',
          inline: false
        }
      ]
    }))
  })

  it('returns non-repeated matching sublimations when searching with white slots', async () => {
    const content = '.subli wwgw'
    const { userMessage, spy } = mockMessageAndSpyChannelSend(content)
    const subliCommand = new SubliCommand(userMessage, defaultConfig)
    subliCommand.execute()
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':mag_right: Sublimations found',
      fields: [
        {
          name: 'Query',
          value: ':white_large_square: :white_large_square: :green_square: :white_large_square:',
          inline: true
        },
        {
          name: 'Results',
          value: 31,
          inline: true
        },
        {
          name: 'Sublimations',
          value: 'Devastate, Carnage, Evasion, Condemnation, Stupefaction, Dimensionality, Return, Berserk Critical, Visibility, Devastate II, Evasion II, Berserk Dodge, Vitality Well, Influence, Wall, Return II, Influence II, Critical Hit Expert, Lone Wolf, Determination, Tenacity, Solidity, Topology, Frenzy, Theory of Matter, Distance Barrier, Close-Combat Barrier, Tenacity II, Berserk Block, Frenzy II, Cyclothymia',
          inline: false
        }
      ]
    }))
  })

  it('returns matching sublimations when searching with four slots', async () => {
    const content = '.subli rrgb'
    const { userMessage, spy } = mockMessageAndSpyChannelSend(content)
    const subliCommand = new SubliCommand(userMessage, defaultConfig)
    subliCommand.execute()
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':mag_right: Sublimations found',
      fields: [
        {
          name: 'Query',
          value: ':red_square: :red_square: :green_square: :blue_square:',
          inline: true
        },
        {
          name: 'Results',
          value: 4,
          inline: true
        },
        {
          name: 'Sublimations',
          value: 'Carnage, Evasion II, Frenzy, Frenzy II',
          inline: false
        }
      ]
    }))
  })

  it('returns matching sublimations when searching by 4 slots with the same combinations', async () => {
    const content = '.subli gggg'
    const { userMessage, spy } = mockMessageAndSpyChannelSend(content)
    const subliCommand = new SubliCommand(userMessage, defaultConfig)
    subliCommand.execute()
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':mag_right: Sublimations found',
      fields: [
        {
          name: 'Query',
          value: ':green_square: :green_square: :green_square: :green_square:',
          inline: true
        },
        {
          name: 'Results',
          value: 2,
          inline: true
        },
        {
          name: 'Sublimations',
          value: 'Devastate, Devastate II',
          inline: false
        }
      ]
    }))
  })

  it('returns matching sublimations when searching by source', async () => {
    const content = '.subli vertox'
    const { userMessage, spy } = mockMessageAndSpyChannelSend(content)
    const subliCommand = new SubliCommand(userMessage, defaultConfig)
    subliCommand.execute()
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
    const content = '.subli épico'
    const { userMessage, spy } = mockMessageAndSpyChannelSend(content)
    const subliCommand = new SubliCommand(userMessage, defaultConfig)
    subliCommand.execute()
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
          value: 19,
          inline: true
        },
        {
          name: 'Sublimations',
          value: 'Inflexibility, Steadfast, Unraveling, Surgical Precision, Measure, Robust Health, Positioning Knowledge, Anatomy, Brutality, Herculean Strength, Wield type: Two-handed, Wield type: Dagger, Wield type: Shield, Wakfu Pact, Elemental Concentration, Outrage, Outrage II, Pillar, Controlling Space',
          inline: false
        }
      ]
    }))
  })

  it('replaces wrong query characters when searching by name', async () => {
    const content = '.subli frenzy 2'
    const { userMessage, spy } = mockMessageAndSpyChannelSend(content)
    const subliCommand = new SubliCommand(userMessage, defaultConfig)
    subliCommand.execute()
    expect(spy).toHaveBeenCalledWith(embedContaining({
      url: 'https://www.wakfu.com/en/mmorpg/encyclopedia/resources/27153',
      color: 0xfd8e39,
      title: ':scroll: Frenzy II',
      thumbnail: {
        url: 'https://static.ankama.com/wakfu/portal/game/item/115/81227111.png'
      },
      fields: [
        {
          name: 'Slots',
          value: ':red_square: :green_square: :blue_square:',
          inline: true
        },
        {
          name: 'Max stacking',
          value: '1',
          inline: true
        },
        {
          name: 'Effects',
          value: ', -15% Damage inflicted At start of turn: 5% damage inflicted per entity hit in the previous turn.',
          inline: false
        },
        {
          name: 'Acquiring',
          value: 'Badgwitch the Furiox (1%) (3 steles)',
          inline: false
        }
      ],
      footer: {
        text: 'Sublimations found: Frenzy II, Frenzy III'
      }
    }))
  })

  it('return a matching sublimation with a recipe', async () => {
    const content = '.subli solidity'
    const { userMessage, spy } = mockMessageAndSpyChannelSend(content)
    const subliCommand = new SubliCommand(userMessage, defaultConfig)
    subliCommand.execute()
    expect(spy).toHaveBeenCalledWith(embedContaining({
      fields: expect.arrayContaining([
        {
          inline: true,
          name: 'Slots',
          value: ':red_square: :green_square: :red_square:'
        },
        {
          inline: true,
          name: 'Max stacking',
          value: '1'
        },
        {
          name: 'Effects',
          value: 'Reduces direct damage received greater than 20% of max HP by 400% of level (once per round)',
          inline: false
        },
        {
          name: 'Acquiring',
          value: 'Handyman 60 craft',
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
    const content = '.subli caracas'
    const { userMessage, spy } = mockMessageAndSpyChannelSend(content)
    const subliCommand = new SubliCommand(userMessage, defaultConfig)
    subliCommand.execute()
    expect(spy).toHaveBeenCalledWith(embedContaining({
      color: 0xbb1327,
      description: 'Type `.help subli` to see some examples of how to search.',
      title: ':x: No results'
    }))
  })

  it('returns a help message if no query was provided', async () => {
    const content = '.subli'
    const { userMessage, spy } = mockMessageAndSpyChannelSend(content)
    const subliCommand = new SubliCommand(userMessage, defaultConfig)
    subliCommand.execute()
    expect(spy).toHaveBeenCalledWith(embedContaining({
      description: helpMessages.subli.help.en
    }))
  })
})
