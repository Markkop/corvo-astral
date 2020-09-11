import findPermutations from '../src/utils/permutateString'

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
