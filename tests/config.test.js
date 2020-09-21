import { configGuild } from '../src/commands'
import helpMessages from '../src/utils/helpMessages'
import { mockMessage } from './testUtils'
import config from '../src/config'

jest.mock('mongoose', () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
  connection: {}
}))

jest.mock('../src/models/guild', () => ({
  find: jest.fn()
    .mockImplementationOnce(() => ({ lean: jest.fn().mockResolvedValueOnce([null]) }))
    .mockImplementationOnce(() => ({ lean: jest.fn().mockResolvedValueOnce([{ lang: 'fr' }]) })),
  findOneAndUpdate: jest.fn()
    .mockResolvedValueOnce({ lang: 'es', save: jest.fn() })
    .mockResolvedValueOnce({ lang: 'fr', save: jest.fn() })
}))

describe('configGuild', () => {
  it('gets default config if no guild id was found', async () => {
    const content = '.config get'
    const userMessage = mockMessage(content)
    const botMessage = await configGuild(userMessage)
    expect(botMessage.embed).toEqual({
      description: `\`\`\`json
{
  "lang": "en",
  "prefix": ".",
  "almanaxChannel": "almanax",
  "partyChannel": "listagem-de-grupos"
}
\`\`\``,
      title: 'No custom config found. Using default'
    })
  })

  it('gets custom config', async () => {
    const content = '.config get'
    const userMessage = mockMessage(content)
    const botMessage = await configGuild(userMessage)
    expect(botMessage.embed).toEqual({
      description: `\`\`\`json
{
  "lang": "fr",
  "prefix": ".",
  "almanaxChannel": "almanax",
  "partyChannel": "listagem-de-grupos"
}
\`\`\``,
      title: 'Config for "GuildName"'
    })
  })

  it('returns a no permission message if user does not have permission', async () => {
    const content = '.config set lang=es'
    const userMessage = mockMessage(content)
    userMessage.member = {}
    userMessage.member.hasPermission = () => false
    const botMessage = await configGuild(userMessage)
    expect(botMessage).toEqual('You need administrator permission for this')
  })

  it('returns an invalid lang message option is not a valid lang', async () => {
    const content = '.config set lang=mylanglol'
    const userMessage = mockMessage(content)
    userMessage.member = {}
    userMessage.member.hasPermission = () => true
    const botMessage = await configGuild(userMessage)
    expect(botMessage).toEqual('mylanglol is not a valid language.')
  })

  it('sets a custom config if it is the first guild config', async () => {
    const content = '.config set lang=es'
    const userMessage = mockMessage(content)
    userMessage.member = {}
    userMessage.member.hasPermission = () => true
    const botMessage = await configGuild(userMessage)
    expect(botMessage.embed).toEqual({
      description: `\`\`\`json
{
  "lang": "es"
}
\`\`\``,
      title: 'Config updated'
    })
  })

  it('sets a custom config if there was already a guild config', async () => {
    const content = '.config set partyChannel=party'
    const userMessage = mockMessage(content)
    config.guildsOptions.push({
      id: 1,
      lang: 'fr'
    })
    userMessage.guild.id = 1
    userMessage.member = {}
    userMessage.member.hasPermission = () => true
    const botMessage = await configGuild(userMessage)
    expect(botMessage.embed).toEqual({
      description: `\`\`\`json
{
  "partyChannel": "party"
}
\`\`\``,
      title: 'Config updated'
    })
  })

  it('return a help message if no query was provided', async () => {
    const content = '.config'
    const userMessage = mockMessage(content)
    const botMessage = await configGuild(userMessage)
    expect(botMessage.embed).toMatchObject({
      description: helpMessages.config.help.en
    })
  })

  it('catches an error', async () => {
    const spy = jest.spyOn(global.console, 'log').mockImplementation()
    const content = '.config set lang=pt'
    const userMessage = mockMessage(content)
    userMessage.guild = {}
    await configGuild(userMessage)
    expect(spy).toHaveBeenCalled()
  })
})
