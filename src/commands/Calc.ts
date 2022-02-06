import { BaseCommand } from '@baseCommands'
import str from '@stringsLang'
import { GuildConfig, PartialEmbed } from '@types'
import { Interaction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { addLangAndTranslateStringOptions } from '@utils/registerCommands'

type CalculatedValues = {
  damage: number
  base: number
  percentageResist: number
  flatResist: number
  critChance: number
  normalDamage: number
  normalDamageRange: string
  averageDamage: number
  backstabDamage: number
}

export const getData = (lang: string) => {
  const builder = new SlashCommandBuilder()
  builder
    .setName('calc')
    .setDescription(str.calcCommandDescription[lang])
    .addNumberOption(option => option.setName('dmg').setDescription(str.calcCommandDmgOptionDescription[lang]).setRequired(true))
    .addNumberOption(option => option.setName('base').setDescription(str.calcCommandBaseOptionDescription[lang]).setRequired(true))
    .addStringOption(option => option.setName('res').setDescription(str.calcCommandResOptionDescription[lang]).setRequired(true))
    .addStringOption(option => option.setName('crit').setDescription(str.calcCommandCritOptionDescription[lang]))
  addLangAndTranslateStringOptions(builder, lang)
  return builder
}

export default class CalcCommand extends BaseCommand {
  static data: SlashCommandBuilder
  
  constructor (interaction: Interaction, guildConfig: GuildConfig) {
    super(interaction, guildConfig)
  }

  public execute (): void {
    if (!this.interaction.isCommand()) return
    const lang = this.interaction.options.getString('lang')

    if (lang) {
      this.changeLang(lang)
    }

    const dmg = this.interaction.options.getNumber('dmg')
    const base = this.interaction.options.getNumber('base')
    const res = this.interaction.options.getString('res')
    const crit = this.interaction.options.getString('crit')
    const calculatedValues = this.calculateDamage({ 
      dmg: String(dmg), 
      base: String(base),
      res: String(res),
      crit: crit || ''
    })

    const translate = this.interaction.options.getString('translate')
    if (translate) {
      this.changeLang(translate)
    }

    const author = this.interaction.user.username
    const calcEmbed = this.mountCalcEmbed(author, calculatedValues)
    this.send({ embeds: [calcEmbed] })
  }

  private calculateDamage(options: Record<string, string>) {
    const damage = Number(options.dmg)
    const base = Number(options.base)
    const resist = options.res
    const crit = (options.crit && options.crit.split('%')[0]) || 0
    const critChance = Number(crit)
    const critChanceValue = critChance / 100
  
    const isPercentageResist = resist.includes('%')
    let percentageResist = Number(options.res.replace('%', ''))
    let flatResist = Number(options.res)
  
    if (isPercentageResist) {
      flatResist = Math.ceil((100 * Math.log(1 - percentageResist / 100)) / (2 * Math.log(2) - Math.log(5)))
    } else {
      percentageResist = this.convertFlatToPercentage(flatResist)
    }
    let normalDamage = Math.ceil(base * (1 + damage / 100) * (1 - percentageResist / 100))
    const critDamage = normalDamage * 1.25
    const backstabDamage = normalDamage * 1.25
    let averageDamage = normalDamage
    let normalDamageRange = ''
    if (critChance > 0) {
      averageDamage = Math.ceil((normalDamage * (1 - critChanceValue)) + (critDamage * critChanceValue))
      normalDamageRange = `${normalDamage}-${critDamage}`
    }

    return {
      damage,
      base,
      percentageResist,
      flatResist,
      critChance,
      normalDamage,
      normalDamageRange,
      averageDamage,
      backstabDamage
    }
  }

  private mountCalcEmbed (author, calculatedValues: CalculatedValues): PartialEmbed {
    return {
        color: 0x40b2b5,
        title: `:crossed_swords: ${author} ${str.attackedGobbal[this.lang]}`,
        thumbnail: { url: 'https://static.ankama.com/wakfu/portal/game/item/115/58218365.png' },
        fields: [
          {
            name: `:boxing_glove: ${str.capitalize(str.totalDomain[this.lang])}`,
            value: String(calculatedValues.damage),
            inline: true
          },
          {
            name: `:pushpin: ${str.capitalize(str.baseDamage[this.lang])}`,
            value: String(calculatedValues.base),
            inline: true
          },
          {
            name: `:shield: ${str.capitalize(str.targetResistance[this.lang])}`,
            value: `${calculatedValues.percentageResist}% (${calculatedValues.flatResist})`,
            inline: true
          },
          {
            name: `:game_die: ${str.capitalize(str.criticalchance[this.lang])}`,
            value: `${calculatedValues.critChance}%`,
            inline: true
          },
          {
            name: `:drop_of_blood: ${str.capitalize(str.damageDone[this.lang])}`,
            value: String(calculatedValues.normalDamageRange || calculatedValues.normalDamage),
            inline: true
          },
          {
            name: `:abacus: ${str.capitalize(str.averageDamage[this.lang])}`,
            value: String(calculatedValues.averageDamage),
            inline: true
          },
          {
            name: `:dagger: ${str.capitalize(str.backDamage[this.lang])}`,
            value: String(calculatedValues.backstabDamage),
            inline: true
          }
        ]
    }
  }

  private convertFlatToPercentage (flatResist: number) {
    return Math.floor((1 - Math.pow(0.8, flatResist / 100)) * 100)
  }
}
