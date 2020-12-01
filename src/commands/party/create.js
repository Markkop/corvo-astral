import { getPartyChannel, getChannelParties } from '../../utils/partyHelper'
import { askAndWait } from '../../utils/message'
import config from '../../config'
import { handleMessageError } from '../../utils/handleError'
import { Message } from 'discord.js'
const { classEmoji } = config

/**
 * Get options by user input.
 *
 * @param { Message } message
 * @returns {object} Options.
 */
async function askOptions (message) {
  const askNameText = ':label: Hey! Tell me the **title** you want for the group that will be listed.'
  const { content: name } = await askAndWait(askNameText, message)
  if (!name) return {}

  if (name === 'skip') {
    message.channel.send('Nice try, but I really need a title.')
    return {}
  }
  const askDescriptionText = ':speech_balloon: Cool. Any **description**? (this and the following answers are skippable by answering `skip`)'
  const { content: description } = await askAndWait(askDescriptionText, message)
  if (!description) return {}

  const askDateText = ':calendar: Ok then. **When** it will be?'
  const { content: date } = await askAndWait(askDateText, message)
  if (!date) return {}

  const askLevelText = ':skull: Which **level** or **level range** players will need to be to join it?'
  const { content: level } = await askAndWait(askLevelText, message)
  if (!level) return {}

  const askSlotsText = ':small_orange_diamond: How many **slots** the party will have including you?'
  let { content: slots } = await askAndWait(askSlotsText, message)
  if (!slots) return {}

  slots = Number(slots)
  if (Number.isNaN(slots)) {
    slots = ''
  }

  return {
    name,
    description,
    date,
    level,
    slots
  }
}

/**
 * Check if a given string has the text 'skip'.
 *
 * @param {string} text
 * @returns {boolean}
 */
function isSkip (text) {
  return text === 'skip'
}

/**
 * Create a party message on the parties channel.
 *
 * @param {object} message
 * @returns {object}
 */
export async function createParty (message) {
  try {
    const options = await askOptions(message)
    if (!options.name) {
      return
    }

    const partyMessages = await getChannelParties(message)
    let identifier = 1
    if (partyMessages.size) {
      const lastPartyMessageSent = partyMessages.first()
      const lastPartyMessageEmbed = lastPartyMessageSent.embeds[0].fields.find(field => field.name.includes('ID'))
      identifier = Number(lastPartyMessageEmbed.value) + 1
    }
    const maxSlots = 50
    let slots = 6
    if (!isSkip(options.slots)) {
      slots = (options.slots >= maxSlots) ? maxSlots : options.slots
    }
    const memberSlots = Array(slots).fill(':small_orange_diamond:')
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
          value: isSkip(options.date) ? 'To be defined' : options.date,
          inline: true
        },
        {
          name: ':skull: Level',
          value: isSkip(options.level) ? '1-215' : options.level,
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

    if (options.description) {
      embed.description = options.description
    }

    const partyChannel = getPartyChannel(message)
    const sentMessage = await partyChannel.send({ embed })
    message.react('⏳')
    message.channel.send(`:sunglasses: Your party has been listed on ${partyChannel.toString()}. Check it out!`)
    const classEmojis = Object.keys(classEmoji)
    for (let index = 0; index < classEmojis.length; index++) {
      await sentMessage.react(classEmojis[index])
    }
    message.react('✅')
    return sentMessage
  } catch (error) {
    message.send.channel('Dang, something went very wrong. Try asking for help. Anyone?')
    handleMessageError(error, message)
  }
}
