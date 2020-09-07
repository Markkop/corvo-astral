import { getArguments, mapArgumentsToObject } from '../utils/message'
import { commandsHelp } from './help'

/**
 * Replies the user with the damage of a calculated attack.
 *
 * @param { import('discord.js').Message } message - Discord message object.
 */
export function calculateAttackDamage (message) {
  const rawArguments = getArguments(message)
  const args = mapArgumentsToObject(rawArguments, '=')
  const requiredArgs = ['dmg', 'base', 'res']
  const hasRequiredArgs = requiredArgs.every(requiredArg => Object.keys(args).includes(requiredArg))
  if (!hasRequiredArgs) {
    message.channel.send({
      embed: {
        color: '#ffffff',
        title: ':grey_question: Ajuda: `.equip`',
        description: commandsHelp.calc
      }
    })
    return
  }

  const author = message.author.username || ''
  const damage = Number(args.dmg)
  const base = Number(args.base)
  const resist = args.res
  const crit = (args.crit && args.crit.split('%')[0]) || 0
  const critChance = Number(crit)
  const critChanceValue = critChance / 100

  const isPercentageResist = resist.includes('%')
  let percentageResist = Number(args.res.replace('%', ''))
  let flatResist = Number(args.res)

  if (isPercentageResist) {
    flatResist = Math.ceil((100 * Math.log(1 - percentageResist / 100)) / (2 * Math.log(2) - Math.log(5)))
  } else {
    percentageResist = Math.floor((1 - Math.pow(0.8, flatResist / 100)) * 100)
  }
  let normalDamage = Math.ceil(base * (1 + damage / 100) * (1 - percentageResist / 100))
  const critDamage = normalDamage * 1.25
  const backstabDamage = normalDamage * 1.25
  let averageDamage = normalDamage
  if (critChance > 0) {
    averageDamage = Math.ceil((normalDamage * (1 - critChanceValue)) + (critDamage * critChanceValue))
    normalDamage = `${normalDamage}-${critDamage}`
  }

  message.channel.send({
    embed: {
      color: 'LIGHT_GREY',
      title: `:crossed_swords: ${author} atacou um Papatudo!`,
      thumbnail: { url: 'https://static.ankama.com/wakfu/portal/game/item/115/58218365.png' },
      description: 'Tadinho...',
      fields: [
        {
          name: ':boxing_glove: Domínio Total',
          value: damage,
          inline: true
        },
        {
          name: ':pushpin: Dano Base',
          value: base,
          inline: true
        },
        {
          name: ':shield: Resistência do Alvo',
          value: `${percentageResist}% (${flatResist})`,
          inline: true
        },
        {
          name: ':game_die: Chance Crítica',
          value: `${critChance}%`,
          inline: true
        },
        {
          name: ':drop_of_blood: Dano causado',
          value: normalDamage,
          inline: true
        },
        {
          name: ':abacus: Dano médio',
          value: averageDamage,
          inline: true
        },
        {
          name: ':dagger: Dano nas costas',
          value: backstabDamage,
          inline: true
        }
      ]
    }
  })
}
