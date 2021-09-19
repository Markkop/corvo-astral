import { CalcCommand } from '../src/commands'
import { executeCommandAndSpySentMessage, embedContaining } from './testutils'

describe('CalcCommand', () => {
  it('replies damage embed with % resist option', async () => {
    const spy = await executeCommandAndSpySentMessage(CalcCommand, '.calc dmg=4000 base=50 res=61%')
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

  it('replies damage embed with flat resist option', async () => {
    const spy = await executeCommandAndSpySentMessage(CalcCommand, '.calc dmg=4000 base=50 res=422')
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

  it('replies damage embed with crit chance option', async () => {
    const spy = await executeCommandAndSpySentMessage(CalcCommand, '!calc dmg=4000 base=50 res=422 crit=10')
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

  it('replies a help embed if no options were provided', async () => {
    const spy = await executeCommandAndSpySentMessage(CalcCommand, '.calc')
    expect(spy).toHaveBeenCalledWith(embedContaining({
      title: expect.stringContaining('.help')
    }))
  })
})
