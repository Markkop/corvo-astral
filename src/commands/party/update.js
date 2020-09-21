import { getChannelParties, getMessageByEmbedNameAndValue } from '../../utils/partyHelper'
import { mountCommandHelpEmbed } from '../help'
import Discord from 'discord.js'

/**
 * Updates a party.
 *
 * @param {object} message
 * @param {object} options
 * @returns {object}
 */
export async function updateParty (message, options) {
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
        title: ':x: Error while updating party',
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
        title: ':x: Error while updating party',
        description: "You're not in this party :eyes:"
      }
    })
  }

  const userPartySlotIndex = partySlots.indexOf(userPartySlot)
  const isPartyLeader = userPartySlotIndex === 0
  if (isPartyLeader) {
    matchingPartyEmbed.title = options.name ? `Party: ${options.name}` : matchingPartyEmbed.title
    if (options.desc) {
      matchingPartyEmbed.description = options.desc
    }
    matchingPartyEmbed.fields.find(field => field.name.includes('Level')).value = options.lvl || matchingPartyEmbed.fields.find(field => field.name.includes('Level')).value
    matchingPartyEmbed.fields.find(field => field.name.includes('Date')).value = options.date || matchingPartyEmbed.fields.find(field => field.name.includes('Date')).value
  }

  const hasClassOption = Boolean(options.class)
  if (!isPartyLeader && !hasClassOption) {
    return message.channel.send({
      embed: {
        color: '#bb1327',
        title: ':x: Error while updating party',
        description: "You're not the leader =/"
      }
    })
  }

  if (hasClassOption) {
    partySlots[userPartySlotIndex] = `:small_orange_diamond: <@${message.author.id}> | ${options.class}`
    matchingPartyEmbed.fields.find(field => field.name.includes('Members')).value = partySlots.join('\n')
  }

  const embed = { ...matchingPartyEmbed }
  const newEmbed = new Discord.MessageEmbed(embed)
  message.react('✅')
  return matchingParty.edit(newEmbed)
}
