import { getChannelParties, getMessageByEmbedNameAndValue } from '../../utils/partyChannel'
import { commandsHelp } from '../help'
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
    return message.channel.send({
      embed: {
        color: 'LIGHT_GREY',
        title: ':grey_question: Ajuda: `.party update`',
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

  const matchingPartyEmbed = matchingParty.embeds[0]
  const partySlots = matchingPartyEmbed.fields.find(field => field.name.includes('Participantes')).value.split('\n')
  const userPartySlot = partySlots.find(slot => slot.includes(message.author.id))
  if (!userPartySlot) {
    return message.channel.send({
      embed: {
        color: '#bb1327',
        title: ':x: Erro ao atualizar o grupo',
        description: 'Você não está nesse grupo :eyes:'
      }
    })
  }

  const userPartySlotIndex = partySlots.indexOf(userPartySlot)
  const isPartyLeader = userPartySlotIndex === 0
  if (isPartyLeader) {
    matchingPartyEmbed.title = options.nome ? `Grupo: ${options.nome}` : matchingPartyEmbed.title
    matchingPartyEmbed.fields.find(field => field.name.includes('Nível')).value = options.lvl || matchingPartyEmbed.fields.find(field => field.name.includes('Nível')).value
    matchingPartyEmbed.fields.find(field => field.name.includes('Data')).value = options.data || matchingPartyEmbed.fields.find(field => field.name.includes('Data')).value
  }

  const hasClassOption = Boolean(options.class)
  if (!isPartyLeader && !hasClassOption) {
    return message.channel.send({
      embed: {
        color: '#bb1327',
        title: ':x: Erro ao atualizar o grupo',
        description: 'Você não é o líder =/'
      }
    })
  }

  if (hasClassOption) {
    partySlots[userPartySlotIndex] = `:small_orange_diamond: <@${message.author.id}> | ${options.class}`
    matchingPartyEmbed.fields.find(field => field.name.includes('Participantes')).value = partySlots.join('\n')
  }

  const embed = { ...matchingPartyEmbed }
  const newEmbed = new Discord.MessageEmbed(embed)
  message.react('✅')
  return matchingParty.edit(newEmbed)
}
