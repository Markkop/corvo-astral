import { AboutCommand } from '../tssrc/commands'
import stringsLang from '../tssrc/stringsLang'
import { mockMessageAndSpyChannelSend, embedContaining, defaultConfig } from './testutils'

describe('AboutCommand', () => {
  it('replies with about message embed', async () => {
    const content = '.about'
    const { userMessage, spy } = mockMessageAndSpyChannelSend(content)
    const equipCommand = new AboutCommand(userMessage, defaultConfig)
    equipCommand.execute()
    expect(spy).toHaveBeenCalledWith(embedContaining({
      color: 0xFFFF00,
      title: ':crescent_moon: About Corvo Astral',
      description: stringsLang.aboutText.en
    }))
  })
})
