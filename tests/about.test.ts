import { AboutCommand } from '../src/commands'
import stringsLang from '../src/stringsLang'
import { executeCommandAndSpySentMessage, embedContaining } from './testutils'

describe('AboutCommand', () => {
  it('replies with about message embed', async () => {
    const spy = await executeCommandAndSpySentMessage(AboutCommand, '.about')
    expect(spy).toHaveBeenCalledWith(embedContaining({
      color: 0xFFFF00,
      title: ':crescent_moon: About Corvo Astral',
      description: stringsLang.aboutText.en
    }))
  })
})
