import { getHelp } from '../src/commands'
import { commandsHelp } from '../src/commands/help'

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

  it('returns the generic help when no arguments are provided', () => {
    let botMessage = {}
    const userMessage = {
      content: '.help',
      channel: {
        send: jest.fn(message => { botMessage = message })
      }
    }
    getHelp(userMessage)
    expect(botMessage.embed).toMatchObject({
      color: 'LIGHT_GREY',
      title: ':grey_question: Ajuda',
      description: 'digite `.help <comando>` para obter ajuda sobre um comando específico',
      fields: [
        {
          name: 'Comandos disponíveis',
          value: Object.keys(commandsHelp).map(command => `\`${command}\``).join(', ')
        }
      ]
    })
  })

  it('returns a warning if more than one argument is provided', () => {
    let botMessage = {}
    const userMessage = {
      content: '.help calc equip',
      channel: {
        send: jest.fn(message => { botMessage = message })
      }
    }
    getHelp(userMessage)
    expect(botMessage.embed).toMatchObject({
      color: 'LIGHT_GREY',
      title: ':grey_question: Ajuda',
      description: 'você só pode pedir ajuda pra um comando u_u',
      fields: [
        {
          name: 'Comandos disponíveis',
          value: Object.keys(commandsHelp).map(command => `\`${command}\``).join(', ')
        }
      ]
    })
  })
})
