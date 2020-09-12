import { getArgumentsAndOptions, getCommand } from '../src/utils/message'
import findPermutations from '../src/utils/permutateString'

describe('getArgumentsAndOptions', () => {
  it('get arguments correctly', () => {
    const message = { content: '.equip o eterno raridade=mítico' }
    const { args, options } = getArgumentsAndOptions(message, '=')
    expect(args).toEqual(['o', 'eterno'])
    expect(options).toEqual({ raridade: 'mítico' })
  })

  it('get command correctly', () => {
    const message = { content: '.calc base 20 dmg 30 res 10' }
    const command = getCommand('.', message)
    expect(command).toEqual('calc')
  })
})

describe('findPermutations', () => {
  it('finds a permutation for a 4 character string', () => {
    const permutations = findPermutations('rgww')
    expect(permutations).toEqual(['rgww', 'rwgw', 'rwwg', 'grww', 'gwrw', 'gwwr', 'wrgw', 'wrwg', 'wgrw', 'wgwr', 'wwrg', 'wwgr'])
  })

  it("returns an empty array if it's more than 4 characters", () => {
    const permutations = findPermutations('relic')
    expect(permutations).toEqual([])
  })

  it('returns the same string if it has one character', () => {
    const permutations = findPermutations('a')
    expect(permutations).toEqual('a')
  })
})
