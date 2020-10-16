export const aboutText = `**Corvo Astral** is a Discord Bot thar serves as a helper for **Wakfu**, a Ankama's MMORPG.

Made with Javascript and NodeJS and hosted on Heroku, this bot uses data gathered from Wakfu's CDN and Website as well Method's public API.

Created by [Mark Kop](https://github.com/Markkop) (Markx)

Want to contribute? This project is open source and it's available on Github
Check it out: [https://github.com/Markkop/corvo-astral](https://github.com/Markkop/corvo-astral)`

/**
 * Send a message with information about this bot.
 *
 * @param { import('discord.js').Message } message - Discord message object.
 * @returns {Promise<object>}
 */
export function getAbout (message) {
  const embed = {
    color: 'YELLOW',
    title: ':crescent_moon: About Corvo Astral',
    description: aboutText
  }
  return message.channel.send({ embed })
}
