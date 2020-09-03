import { parseCommandAndArgsFromMessage } from '../src/utils'
import { calculateAttackDamage } from '../src/commands'

describe('calculateAttackDamage', () => {
  it('calculates damage with % resist', () => {
    const message = { content: '!calc dmg 4000 base 50 res 61%' }
    const { args } = parseCommandAndArgsFromMessage(message)
    const reply = calculateAttackDamage(args)
    expect(reply).toEqual('atacando com domínio de 4000 e dano base 50 em resist 61% o dano é de 800')
  })

  it('calculates damage with flat resist', () => {
    const message = { content: '!calc dmg 4000 base 50 res 425' }
    const { args } = parseCommandAndArgsFromMessage(message)
    const reply = calculateAttackDamage(args)
    expect(reply).toEqual('atacando com domínio de 4000 e dano base 50 em resist 61% o dano é de 800')
  })

  it('calculates damage with backstab', () => {
    const message = { content: '!calc dmg 4000 base 50 res 425 on back' }
    const { args } = parseCommandAndArgsFromMessage(message)
    const reply = calculateAttackDamage(args)
    expect(reply).toEqual('atacando com domínio de 4000 e dano base 50 em resist 61% nas costas o dano é de 999')
  })

  it('calculates damage with sidestab', () => {
    const message = { content: '!calc dmg 4000 base 50 res 425 on side' }
    const { args } = parseCommandAndArgsFromMessage(message)
    const reply = calculateAttackDamage(args)
    expect(reply).toEqual('atacando com domínio de 4000 e dano base 50 em resist 61% nos lados o dano é de 879')
  })

  it('replies an error if not enough required arguments', () => {
    const message = { content: '!calc base 50 res 425' }
    const { args } = parseCommandAndArgsFromMessage(message)
    const reply = calculateAttackDamage(args)
    expect(reply).toEqual('está faltando alguma informação aí. Tente algo tipo: .calc dmg 1700 base 27 res 70%')
  })
})
