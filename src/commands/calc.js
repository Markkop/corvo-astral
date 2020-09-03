/**
 * Calculates the damage of an attack
 * @param { String[] } args
 * @returns { String } message
 */
export function calculateAttackDamage (args) {
  const requiredArgs = ['dmg', 'base', 'res']
  const hasRequiredArgs = requiredArgs.every(requiredArg => args.includes(requiredArg))
  if (!hasRequiredArgs) {
    return 'está faltando alguma informação aí. Tente algo tipo: .calc dmg 1700 base 27 res 70%'
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
  return `atacando com domínio de ${damage} e dano base ${base} em resist ${resist}% ${backstabText}o dano é de ${Math.round(attackDamage)}`
}
