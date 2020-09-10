import { getAbout } from '../src/commands'
import { aboutText } from '../src/commands/about'

describe('getAbout', () => {
  it('sends the correct about text', () => {
    let botMessage = {}
    const userMessage = {
      content: '.about',
      channel: {
        send: jest.fn(message => { botMessage = message })
      }
    }
    getAbout(userMessage)
    expect(botMessage.embed).toMatchObject({
      color: 'YELLOW',
      title: ':crescent_moon: Sobre o Corvo Astral',
      description: aboutText
    })
  })
})
