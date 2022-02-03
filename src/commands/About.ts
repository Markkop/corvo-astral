import { BaseCommand } from '@baseCommands'
import stringsLang from '@stringsLang'
import { GuildConfig, PartialEmbed } from '@types'
import { openFile } from '@utils/files'
import { Interaction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

export const getData = (lang: string) => new SlashCommandBuilder()
  .setName('about')
  .setDescription(stringsLang.aboutCommandDescription[lang])
  .addStringOption(option => option.setName('lang').setDescription(stringsLang.langCommandOptionDescription[lang]))

export default class AboutCommand extends BaseCommand {
  constructor (interaction: Interaction, guildConfig: GuildConfig) {
    super(interaction, guildConfig)
  }

  public execute (): void {
    if (!this.interaction.isCommand()) return
    const lang = this.interaction.options.getString('lang')

    if (lang) {
      this.changeLang(lang)
    }

    const embed = this.mountAboutEmbed()
    this.send({ embeds: [embed] })
  }

  private mountAboutEmbed (): PartialEmbed {
    const wakfuVersion = openFile('data/raw/cdn/version.json')
    return {
      color: 0xFFFF00,
      title: ':crescent_moon: About Corvo Astral',
      description: stringsLang.aboutText[this.lang],
      footer: {
        text: `Wakfu version: ${wakfuVersion}`
      }
    }
  }
}
