import { getAlmanaxBonus } from '../src/commands'

describe('getAlmanaxBonus', () => {
  it('return the correct almanax bonus', () => {
    const userMessage = {
      content: '.alma',
      reply: jest.fn()
    }
    const replySpy = jest.spyOn(userMessage, 'reply')
    jest.spyOn(Date, 'now').mockReturnValue(new Date('2020-09-02T12:00:00'))
    getAlmanaxBonus(userMessage)
    expect(replySpy).toHaveBeenCalledWith('o bônus do alma de hoje é +20% EXP e Velocidade em Fabricação')
  })
})
