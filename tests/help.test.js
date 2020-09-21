import { getHelp } from '../src/commands'
import commandsHelp from '../src/utils/helpMessages'
import { mockMessage } from './testUtils'

describe('getHelp', () => {
  it('returns the expected help for ".help alma"', async () => {
    const content = '.help alma'
    const userMessage = mockMessage(content)
    const botMessage = await getHelp(userMessage)
    expect(botMessage.embed).toMatchObject({
      title: ':grey_question: Help: `.help alma`',
      description: 'Discover the Almanax bonus for the current day'
    })
  })

  it('returns the generic help when no arguments are provided', async () => {
    const content = '.help'
    const userMessage = mockMessage(content)
    const botMessage = await getHelp(userMessage)
    expect(botMessage.embed).toMatchObject({
      color: 'LIGHT_GREY',
      title: ':grey_question: Help',
      description: 'type `.help <command>` to get help for an specific command',
      fields: [
        {
          name: 'Internacionalization',
          value: 'Some commands support `lang=<lang>` and `translate=<lang>` options.\nAvailable languages: `en`, `pt`, `fr` and `es`.'
        },
        {
          name: 'Available Commands',
          value: Object.keys(commandsHelp).map(command => `\`${command}\``).join(', ')
        }
      ]
    })
  })

  it('returns a warning if more than one argument is provided', async () => {
    const content = '.help calc equip'
    const userMessage = mockMessage(content)
    const botMessage = await getHelp(userMessage)
    expect(botMessage.embed).toMatchObject({
      color: 'LIGHT_GREY',
      title: ':grey_question: Help',
      description: 'You can get help for only one command',
      fields: [
        {
          name: 'Internacionalization',
          value: 'Some commands support `lang=<lang>` and `translate=<lang>` options.\nAvailable languages: `en`, `pt`, `fr` and `es`.'
        },
        {
          name: 'Available Commands',
          value: Object.keys(commandsHelp).map(command => `\`${command}\``).join(', ')
        }
      ]
    })
  })
})
