import { getArguments } from '../utils/message'

/**
 * Replies the user with the damage of a calculated attack.
 *
 * @param { import('discord.js').Message } message - Discord message object.
 */
export function calculateAttackDamage (message) {
  const args = getArguments(message)
  const requiredArgs = ['dmg', 'base', 'res']
  const hasRequiredArgs = requiredArgs.every(requiredArg => args.includes(requiredArg))
  if (!hasRequiredArgs) {
    message.reply('tem alguma coisa errada aí. Digite `.help calc` para mais informações.')
    return
  }
  const damage = args[args.indexOf('dmg') + 1]
  const base = args[args.indexOf('base') + 1]
  let resist = args[args.indexOf('res') + 1]
  const hasBackArgument = args[args.indexOf('on') + 1] === 'back'
  const hasSideArgument = args[args.indexOf('on') + 1] === 'side'
  const backstabMultiplier = hasBackArgument ? 1.25 : 1
  const sidestabMultiplier = hasSideArgument ? 1.10 : 1
  resist = resist.includes('%') ? resist.split('%')[0] : Math.floor((1 - Math.pow(0.8, resist / 100)) * 100)
  const attackDamage = base * backstabMultiplier * sidestabMultiplier * (1 + damage / 100) * (1 - resist / 100)
  const backstabText = hasBackArgument ? 'nas costas ' : (hasSideArgument ? 'nos lados ' : '')
  message.reply(`atacando com domínio de ${damage} e dano base ${base} em resist ${resist}% ${backstabText}o dano é de ${Math.round(attackDamage)}`)
}
