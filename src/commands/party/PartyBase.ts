import { BaseCommand } from '@baseCommands'
import stringsLang from '@stringsLang'
import { GuildConfig, PartialEmbed } from '@types'
import { MessageManager } from '@managers'
import { Message } from 'discord.js'
import { PartyCreateCommand, PartyUpdateCommand } from '@commands'

export default class AboutCommand extends BaseCommand {
  private partyActions = {
    create: PartyCreateCommand,
    update: PartyUpdateCommand
  }

  constructor (message: Message, guildConfig: GuildConfig) {
    super(message, guildConfig)
  }

  private getPartyCommand (partyArgument: string) {
    return this.partyActions[partyArgument]
  }

  public async execute (): Promise<void> {
    const { args } = MessageManager.getArgumentsAndOptions(this.message)
    const argument = args[0]

    const isValidArgument = Object.keys(this.partyActions).some(key => key === argument)
    if (!isValidArgument) {
      this.sendHelp()
    }

    const PartyCommand = this.getPartyCommand(argument)

    if (!PartyCommand) return

    const PartyCommandClass = new PartyCommand(this.message, this.guildConfig)
    await PartyCommandClass.execute()
  }
}
