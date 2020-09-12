import { getArguments, mapArgumentsToObject } from '../../utils/message'
import { getChannelParties } from '../../utils/partyChannel'
import { commandsHelp } from '../help'
import Discord from 'discord.js'

/**
 * Get a message that matched a embed field name.
 *
 * @param {object[]} messages
 * @param {string} name
 * @returns {object}
 */
function getMessageByEmbedName (messages, name) {
  return messages.find(message => {
    return message.embeds[0].fields.find(field => field.name === name)
  })
}

/**
 * Join a party
 * .join id=2 class=enu.
 *
 * @param {object} message
 * @returns {object}
 */
export async function joinParty (message) {
  const args = getArguments(message)
  const options = mapArgumentsToObject(args, '=')
  const hasRequiredOptions = Boolean(options.class)
  if (!hasRequiredOptions) {
    return message.channel.send({
      embed: {
        color: 'LIGHT_GREY',
        title: ':grey_question: Ajuda: `.join`',
        description: commandsHelp.join
      }
    })
  }

  const partyMessages = await getChannelParties(message)
  const matchingParty = getMessageByEmbedName(partyMessages, 'Identificador')
  if (!matchingParty) {
    return
  }
  const partySlots = matchingParty.embeds[0].fields.find(field => field.name === 'Participantes').value.split('\n')
  partySlots[0] = `* <@${message.author.id} | ${options.class || ''}>`
  const newPartySlots = partySlots.join('\n')
  const embedFields = matchingParty.embeds[0].fields.filter(field => field.name !== 'Participantes')
  const embed = {
    ...matchingParty.embeds[0],
    fields: [
      ...embedFields,
      {
        name: 'Participantes',
        value: newPartySlots
      }
    ]
  }
  const newEmbed = new Discord.MessageEmbed(embed)
  return matchingParty.edit(newEmbed)
}
