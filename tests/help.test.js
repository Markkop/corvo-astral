import { getHelp } from '../src/commands'

describe('getHelp', () => {
  it('returns the expected help for ".help alma"', () => {
    let botMessage = {}
    const userMessage = {
      content: '.help alma',
      channel: {
        send: jest.fn(message => { botMessage = message })
      }
    }
    getHelp(userMessage)
    expect(botMessage.embed).toMatchObject({
      title: ':grey_question: Ajuda: `.help alma`',
      description: 'Descubra o bônus do alma para o dia atual. Em breve retornarão também o bônus para os próximos dias ;D'
    })
  })
})
