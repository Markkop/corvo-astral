import { AboutCommand } from '../tssrc/commands'
import stringsLang from '../tssrc/stringsLang'
import { executeCommandAndSpySentMessage, embedContaining } from './testutils'

describe('AboutCommand', () => {
  it('replies with about message embed', async () => {
    const spy = executeCommandAndSpySentMessage(AboutCommand, '.about')
    expect(spy).toHaveBeenCalledWith(embedContaining({
      color: 0xFFFF00,
      title: ':crescent_moon: About Corvo Astral',
      description: stringsLang.aboutText.en
    }))
  })
})
