import { calculateAttackDamage } from '../src/commands'
import { commandsHelp } from '../src/commands/help'

describe.only('calculateAttackDamage', () => {
  it('calculates damage with % resist', () => {
    let botMessage = {}
    const userMessage = {
      content: '!calc dmg=4000 base=50 res=61%',
      author: {
        username: 'Mark'
      },
      channel: {
        send: jest.fn(message => {
          botMessage = message
        })
      }
    }
    calculateAttackDamage(userMessage)
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
    let botMessage = {}
    const userMessage = {
      content: '!calc dmg=4000 base=50 res=422',
      author: {
        username: 'Mark'
      },
      channel: {
        send: jest.fn(message => {
          botMessage = message
        })
      }
    }
    calculateAttackDamage(userMessage)
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
    let botMessage = {}
    const userMessage = {
      content: '!calc dmg=4000 base=50 res=422 crit=10',
      author: {
        username: 'Mark'
      },
      channel: {
        send: jest.fn(message => {
          botMessage = message
        })
      }
    }
    calculateAttackDamage(userMessage)
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
    let botMessage = {}
    const userMessage = {
      content: '.calc',
      channel: {
        send: jest.fn(message => {
          botMessage = message
        })
      }
    }
    calculateAttackDamage(userMessage)
    expect(botMessage.embed).toMatchObject({
      description: commandsHelp.calc
    })
  })
})
