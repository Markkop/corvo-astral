import { getSublimation } from '../src/commands'
import helpMessages from '../src/utils/helpMessages'
import { mockMessage } from './testUtils'

describe('getSublimation', () => {
  it('returns a sublimation when finding only one result', async () => {
    const content = '.subli brutality'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
      color: '#fd87ba',
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
          value: "If the bearer has more Area Mastery than Melee Mastery, adds the bearer's Melee Mastery to their Area Mastery and removes an equal amount of Distance Mastery at the start of combat. Melee Mastery is not lost; 800 max converted."
        },
        {
          name: 'Acquiring',
          value: 'End-of-season Ultimate Boss Chest (UB)'
        }
      ]
    })
  })

  it('return a translated subli with "translate" option', async () => {
    const content = '.subli frenzy translate=pt'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
    expect(botMessage.embed.title).toEqual(':scroll: Frenesi')
  })

  it('returns a sublimation and more results when finding more than one', async () => {
    const content = '.subli frenzy'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
      color: '#fd8e39',
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
          value: '-20% Damage inflicted At start of turn: 10% damage inflicted per enemy hit in the previous turn.'
        },
        {
          name: 'Acquiring',
          value: 'Aguabrial (2%)'
        }
      ],
      footer: {
        text: 'Sublimations found: Frenzy, Frenzy II, Frenzy III'
      }
    })
  })

  it('returns matching sublimations when searching with three slots', async () => {
    const content = '.subli BBR'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
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
          value: 'Ambush, Spines, Integrity'
        }
      ]
    })
  })

  it('returns matching sublimations when searching with one white slot', async () => {
    const content = '.subli wbr'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
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
          value: 'Ambush, Resolute, Moon Scales, Spines, Resolute II, Condemnation II, Integrity'
        }
      ]
    })
  })

  it('returns matching sublimations when searching with two white slots', async () => {
    const content = '.subli wwr'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
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
          value: 'Ruin, Ambush, Determination, Solidity, Resolute, Theory of Matter, Moon Scales, Swiftness, Save, Ruin II, Spines, Distance Barrier, Tenacity II, Resolute II, Cyclothymia, Condemnation II, Frenzy III, Length, Integrity'
        }
      ]
    })
  })

  it('returns sublimations with "random" argument', async () => {
    const content = '.subli rgb random'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
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
          value: 'Frenzy, Frenzy II'
        },
        {
          name: ':red_square: :blue_square: :green_square: (3)',
          value: 'Dimensionality, Wall, Lone Wolf'
        },
        {
          name: ':green_square: :red_square: :blue_square: (2)',
          value: 'Endurance, Endurance II'
        },
        {
          name: ':green_square: :blue_square: :red_square: (2)',
          value: 'Moon Scales, Condemnation II'
        },
        {
          name: ':blue_square: :red_square: :green_square: (2)',
          value: 'Return, Return II'
        },
        {
          name: ':blue_square: :green_square: :red_square: (2)',
          value: 'Theory of Matter, Cyclothymia'
        }
      ]
    })
  })

  it('returns non-repeated matching sublimations when searching with white slots', async () => {
    const content = '.subli wwgw'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
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
          value: 'Devastate, Carnage, Evasion, Condemnation, Stupefaction, Dimensionality, Return, Berserk Critical, Visibility, Devastate II, Evasion II, Berserk Dodge, Vitality Well, Influence, Wall, Return II, Influence II, Critical Hit Expert, Lone Wolf, Determination, Tenacity, Solidity, Topology, Frenzy, Theory of Matter, Distance Barrier, Close-Combat Barrier, Tenacity II, Berserk Block, Frenzy II, Cyclothymia'
        }
      ]
    })
  })

  it('returns matching sublimations when searching with four slots', async () => {
    const content = '.subli rrgb'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
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
          value: 'Carnage, Evasion II, Frenzy, Frenzy II'
        }
      ]
    })
  })

  it('returns matching sublimations when searching by 4 slots with the same combinations', async () => {
    const content = '.subli gggg'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
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
          value: 'Devastate, Devastate II'
        }
      ]
    })
  })

  it('returns matching sublimations when searching by source', async () => {
    const content = '.subli vertox'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
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
          value: 'Ambush, Dimensionality, Theory of Matter'
        }
      ]
    })
  })

  // TODO: map multi langue arguments
  it('maps correctly an argument', async () => {
    const content = '.subli épico'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
      title: ':mag_right: Sublimations found',
      fields: [
        {
          name: 'Query',
          value: 'epic',
          inline: true
        },
        {
          name: 'Results',
          value: 15,
          inline: true
        },
        {
          name: 'Sublimations',
          value: 'Inflexibility, Steadfast, Unraveling, Surgical Precision, Measure, Robust Health, Positioning Knowledge, Anatomy, Brutality, Herculean Strength, Wield type: Two-handed, Wield type: Dagger, Wield type: Shield, Wakfu Pact, Elemental Concentration'
        }
      ]
    })
  })

  it('replaces wrong query characters when searching by name', async () => {
    const content = '.subli frenzy 2'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
      color: '#fd8e39',
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
          value: '-15% Damage inflicted At start of turn: 5% damage inflicted per entity hit in the previous turn.'
        },
        {
          name: 'Acquiring',
          value: 'Badgwitch the Furiox (1%) (3 steles)'
        }
      ],
      footer: {
        text: 'Sublimations found: Frenzy II, Frenzy III'
      }
    })
  })

  it('return a matching sublimation with a recipe', async () => {
    const content = '.subli solidity'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
    expect(botMessage.embed.fields).toEqual(expect.arrayContaining([
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
        value: 'Reduces direct damage received greater than 20% of max HP by 400% of level (once per round)'
      },
      {
        name: 'Acquiring',
        value: 'Handyman 60 craft'
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
:white_small_square: \`40x  \` Sip of Sulfur`
      }
    ]))
  })

  it('returns a not found message if no sublimation was found', async () => {
    const content = '.subli caracas'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
    expect(botMessage.embed).toEqual({
      color: '#bb1327',
      description: 'Type `.help subli` to see some examples of how to search.',
      title: ':x: No results'
    })
  })

  it('returns a help message if no query was provided', async () => {
    const content = '.subli'
    const userMessage = mockMessage(content)
    const botMessage = await getSublimation(userMessage)
    expect(botMessage.embed).toMatchObject({
      description: helpMessages.subli.help.en
    })
  })
})
