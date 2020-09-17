import { getArgumentsAndOptions, getCommand } from '../utils/message'
import config from '../config'
const { prefix } = config

export const commandsHelp = {
  alma: 'Descubra o bônus do alma para o dia atual. Em breve retornarão também o bônus para os próximos dias ;D',
  calc: `Calcule o dano de um ataque causado.
Parâmetros:
* \`dmg\`: domínio total (maior elemental + secundários)
* \`base\`: dano base da skill
* \`res\`: resistência do alvo. Pode ser em % ou total
* \`crit\`: chance crítica em % (opcional)
Exemplos: 
\`.calc dmg=3000 base=55 res=60%\`
\`.calc dmg=5000 base=40 res=420 crit=30%\``,
  subli: `Pesquise por sublimações pelo nome, combinação de slots ou fonte de obtenção.
Use a opção --any-order para obter resultados por slots em qualquer ordem.
Exemplos: 
\`.subli talho\`
\`.subli rrb\`
\`.subli ggwr\`  
\`.subli rgb --any-order\`  
\`.subli epic\`
\`.subli quest\`
\`.subli koko\`
\`.subli craft\``,
  equip: `Pesquise pelo nome do equipamento e outros filtros.
Por enquanto o único filtro disponível é o de raridade.
Exemplos:
\`.equip martelo de osamodas\`
\`.equip o eterno raridade=mítico\``,
  about: 'Exibe informações sobre o Corvo Astral',
  party: `Liste e participe de grupo com as funções do \`.party\`!
  
Crie um grupo no canal de grupos fornecendo as seguintes informações: nome do grupo, descrição, data, nível e vagas.

\`.party create nome="Flagelopardo s21 3 stele" desc="procuro corta cura, enu e danos distância" lvl="186+"\`
\`.party create nome="up em moon" data=15/10 lvl="160-200" vagas=3\`
\`.party create nome="dg excarnus s21" data="21/11 21:00" lvl=80\`
**Obs: note que quando tiver espaço, é necessário usar "" em volta da opção.**

Se data não for fornecido, vem como "A combinar"
Se nível não for fornecido, vem como "1-215"
Se vagas não for fornecido, vem como 6 (máximo 50 vagas)
Para alterar nome, data, nível e descrição, use o comando \`.party update\`

Entre em algum grupo já criado no canal de grupos informando o id do grupo e a sua classe.
\`.party join id=1 class=enu\`

Atualize o nome, a data e o lvl de um grupo. Caso você não seja o líder, só pode atualizar a classe.
\`.party update id=50 data="12/11 15:00"\`
\`.party update id=32 class=feca\`

Saia de um grupo.
\`.party leave id=32\`

Dica:
Você também pode usar as reações da mensagem de grupo para entrar, sair ou adicionar/remover classes.`,
  help: 'Nice try'
}

const commandsListText = Object.keys(commandsHelp).map(command => `\`${command}\``).join(', ')

/**
 * Mounts the help message embed.
 *
 * @param {object|string} messageOrArgument
 * @returns {object}
 */
export function mountCommandHelpEmbed (messageOrArgument) {
  const command = typeof messageOrArgument === 'string' ? messageOrArgument : getCommand(prefix, messageOrArgument)
  return {
    color: 'LIGHT_GREY',
    title: `:grey_question: Ajuda: \`.help ${command}\``,
    description: commandsHelp[command],
    fields: [
      {
        name: 'Comandos disponíveis',
        value: commandsListText
      }
    ]
  }
}

/**
 * Replies the user with a help message.
 *
 * @param { import('discord.js').Message } message - Discord message object.
 * @returns {Promise<object>}
 */
export function getHelp (message) {
  const { args } = getArgumentsAndOptions(message, '=')
  const hasArguments = Boolean(args.length)
  const hasTooManyArguments = args.length > 1
  const helpArgument = args[0]
  const embed = {
    color: 'LIGHT_GREY',
    title: ':grey_question: Ajuda',
    description: 'digite `.help <comando>` para obter ajuda sobre um comando específico',
    fields: [
      {
        name: 'Comandos disponíveis',
        value: commandsListText
      }
    ]
  }
  if (!hasArguments) {
    return message.channel.send({ embed })
  }

  if (hasTooManyArguments) {
    embed.description = 'você só pode pedir ajuda pra um comando u_u'
    return message.channel.send({ embed })
  }

  const helpEmbed = mountCommandHelpEmbed(helpArgument)
  return message.channel.send({ embed: helpEmbed })
}
