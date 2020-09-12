import { calculateAttackDamage } from '../src/commands'
import { commandsHelp } from '../src/commands/help'
import { mockMessage } from './testUtils'

describe('calculateAttackDamage', () => {
  it('calculates damage with % resist', () => {
    const content = '!calc dmg=4000 base=50 res=61%'
    const userMessage = mockMessage(content)
    const botMessage = calculateAttackDamage(userMessage)
    expect(botMessage.embed).toMatchObject({
      title: ':crossed_swords: Mark atacou um Papatudo!',
      fields: [
        {
          name: ':boxing_glove: Domínio Total',
          value: 4000,
          inline: true
        },
        {
          name: ':pushpin: Dano Base',
          value: 50,
          inline: true
        },
        {
          name: ':shield: Resistência do Alvo',
          value: '61% (422)',
          inline: true
        },
        {
          name: ':game_die: Chance Crítica',
          value: '0%',
          inline: true
        },
        {
          name: ':drop_of_blood: Dano causado',
          value: 800
        },
        {
          name: ':abacus: Dano médio',
          value: 800
        },
        {
          name: ':dagger: Dano nas costas',
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
      title: ':crossed_swords: Mark atacou um Papatudo!',
      fields: [
        {
          name: ':boxing_glove: Domínio Total',
          value: 4000,
          inline: true
        },
        {
          name: ':pushpin: Dano Base',
          value: 50,
          inline: true
        },
        {
          name: ':shield: Resistência do Alvo',
          value: '61% (422)',
          inline: true
        },
        {
          name: ':game_die: Chance Crítica',
          value: '0%',
          inline: true
        },
        {
          name: ':drop_of_blood: Dano causado',
          value: 800
        },
        {
          name: ':abacus: Dano médio',
          value: 800
        },
        {
          name: ':dagger: Dano nas costas',
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
      title: ':crossed_swords: Mark atacou um Papatudo!',
      fields: [
        {
          name: ':boxing_glove: Domínio Total',
          value: 4000,
          inline: true
        },
        {
          name: ':pushpin: Dano Base',
          value: 50,
          inline: true
        },
        {
          name: ':shield: Resistência do Alvo',
          value: '61% (422)',
          inline: true
        },
        {
          name: ':game_die: Chance Crítica',
          value: '10%',
          inline: true
        },
        {
          name: ':drop_of_blood: Dano causado',
          value: '800-1000'
        },
        {
          name: ':abacus: Dano médio',
          value: 820
        },
        {
          name: ':dagger: Dano nas costas',
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
      description: commandsHelp.calc
    })
  })
})
