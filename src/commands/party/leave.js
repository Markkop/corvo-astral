import { getChannelParties, getMessageByEmbedNameAndValue } from '../../utils/partyChannel'
import { commandsHelp } from '../help'
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
    return message.channel.send({
      embed: {
        color: 'LIGHT_GREY',
        title: ':grey_question: Ajuda: `.party leave`',
        description: commandsHelp.party
      }
    })
  }

  const partyMessages = await getChannelParties(message)
  if (!partyMessages.size) {
    return message.channel.send({
      embed: {
        color: '#bb1327',
        title: ':x: Erro ao usar o comando party',
        description: 'Não foi encontrada nenhuma mensagem de grupo no canal "grupos"'
      }
    })
  }

  const matchingParty = getMessageByEmbedNameAndValue(partyMessages, 'ID', options.id)
  if (!matchingParty) {
    return message.channel.send({
      embed: {
        color: '#bb1327',
        title: ':x: Erro ao sair o grupo',
        description: 'Nenhum dos últimos 100 grupos encontrado com esse id'
      }
    })
  }

  const matchingPartyEmbed = matchingParty.embeds[0]
  const partySlots = matchingPartyEmbed.fields.find(field => field.name.includes('Participantes')).value.split('\n')
  const userPartySlot = partySlots.find(slot => slot.includes(message.author.id))
  if (!userPartySlot) {
    return message.channel.send({
      embed: {
        color: '#bb1327',
        title: ':x: Erro ao sair o grupo',
        description: 'Você não está nesse grupo :eyes:'
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

  matchingPartyEmbed.fields.find(field => field.name.includes('Participantes')).value = newPartySlots.join('\n')

  const embed = { ...matchingPartyEmbed }
  const newEmbed = new Discord.MessageEmbed(embed)
  message.react('✅')
  return matchingParty.edit(newEmbed)
}
