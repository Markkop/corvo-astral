import { calculateAttackDamage } from '../src/commands'

describe('calculateAttackDamage', () => {
  it('calculates damage with % resist', () => {
    const userMessage = {
      content: '!calc dmg 4000 base 50 res 61%',
      reply: jest.fn()
    }
    const replySpy = jest.spyOn(userMessage, 'reply')
    calculateAttackDamage(userMessage)
    expect(replySpy).toHaveBeenCalledWith('atacando com domínio de 4000 e dano base 50 em resist 61% o dano é de 800')
  })

  it('calculates damage with flat resist', () => {
    const userMessage = {
      content: '!calc dmg 4000 base 50 res 425',
      reply: jest.fn()
    }
    const replySpy = jest.spyOn(userMessage, 'reply')
    calculateAttackDamage(userMessage)
    expect(replySpy).toHaveBeenCalledWith('atacando com domínio de 4000 e dano base 50 em resist 61% o dano é de 800')
  })

  it('calculates damage with backstab', () => {
    const userMessage = {
      content: '!calc dmg 4000 base 50 res 425 on back',
      reply: jest.fn()
    }
    const replySpy = jest.spyOn(userMessage, 'reply')
    calculateAttackDamage(userMessage)
    expect(replySpy).toHaveBeenCalledWith('atacando com domínio de 4000 e dano base 50 em resist 61% nas costas o dano é de 999')
  })

  it('calculates damage with sidestab', () => {
    const userMessage = {
      content: '!calc dmg 4000 base 50 res 425 on side',
      reply: jest.fn()
    }
    const replySpy = jest.spyOn(userMessage, 'reply')
    calculateAttackDamage(userMessage)
    expect(replySpy).toHaveBeenCalledWith('atacando com domínio de 4000 e dano base 50 em resist 61% nos lados o dano é de 879')
  })

  it('replies an error if not enough required arguments', () => {
    const userMessage = {
      content: '!calc base 50 res 425',
      reply: jest.fn()
    }
    const replySpy = jest.spyOn(userMessage, 'reply')
    calculateAttackDamage(userMessage)
    expect(replySpy).toHaveBeenCalledWith('está faltando alguma informação aí. Tente algo tipo: .calc dmg 1700 base 27 res 70%')
  })
})
