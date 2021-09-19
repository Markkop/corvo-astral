import { BaseCommand } from '@baseCommands'
import { MessageManager } from '@managers'
import stringsLang from '@stringsLang'
import { GuildConfig, PartialEmbed } from '@types'
import { Message } from 'discord.js'

export default class AboutCommand extends BaseCommand {
  constructor (message: Message, guildConfig: GuildConfig) {
    super(message, guildConfig)
  }

  public execute (): void {
    const { options } = MessageManager.getArgumentsAndOptions(this.message)

    if (options.lang) {
      this.changeLang(options.lang)
    }

    const embed = this.mountAboutEmbed()
    this.send({ embed })
  }

  private mountAboutEmbed (): PartialEmbed {
    return {
      color: 0xFFFF00,
      title: ':crescent_moon: About Corvo Astral',
      description: stringsLang.aboutText[this.lang]
    }
  }
}
