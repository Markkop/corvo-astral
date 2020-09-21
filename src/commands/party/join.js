import { getChannelParties, getMessageByEmbedNameAndValue } from '../../utils/partyHelper'
import { mountCommandHelpEmbed } from '../help'
import Discord from 'discord.js'

/**
 * Join a party.
 *
 * @param {object} message
 * @param {object} options
 * @returns {object}
 */
export async function joinParty (message, options) {
  const hasRequiredOptions = Boolean(options.class)
  if (!hasRequiredOptions) {
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
  const partySlots = matchingParty.embeds[0].fields.find(field => field.name.includes('Members')).value.split('\n')
  const userPartySlot = partySlots.find(slot => slot.includes(message.author.id))
  if (userPartySlot) {
    return message.channel.send({
      embed: {
        color: '#bb1327',
        title: ':x: Error while joining group',
        description: 'You are already in it. Maybe you want to `.party update`?'
      }
    })
  }

  const freeSlot = partySlots.find(slot => !slot.includes('@'))
  const freeSlotIndex = partySlots.indexOf(freeSlot)
  if (freeSlotIndex < 0) {
    return message.channel.send({
      embed: {
        color: '#bb1327',
        title: ':x: No slot available',
        description: "It seems you're out :c"
      }
    })
  }
  partySlots[freeSlotIndex] = `:small_orange_diamond: <@${message.author.id}> | ${options.class}`
  const newPartySlots = partySlots.join('\n')
  const embedFields = matchingParty.embeds[0].fields.filter(field => !field.name.includes('Members'))
  const embed = {
    ...matchingParty.embeds[0],
    fields: [
      ...embedFields,
      {
        name: ':busts_in_silhouette: Members',
        value: newPartySlots
      }
    ]
  }
  const newEmbed = new Discord.MessageEmbed(embed)
  message.react('✅')
  return matchingParty.edit(newEmbed)
}
