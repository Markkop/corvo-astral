import { BaseCommand } from '@baseCommands'
import stringsLang from '@stringsLang'
import { GuildConfig, PartialEmbed } from '@types'
import { Message } from 'discord.js'

export default class AboutCommand extends BaseCommand {
  constructor (message: Message, guildConfig: GuildConfig) {
    super(message, guildConfig)
  }

  public execute (): void {
    const embed = this.mountAboutEmbed()
    this.reply({ embed })
  }

  private mountAboutEmbed (): PartialEmbed {
    return {
      color: 0xFFFF00,
      title: ':crescent_moon: About Corvo Astral',
      description: stringsLang.aboutText[this.lang]
    }
  }
}
