import { CalcCommand } from '../tssrc/commands'
import { mockMessageAndSpyChannelSend, embedContaining, defaultConfig } from './testutils'

describe('CalcCommand', () => {
  it('replies damage embed with % resist option', () => {
    const content = '.calc dmg=4000 base=50 res=61%'
    const { userMessage, spy } = mockMessageAndSpyChannelSend(content)
    const equipCommand = new CalcCommand(userMessage, defaultConfig)
    equipCommand.execute()
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':crossed_swords: USERNAME has attacked a gobbal!',
      fields: [
        {
          name: ':boxing_glove: Total Domain',
          value: "4000",
          inline: true
        },
        {
          name: ':pushpin: Base Damage',
          value: "50",
          inline: true
        },
        {
          name: ':shield: Target Resistance',
          value: '61% (422)',
          inline: true
        },
        {
          name: ':game_die: Critical chance',
          value: '0%',
          inline: true
        },
        {
          name: ':drop_of_blood: Damage done',
          value: "800",
          inline: true
        },
        {
          name: ':abacus: Average damage',
          value: "800",
          inline: true
        },
        {
          name: ':dagger: Back damage',
          value: "1000",
          inline: true
        }
      ]
    }))
  })

  it('replies damage embed with flat resist option', () => {
    const content = '.calc dmg=4000 base=50 res=422'
    const { userMessage, spy } = mockMessageAndSpyChannelSend(content)
    const equipCommand = new CalcCommand(userMessage, defaultConfig)
    equipCommand.execute()
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':crossed_swords: USERNAME has attacked a gobbal!',
      fields: [
        {
          name: ':boxing_glove: Total Domain',
          value: "4000",
          inline: true
        },
        {
          name: ':pushpin: Base Damage',
          value: "50",
          inline: true
        },
        {
          name: ':shield: Target Resistance',
          value: '61% (422)',
          inline: true
        },
        {
          name: ':game_die: Critical chance',
          value: '0%',
          inline: true
        },
        {
          name: ':drop_of_blood: Damage done',
          value: "800",
          inline: true
        },
        {
          name: ':abacus: Average damage',
          value: "800",
          inline: true
        },
        {
          name: ':dagger: Back damage',
          value: "1000",
          inline: true
        }
      ]
    }))
  })

  it('replies damage embed with crit chance option', () => {
    const content = '!calc dmg=4000 base=50 res=422 crit=10'
    const { userMessage, spy } = mockMessageAndSpyChannelSend(content)
    const equipCommand = new CalcCommand(userMessage, defaultConfig)
    equipCommand.execute()
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: ':crossed_swords: USERNAME has attacked a gobbal!',
      fields: [
        {
          name: ':boxing_glove: Total Domain',
          value: "4000",
          inline: true
        },
        {
          name: ':pushpin: Base Damage',
          value: "50",
          inline: true
        },
        {
          name: ':shield: Target Resistance',
          value: '61% (422)',
          inline: true
        },
        {
          name: ':game_die: Critical chance',
          value: '10%',
          inline: true
        },
        {
          name: ':drop_of_blood: Damage done',
          value: '800-1000',
          inline: true
        },
        {
          name: ':abacus: Average damage',
          value: "820",
          inline: true
        },
        {
          name: ':dagger: Back damage',
          value: "1000",
          inline: true
        }
      ]
    }))
  })

  it('replies a help embed if no options were provided', () => {
    const content = '.calc'
    const { userMessage, spy } = mockMessageAndSpyChannelSend(content)
    const equipCommand = new CalcCommand(userMessage, defaultConfig)
    equipCommand.execute()
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: expect.stringContaining('.help')
    }))
  })
})
