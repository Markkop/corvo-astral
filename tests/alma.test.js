import { getAlmanaxBonus } from '../src/commands'

describe('getAlmanaxBonus', () => {
  it('return the correct almanax bonus', () => {
    const userMessage = {
      content: '.alma',
      reply: jest.fn()
    }
    const replySpy = jest.spyOn(userMessage, 'reply')
    getAlmanaxBonus(userMessage)

    jest.spyOn(Date, 'now').mockReturnValue(new Date('2020-09-03T12:00:00'))
    expect(replySpy).toHaveBeenCalledWith('o bônus do alma de hoje é +30% EXP em Colheita e Plantação')
  })
})
