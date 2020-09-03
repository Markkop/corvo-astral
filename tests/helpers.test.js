import { calculateAttackDamage } from '../src/helpers'

describe('calculateAttackDamage', () => {
  it('calculates damage with % resist', () => {
    const args = 'dmg 4000 base 50 res 61%'.split(' ')
    const reply = calculateAttackDamage(args)
    expect(reply).toEqual('atacando com domínio de 4000 e dano base 50 em resist 61% o dano é de 800')
  })

  it('calculates damage with flat resist', () => {
    const args = 'dmg 4000 base 50 res 425'.split(' ')
    const reply = calculateAttackDamage(args)
    expect(reply).toEqual('atacando com domínio de 4000 e dano base 50 em resist 61% o dano é de 800')
  })

  it('calculates damage with backstab', () => {
    const args = 'dmg 4000 base 50 res 425 on back'.split(' ')
    const reply = calculateAttackDamage(args)
    expect(reply).toEqual('atacando com domínio de 4000 e dano base 50 em resist 61% nas costas o dano é de 999')
  })

  it('calculates damage with sidestab', () => {
    const args = 'dmg 4000 base 50 res 425 on side'.split(' ')
    const reply = calculateAttackDamage(args)
    expect(reply).toEqual('atacando com domínio de 4000 e dano base 50 em resist 61% nos lados o dano é de 879')
  })

  it('replies an error if not enough required arguments', () => {
    const args = 'base 50 res 425'.split(' ')
    const reply = calculateAttackDamage(args)
    expect(reply).toEqual('está faltando alguma informação aí. Tente algo tipo: .calc dmg 1700 base 27 res 70%')
  })
})
