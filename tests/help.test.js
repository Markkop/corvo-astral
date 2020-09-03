import { getHelp } from '../src/commands'

describe('getHelp', () => {
  it('returns the expected help for ".help alma"', () => {
    const userMessage = {
      content: '.help alma',
      reply: jest.fn()
    }
    const replySpy = jest.spyOn(userMessage, 'reply')
    getHelp(userMessage)
    expect(replySpy).toHaveBeenCalledWith('Descubra o bônus do alma para o dia atual. Em breve retornarão também o bônus para os próximos dias ;D')
  })
})
