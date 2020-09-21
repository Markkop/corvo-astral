import { getPartyChannel, getChannelParties } from '../../utils/partyHelper'
import { mountCommandHelpEmbed } from '../help'
import config from '../../config'
import { handleMessageError } from '../../utils/handleError'
const { classEmoji } = config

/**
 * Create a party message on the parties channel.
 *
 * @param {object} message
 * @param {object} options
 * @returns {object}
 */
export async function createParty (message, options) {
  try {
    const hasRequiredOptions = options.name
    if (!hasRequiredOptions) {
      const helpEmbed = mountCommandHelpEmbed(message, 'en')
      return message.channel.send({ embed: helpEmbed })
    }
    const partyMessages = await getChannelParties(message)
    let identifier = 1
    if (partyMessages.size) {
      const lastPartyMessageSent = partyMessages.first()
      const lastPartyMessageEmbed = lastPartyMessageSent.embeds[0].fields.find(field => field.name.includes('ID'))
      identifier = Number(lastPartyMessageEmbed.value) + 1
    }
    const maxSlots = 50
    const slots = options.slots >= maxSlots ? maxSlots : options.slots
    const memberSlots = Array(Number(slots) || 6).fill(':small_orange_diamond:')
    memberSlots[0] = `:small_orange_diamond: <@${message.author.id}> | `
    const embed = {
      title: `Party: ${options.name}`,
      fields: [
        {
          name: ':label: ID',
          value: String(identifier),
          inline: true
        },
        {
          name: ':calendar_spiral: Date',
          value: options.date || 'To be defined',
          inline: true
        },
        {
          name: ':skull: Level',
          value: options.lvl || '1-215',
          inline: true
        },
        {
          name: ':busts_in_silhouette: Members',
          value: memberSlots.join('\n')
        }
      ],
      footer: {
        text: `Created by ${message.author.username}`
      }
    }

    if (options.desc) {
      embed.description = options.desc
    }

    const partyChannel = getPartyChannel(message)
    const sentMessage = await partyChannel.send({ embed })
    message.react('⏳')
    const classEmojis = Object.keys(classEmoji)
    for (let index = 0; index < classEmojis.length; index++) {
      await sentMessage.react(classEmojis[index])
    }
    message.react('✅')
    return sentMessage
  } catch (error) {
    handleMessageError(error, message)
  }
}
