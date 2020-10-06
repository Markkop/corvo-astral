import { getAlmanaxBonus } from '../src/commands'
import { mockMessage } from './testUtils'
import { handleMessageError } from '../src/utils/handleError'

jest.mock('../src/utils/handleError', () => ({
  handleMessageError: jest.fn()
}))

describe('getAlmanaxBonus', () => {
  it('return the correct almanax bonus', () => {
    const content = '.alma'
    const userMessage = mockMessage(content)
    jest.spyOn(Date, 'now').mockReturnValue(new Date('2020-09-02T12:00:00'))
    const botMessage = getAlmanaxBonus(userMessage)
    expect(botMessage.embed).toMatchObject({
      color: '#40b2b5',
      title: ':tools: Crafting',
      description: 'Today the Almanax temple bonus is: + 20% EXP and Manufacturing Speed'
    })
  })

  it("calls handleMessageError if can't send a message", async () => {
    const content = '.alma'
    await getAlmanaxBonus({ content, guild: {}, channel: {} })
    expect(handleMessageError).toHaveBeenCalled()
  })
})
