import Command from './Command'

export default class AboutCommand extends Command {
  private aboutText = `**Corvo Astral** is a Discord Bot that serves as a helper for **Wakfu**, an Ankama's MMORPG.

  Made with Javascript and NodeJS and hosted on Heroku, this bot uses data gathered from Wakfu's CDN and Website as well Method's public API.
  
  Created by [Mark Kop](https://github.com/Markkop) (Markx - Rubilax)
  
  Want to contribute? This project is open source and it's available on Github
  Check it out: [https://github.com/Markkop/corvo-astral](https://github.com/Markkop/corvo-astral)
  
  Join the bot's discord server to get more help, report bugs or discover new features:
  https://discord.gg/aX6j3gM8HC    
  `
  

  public async return() {
    const embed = {
      color: 'YELLOW',
      title: ':crescent_moon: About Corvo Astral',
      description: this.aboutText
    }
    return this.message.channel.send({ embed })
  }
}