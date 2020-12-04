import { getChannelParties, getMessageByEmbedNameAndValue } from '../../utils/partyHelper'
import { askAndWait } from '../../utils/message'
import Discord from 'discord.js'

/**
 * Updates a party.
 *
 * @param {object} message
 * @returns {object}
 */
export async function updateParty (message) {
  const partyMessages = await getChannelParties(message)
  if (!partyMessages.size) {
    return message.channel.send({
      embed: {
        color: '#bb1327',
        title: ':x: Error on using party command',
        description: 'No party message has been found on configured party listing channel'
      }
    })
  }

  const options = {}
  const askIdText = 'Oh, you again? First tell me the :label: **ID** from the party you want to update.'
  const { content: id } = await askAndWait(askIdText, message)
  if (!id) return {}

  const matchingParty = getMessageByEmbedNameAndValue(partyMessages, 'ID', id)
  if (!matchingParty) {
    return message.channel.send("Are you sure? I haven't find any party within the last 100 parties.")
  }

  const hasIdOption = Boolean(id)
  if (!hasIdOption) return {}

  const matchingPartyEmbed = matchingParty.embeds[0]
  const partySlots = matchingPartyEmbed.fields.find(field => field.name.includes('Members')).value.split('\n')
  const userPartySlot = partySlots.find(slot => slot.includes(message.author.id))
  if (!userPartySlot) {
    return message.channel.send("Soo.. er.. How can I say this? You are not in this party, I'm sorry")
  }

  const userPartySlotIndex = partySlots.indexOf(userPartySlot)
  const isPartyLeader = userPartySlotIndex === 0
  const hasClassOption = Boolean(options.class)
  if (!isPartyLeader && !hasClassOption) {
    return message.channel.send("You're not this party leader, so try asking them")
  }

  const changeOptions = ['name', 'description', 'date', 'level']
  const changeOptionsText = changeOptions.join(', ')
  const askChangeText = `Cool, I've found the party. What do you want to change? (${changeOptionsText})`
  const { content } = await askAndWait(askChangeText, message)
  if (!content) return {}

  const isValidContent = changeOptions.includes(content)
  if (!isValidContent) {
    return message.channel.send(`Sorry, buddy. But I can only change ${changeOptionsText}`)
  }

  const askNewContent = `Right, so what's the new value for **${content}**?`
  const { content: newContent } = await askAndWait(askNewContent, message)
  if (!newContent) return {}

  if (content === 'name') {
    matchingPartyEmbed.title = newContent ? `Party: ${newContent}` : matchingPartyEmbed.title
  } else if (content === 'description') {
    matchingPartyEmbed.description = newContent
  } else if (content === 'date') {
    matchingPartyEmbed.fields.find(field => field.name.includes('Date')).value = newContent || matchingPartyEmbed.fields.find(field => field.name.includes('Date')).value
  } else if (content === 'level') {
    matchingPartyEmbed.fields.find(field => field.name.includes('Level')).value = newContent || matchingPartyEmbed.fields.find(field => field.name.includes('Level')).value
  }

  if (hasClassOption) {
    partySlots[userPartySlotIndex] = `:small_orange_diamond: <@${message.author.id}> | ${options.class}`
    matchingPartyEmbed.fields.find(field => field.name.includes('Members')).value = partySlots.join('\n')
  }

  const embed = { ...matchingPartyEmbed }
  const newEmbed = new Discord.MessageEmbed(embed)
  message.channel.send(`:sunglasses: All set! Check it out on ${matchingParty.channel.toString()}.`)
  return matchingParty.edit(newEmbed)
}

/**
 * Updates a party using legacy mode to update
 * party classes by reaction.
 * This is to keep compatibility and shall be removed
 * with a refactor on joinParty.js and updateParty function above.
 *
 * @param {object} message
 * @param {object} options
 * @returns {object}
 */
export async function legacyUpdateParty (message, options) {
  const hasIdOption = Boolean(options.id)
  if (!hasIdOption) {
    return
  }

  const partyMessages = await getChannelParties(message)
  if (!partyMessages.size) {
    return
  }

  const matchingParty = getMessageByEmbedNameAndValue(partyMessages, 'ID', options.id)
  if (!matchingParty) {
    return
  }

  const matchingPartyEmbed = matchingParty.embeds[0]
  const partySlots = matchingPartyEmbed.fields.find(field => field.name.includes('Members')).value.split('\n')
  const userPartySlot = partySlots.find(slot => slot.includes(message.author.id))
  if (!userPartySlot) {
    return
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
    return
  }

  if (hasClassOption) {
    partySlots[userPartySlotIndex] = `:small_orange_diamond: <@${message.author.id}> | ${options.class}`
    matchingPartyEmbed.fields.find(field => field.name.includes('Members')).value = partySlots.join('\n')
  }

  const embed = { ...matchingPartyEmbed }
  const newEmbed = new Discord.MessageEmbed(embed)
  return matchingParty.edit(newEmbed)
}
