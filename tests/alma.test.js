import { getAlmanaxBonus } from '../src/commands'

describe('getAlmanaxBonus', () => {
  it('return the correct almanax bonus', () => {
    jest.spyOn(Date, 'now').mockReturnValue(new Date('2020-09-03T12:00:00'))
    const reply = getAlmanaxBonus()
    expect(reply).toEqual('o bônus do alma de hoje é +30% EXP em Colheita e Plantação')
  })
})
