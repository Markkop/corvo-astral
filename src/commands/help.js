import { getArguments } from '../utils'

const commandsHelp = {
  alma: 'Descubra o bônus do alma para o dia atual. Em breve retornarão também o bônus para os próximos dias ;D',
  calc: `Calcule o dano de um ataque causado.
Parâmetros:
* \`dmg\`: domínio total (maior elemental + secundários)
* \`base\`: dano base da skill
* \`res\`: resistência do alvo. Pode ser em % ou total
* \`on back\` ou \`on side\`: modificador para um ataque nas costas ou lados (opcional)
Exemplo: \`.calc dmg 3000 base 55 res 60%\``,
  subli: 'Pesquise por sublimações pelo nome ou slots. Ex: `.subli talho`, `.subli rrb`, `.subli epic`',
  help: 'Nice try'
}

/**
 * Replies the user with a help message.
 *
 * @param { import('discord.js').Message } message - Discord message object.
 */
export function getHelp (message) {
  const args = getArguments(message)
  const hasArguments = Boolean(args.length)
  const hasTooManyArguments = args.length > 1
  const helpArgument = args[0]
  const commandsListText = Object.keys(commandsHelp).map(command => `\`${command}\``).join(', ')
  if (!hasArguments) {
    message.reply(`digite \`.help <comando>\` para obter ajuda sobre um comando específico
Atualmente os comandos disponíveis são: ${commandsListText}`)
    return
  }

  if (hasTooManyArguments) {
    message.reply('você só pode pedir ajuda pra um comando u_u')
    return
  }

  message.reply(commandsHelp[helpArgument])
}
