import { getAlmanaxBonus } from '../src/commands'

describe('getAlmanaxBonus', () => {
  it('return the correct almanax bonus', () => {
    let botMessage = {}
    const userMessage = {
      content: '.alma',
      channel: {
        send: jest.fn(message => { botMessage = message })
      }
    }
    jest.spyOn(Date, 'now').mockReturnValue(new Date('2020-09-02T12:00:00'))
    getAlmanaxBonus(userMessage)
    expect(botMessage.embed).toMatchObject({
      title: ':tools: Fabricação'
    })
  })
})
