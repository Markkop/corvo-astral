import { getAlmanaxBonus } from '../src/commands'
import { mockMessage } from './testUtils'

describe('getAlmanaxBonus', () => {
  it('return the correct almanax bonus', () => {
    const content = '.alma'
    const userMessage = mockMessage(content)
    jest.spyOn(Date, 'now').mockReturnValue(new Date('2020-09-02T12:00:00'))
    const botMessage = getAlmanaxBonus(userMessage)
    expect(botMessage.embed).toMatchObject({
      color: '#40b2b5',
      title: ':tools: Fabricação',
      description: 'Hoje o bônus do alma é: +20% EXP e Velocidade em Fabricação'
    })
  })
})
