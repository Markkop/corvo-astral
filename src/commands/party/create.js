import { getPartyChannel, getChannelParties } from '../../utils/partyChannel'
import { commandsHelp } from '../help'

/**
 * Create a party message on the parties channel
 * .create nome="dp" data=12/09 hora=19:15 lvl=125 vagas=6.
 *
 * @param {object} message
 * @param {object }options
 * @returns {object}
 */
export async function createParty (message, options) {
  const hasRequiredOptions = options.nome && options.data && options.hora && options.lvl
  if (!hasRequiredOptions) {
    return message.channel.send({
      embed: {
        color: 'LIGHT_GREY',
        title: ':grey_question: Ajuda: `.create`',
        description: commandsHelp.party
      }
    })
  }
  const partyMessages = await getChannelParties(message)
  let identifier = 1
  if (partyMessages.size) {
    const lastPartyMessageSent = partyMessages.first()
    const lastPartyMessageEmbed = lastPartyMessageSent.embeds[0].fields.find(field => field.name === 'Identificador')
    identifier = Number(lastPartyMessageEmbed.value) + 1
  }
  const memberSlots = Array(options.vagas || 6).fill('*').join('\n')
  const embed = {
    title: `Grupo: ${options.nome}`,
    fields: [
      {
        name: 'Identificador',
        value: identifier,
        inline: true
      },
      {
        name: 'Data',
        value: `${options.data} ${options.hora}`,
        inline: true
      },
      {
        name: 'Nível',
        value: options.lvl,
        inline: true
      },
      {
        name: 'Participantes',
        value: memberSlots
      }
    ]
  }
  const partyChannel = getPartyChannel(message)
  return partyChannel.send({ embed })
}
