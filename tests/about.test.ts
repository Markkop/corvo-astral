import AboutCommand, { getData } from '../src/commands/About'
import stringsLang from '../src/stringsLang'
import { executeCommandAndSpyReply, embedContaining, getParsedCommand } from './testutils'

describe('AboutCommand', () => {
  it('replies with about message embed', async () => {
    const commandData = getData('en')
    const stringCommand = '/about'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(AboutCommand, command)
    expect(spy).toHaveBeenCalledWith(embedContaining({
      color: 0xFFFF00,
      title: ':crescent_moon: About Corvo Astral',
      description: stringsLang.aboutText.en,
      footer: {
        text: expect.stringContaining('Wakfu version')
      }
    }))
  })
})
