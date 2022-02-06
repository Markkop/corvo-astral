import { Interaction } from 'discord.js'
import { AboutCommand } from '../src/commands'
import stringsLang from '../src/stringsLang'
import { executeCommandAndSpyReply, embedContaining } from './testutils'

describe('AboutCommand', () => {
  it('replies with about message embed', async () => {
    const command = {
      name: 'about'
    }
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
