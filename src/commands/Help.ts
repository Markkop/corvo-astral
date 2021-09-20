import { BaseCommand } from '@baseCommands'
import { MessageManager } from '@managers'
import { GuildConfig } from '@types'
import { Message } from 'discord.js'

export default class HelpCommand extends BaseCommand {
  constructor (message: Message, guildConfig: GuildConfig) {
    super(message, guildConfig)
  }

  public execute (): void {
    const { args, options } = MessageManager.getArgumentsAndOptions(this.message)

    if (options.lang) {
      this.changeLang(options.lang)
    }

    this.sendHelp(args[0])
  }
}
