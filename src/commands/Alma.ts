import { BaseCommand } from '@baseCommands'
import { AlmanaxBonus, GuildConfig, PartialEmbed } from '@types'
import { Message } from 'discord.js'
const events = require('../../data/almanaxBonuses.json')

export default class AlmaCommand extends BaseCommand {
  constructor (message: Message, guildConfig: GuildConfig) {
    super(message, guildConfig)
  }

  public execute (): void {
    const embed = AlmaCommand.getAndMountAlmanaxBonusEmbed(this.lang)
    this.send({ embed })
  }

  public static getAndMountAlmanaxBonusEmbed(lang: string) {
    const bonus = AlmaCommand.getWakfuBonus()
    return AlmaCommand.mountAlmanaxBonusEmbed(bonus, lang)
  }

  public static mountAlmanaxBonusEmbed (bonus: AlmanaxBonus, lang: string): PartialEmbed {
    const today = new Date(Date.now())
    const todayText = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
    return {
      color: 0x40b2b5,
      title: '<:alma:888871222648115261> Today\'s Almanax',
      description: `**Bonus:** ${bonus.text[lang]}`,
      footer: { text: todayText }
    }
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
