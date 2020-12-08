import { getArgumentsAndOptions } from '../utils/message'
import { mountCommandHelpEmbed } from './help'
import { setLanguage } from '../utils/language'
import str from '../stringsLang'

/**
 * Convert flat resist to its percentage value.
 *
 * @param {number} flatResist
 * @returns {number}
 */
export function convertFlatToPercentage (flatResist) {
  return Math.floor((1 - Math.pow(0.8, flatResist / 100)) * 100)
}

/**
 * Replies the user with the damage of a calculated attack.
 *
 * @param { import('discord.js').Message } message - Discord message object.
 * @returns { Promise<object>}
 */
export function calculateAttackDamage (message) {
  const { options } = getArgumentsAndOptions(message, '=')
  const lang = setLanguage(options, message.guild.id)

  const requiredArgs = ['dmg', 'base', 'res']
  const hasRequiredArgs = requiredArgs.every(requiredArg => Boolean(options[requiredArg]))
  if (!hasRequiredArgs) {
    const helpEmbed = mountCommandHelpEmbed(message, lang)
    return message.channel.send({ embed: helpEmbed })
  }

  const author = message.author.username
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
    percentageResist = convertFlatToPercentage(flatResist)
  }
  let normalDamage = Math.ceil(base * (1 + damage / 100) * (1 - percentageResist / 100))
  const critDamage = normalDamage * 1.25
  const backstabDamage = normalDamage * 1.25
  let averageDamage = normalDamage
  if (critChance > 0) {
    averageDamage = Math.ceil((normalDamage * (1 - critChanceValue)) + (critDamage * critChanceValue))
    normalDamage = `${normalDamage}-${critDamage}`
  }

  return message.channel.send({
    embed: {
      color: 'LIGHT_GREY',
      title: `:crossed_swords: ${author} ${str.attackedGobbal[lang]}`,
      thumbnail: { url: 'https://static.ankama.com/wakfu/portal/game/item/115/58218365.png' },
      fields: [
        {
          name: `:boxing_glove: ${str.capitalize(str.totalDomain[lang])}`,
          value: damage,
          inline: true
        },
        {
          name: `:pushpin: ${str.capitalize(str.baseDamage[lang])}`,
          value: base,
          inline: true
        },
        {
          name: `:shield: ${str.capitalize(str.targetResistance[lang])}`,
          value: `${percentageResist}% (${flatResist})`,
          inline: true
        },
        {
          name: `:game_die: ${str.capitalize(str.criticalchance[lang])}`,
          value: `${critChance}%`,
          inline: true
        },
        {
          name: `:drop_of_blood: ${str.capitalize(str.damageDone[lang])}`,
          value: normalDamage,
          inline: true
        },
        {
          name: `:abacus: ${str.capitalize(str.averageDamage[lang])}`,
          value: averageDamage,
          inline: true
        },
        {
          name: `:dagger: ${str.capitalize(str.backDamage[lang])}`,
          value: backstabDamage,
          inline: true
        }
      ]
    }
  })
}
