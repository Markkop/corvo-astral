import { getChannelParties, getMessageByEmbedNameAndValue } from '../../utils/partyChannel'
import { commandsHelp } from '../help'
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
    return message.channel.send({
      embed: {
        color: 'LIGHT_GREY',
        title: ':grey_question: Ajuda: `.party join`',
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
        title: ':x: Erro ao atualizar o grupo',
        description: 'Nenhum dos últimos 100 grupos encontrado com esse id'
      }
    })
  }
  const partySlots = matchingParty.embeds[0].fields.find(field => field.name.includes('Participantes')).value.split('\n')
  const userPartySlot = partySlots.find(slot => slot.includes(message.author.id))
  if (userPartySlot) {
    return message.channel.send({
      embed: {
        color: '#bb1327',
        title: ':x: Erro ao entrar no grupo',
        description: 'Você já está nele. Talvez queira dar um `.party update`?'
      }
    })
  }

  const freeSlot = partySlots.find(slot => !slot.includes('@'))
  const freeSlotIndex = partySlots.indexOf(freeSlot)
  if (freeSlotIndex < 0) {
    return message.channel.send({
      embed: {
        color: '#bb1327',
        title: ':x: Nenhuma vaga disponível',
        description: 'Parece que você ficou de fora :c'
      }
    })
  }
  partySlots[freeSlotIndex] = `:small_orange_diamond: <@${message.author.id}> | ${options.class}`
  const newPartySlots = partySlots.join('\n')
  const embedFields = matchingParty.embeds[0].fields.filter(field => !field.name.includes('Participantes'))
  const embed = {
    ...matchingParty.embeds[0],
    fields: [
      ...embedFields,
      {
        name: ':busts_in_silhouette: Participantes',
        value: newPartySlots
      }
    ]
  }
  const newEmbed = new Discord.MessageEmbed(embed)
  message.react('✅')
  return matchingParty.edit(newEmbed)
}
