import { BaseCommand } from '@baseCommands'
import { AlmanaxBonus, GuildConfig } from '@types'
import { getRandomIntInclusive } from '@utils/numbers'
import { Interaction, MessageEmbed } from 'discord.js'
import str from '@stringsLang'
import { SlashCommandBuilder } from '@discordjs/builders'
import { addLangStringOption } from '@utils/registerCommands'
import { getDaysUntilShutdown } from '@utils/shutdown'
const events = require('../../data/almanaxBonuses.json')

export const getData = (lang: string) => {
  const builder = new SlashCommandBuilder()
  builder
    .setName('alma')
    .setDescription(str.almaCommandDescription[lang])
  addLangStringOption(builder, lang)
  return builder
}

class AlmaCommand extends BaseCommand {
  constructor (interaction: Interaction, guildConfig: GuildConfig) {
    super(interaction, guildConfig)
  }

  public execute (): void {
    if (!this.interaction.isCommand()) return
    const lang = this.interaction.options.getString('lang')

    if (lang) {
      this.changeLang(lang)
    }

    const embed = AlmaCommand.getAndMountAlmanaxBonusEmbed(this.lang)
    this.send({ embeds: [embed] })
  }

  public static getAndMountAlmanaxBonusEmbed(lang: string) {
    const bonus = AlmaCommand.getWakfuBonus()
    return AlmaCommand.mountAlmanaxBonusEmbed(bonus, lang)
  }

  public static mountAlmanaxBonusEmbed (bonus: AlmanaxBonus, lang: string): MessageEmbed {
 
    const embed = {
      color: 0x40b2b5,
      title: '<:alma:888871222648115261> Today\'s Almanax [DEPRECATED]',
      description: ` **Bonus:** ${bonus.text[lang]}\n(The Almanax Bonus was removed from the game)`,
    } as MessageEmbed

    return embed
  }

  public static getWakfuBonus (day = new Date(Date.now())) {
    return events.find((event: AlmanaxBonus) => {
      const eventFirstDate = new Date(event.firstDate)
      const diffTime = Math.abs(Number(day) - Number(eventFirstDate))
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      return diffDays % 5 === 0
    })
  }
}

export default AlmaCommand
