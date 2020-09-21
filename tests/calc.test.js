import { calculateAttackDamage } from '../src/commands'
import helpMessages from '../src/utils/helpMessages'
import { mockMessage } from './testUtils'

describe('calculateAttackDamage', () => {
  it('calculates damage with % resist', () => {
    const content = '!calc dmg=4000 base=50 res=61%'
    const userMessage = mockMessage(content)
    const botMessage = calculateAttackDamage(userMessage)
    expect(botMessage.embed).toMatchObject({
      title: ':crossed_swords: Mark has attacked a gobbal!',
      fields: [
        {
          name: ':boxing_glove: Total Domain',
          value: 4000,
          inline: true
        },
        {
          name: ':pushpin: Base Damage',
          value: 50,
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
          value: 800
        },
        {
          name: ':abacus: Average damage',
          value: 800
        },
        {
          name: ':dagger: Back damage',
          value: 1000
        }
      ]
    })
  })

  it('calculates damage with flat resist', () => {
    const content = '!calc dmg=4000 base=50 res=422'
    const userMessage = mockMessage(content)
    const botMessage = calculateAttackDamage(userMessage)
    expect(botMessage.embed).toMatchObject({
      title: ':crossed_swords: Mark has attacked a gobbal!',
      fields: [
        {
          name: ':boxing_glove: Total Domain',
          value: 4000,
          inline: true
        },
        {
          name: ':pushpin: Base Damage',
          value: 50,
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
          value: 800
        },
        {
          name: ':abacus: Average damage',
          value: 800
        },
        {
          name: ':dagger: Back damage',
          value: 1000
        }
      ]
    })
  })

  it('calculates damage with crit chance', () => {
    const content = '!calc dmg=4000 base=50 res=422 crit=10'
    const userMessage = mockMessage(content)
    const botMessage = calculateAttackDamage(userMessage)
    expect(botMessage.embed).toMatchObject({
      title: ':crossed_swords: Mark has attacked a gobbal!',
      fields: [
        {
          name: ':boxing_glove: Total Domain',
          value: 4000,
          inline: true
        },
        {
          name: ':pushpin: Base Damage',
          value: 50,
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
          value: '800-1000'
        },
        {
          name: ':abacus: Average damage',
          value: 820
        },
        {
          name: ':dagger: Back damage',
          value: 1000
        }
      ]
    })
  })

  it('return a help message if no query was provided', () => {
    const content = '.calc'
    const userMessage = mockMessage(content)
    const botMessage = calculateAttackDamage(userMessage)
    expect(botMessage.embed).toMatchObject({
      description: helpMessages.calc.help.en
    })
  })
})
