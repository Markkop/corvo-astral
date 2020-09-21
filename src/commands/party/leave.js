import { getChannelParties, getMessageByEmbedNameAndValue } from '../../utils/partyHelper'
import { mountCommandHelpEmbed } from '../help'
import Discord from 'discord.js'

/**
 * Leaves a party.
 *
 * @param {object} message
 * @param {object} options
 * @returns {object}
 */
export async function leaveParty (message, options) {
  const hasIdOption = Boolean(options.id)
  if (!hasIdOption) {
    const helpEmbed = mountCommandHelpEmbed(message, 'en')
    return message.channel.send({ embed: helpEmbed })
  }

  const partyMessages = await getChannelParties(message)
  if (!partyMessages.size) {
    return message.channel.send({
      embed: {
        color: '#bb1327',
        title: ':x: Error on using party command',
        description: 'No party message has been found on channel "grupos"'
      }
    })
  }

  const matchingParty = getMessageByEmbedNameAndValue(partyMessages, 'ID', options.id)
  if (!matchingParty) {
    return message.channel.send({
      embed: {
        color: '#bb1327',
        title: ':x: Error while leaving party',
        description: 'This ID was not found in the last 100 parties'
      }
    })
  }

  const matchingPartyEmbed = matchingParty.embeds[0]
  const partySlots = matchingPartyEmbed.fields.find(field => field.name.includes('Members')).value.split('\n')
  const userPartySlot = partySlots.find(slot => slot.includes(message.author.id))
  if (!userPartySlot) {
    return message.channel.send({
      embed: {
        color: '#bb1327',
        title: ':x: Error while leaving party',
        description: "You're not in this party :eyes:"
      }
    })
  }

  const userPartySlotIndex = partySlots.indexOf(userPartySlot)
  const newPartySlots = partySlots
  for (let index = userPartySlotIndex; index < partySlots.length; index++) {
    const nextPartySlot = partySlots[index + 1] || ''
    const nextPartySlotIsFullfulled = nextPartySlot.includes('@')
    if (nextPartySlotIsFullfulled) {
      newPartySlots[index] = nextPartySlot
    } else {
      newPartySlots[index] = ':small_orange_diamond:'
    }
  }

  matchingPartyEmbed.fields.find(field => field.name.includes('Members')).value = newPartySlots.join('\n')

  const embed = { ...matchingPartyEmbed }
  const newEmbed = new Discord.MessageEmbed(embed)
  message.react('✅')
  return matchingParty.edit(newEmbed)
}
