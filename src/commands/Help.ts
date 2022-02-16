import { BaseCommand } from '@baseCommands'
import stringsLang from '@stringsLang'
import { GuildConfig } from '@types'
import { addLangStringOption } from '@utils/registerCommands'
import { Interaction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import helpMessages from '@utils/helpMessages'

export const getData = (lang: string) => {
  const builder = new SlashCommandBuilder()
  builder
    .setName('help')
    .setDescription(stringsLang.helpCommandDescription[lang])
    .addStringOption(option => {
      option.setName('command')
        .setDescription(stringsLang.commandOptionHelpCommandDescription[lang])
        .setRequired(true)
      Object.keys(helpMessages).forEach(command => {
        option.addChoice(command, command)
      })
      return option
    })
  addLangStringOption(builder, lang)
  return builder
}
export default class HelpCommand extends BaseCommand {
  constructor (interaction: Interaction, guildConfig: GuildConfig) {
    super(interaction, guildConfig)
  }

  public execute (): void {
    if (!this.interaction.isCommand()) return
    const lang = this.interaction.options.getString('lang')
    const command = this.interaction.options.getString('command')

    if (lang) {
      this.changeLang(lang)
    }

    this.sendHelp(command)
  }
}
