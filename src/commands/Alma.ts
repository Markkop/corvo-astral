import { BaseCommand } from '@baseCommands'
import { AlmanaxBonus, GuildConfig, PartialEmbed } from '@types'
import { getRandomIntInclusive } from '@utils/numbers'
import { Message } from 'discord.js'
import str from '@stringsLang'
import { MessageManager } from '@managers'
const events = require('../../data/almanaxBonuses.json')

export default class AlmaCommand extends BaseCommand {
  constructor (message: Message, guildConfig: GuildConfig) {
    super(message, guildConfig)
  }

  public execute (): void {
    const { options } = MessageManager.getArgumentsAndOptions(this.message)

    if (options.lang) {
      this.changeLang(options.lang)
    }

    const embed = AlmaCommand.getAndMountAlmanaxBonusEmbed(this.lang)
    this.send({ embed })
  }

  public static getAndMountAlmanaxBonusEmbed(lang: string) {
    const bonus = AlmaCommand.getWakfuBonus()
    return AlmaCommand.mountAlmanaxBonusEmbed(bonus, lang)
  }

  public static mountAlmanaxBonusEmbed (bonus: AlmanaxBonus, lang: string): PartialEmbed {
    const randomNumber = getRandomIntInclusive(1, 10)
    let extraInfo = ''
    if (randomNumber > 8) {
      extraInfo = str.donationExtraMessage[lang]
    }

    const embed = {
      color: 0x40b2b5,
      title: '<:alma:888871222648115261> Today\'s Almanax',
      description: `**Bonus:** ${bonus.text[lang]}${extraInfo}`
    } as PartialEmbed

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
