
import Discord from 'discord.js'
import { handleReactionError } from '../utils/handleError'
import { changeAlmanaxDetails } from '../commands/alma'
import { getGroupList } from '../utils/getGroupList'
import { scraDropByTypeAndId } from '../scrappers/drop'
import itemsData from '../../data/items.json'
import joinPartyByReaction from './joinParty'
import str from '../stringsLang'
import config from '../config'

const { classEmoji } = config
let messagePool = []

const allowedEmojis = {
  almanax: ['🛡️', '🙏', '🌌', '🍀', '🔎', '🗓️', '🔮'],
  equip: ['💰']
}

/**
 * Check if a emoji is a valid reaction emoji.
 *
 * @param {string[]} emojiList
 * @param {string} emoji
 * @returns {boolean}
 */
function validateEmoji (emojiList, emoji) {
  return emojiList.includes(emoji)
}

/**
 * Get the language used in the message embed.
 *
 * @param {string} levelName
 * @returns {string}
 */
function getLanguageFromEmbed (levelName) {
  return Object.entries(str.level).reduce((lang, [langEntry, nameEntry]) => {
    if (nameEntry === levelName.toLowerCase()) {
      return langEntry
    }
    return lang
  }, 'en')
}

/**
 * Handles messages reactions.
 *
 * @param {object} reaction
 * @param {object} user
 * @returns {object}
 */
export default async function onMessageReactionAdd (reaction, user) {
  try {
    if (user.bot) return

    if (reaction.partial) {
      try {
        await reaction.fetch()
      } catch (error) {
        console.log('Something went wrong when fetching the message: ', error)
        return {}
      }
    }

    const { members, listingGroupId } = await getGroupList(reaction, user)
    if (members && listingGroupId) {
      const className = classEmoji[reaction.emoji.name]
      if (!className) return

      return await joinPartyByReaction(reaction, user, members, listingGroupId, className)
    }

    const messageId = reaction.message.id
    const reactionEmbed = reaction.message.embeds[0] || {}
    const description = reactionEmbed.description || ''
    const isAlmanaxMessage = description.includes('Bonus:')
    const isValidAlmanaxEmoji = validateEmoji(allowedEmojis.almanax, reaction.emoji.name)
    if (isAlmanaxMessage && isValidAlmanaxEmoji && !messagePool.includes(messageId)) {
      messagePool.push(messageId)
      await changeAlmanaxDetails(reaction)
      messagePool = messagePool.filter(id => id !== messageId)
    }

    const title = reactionEmbed.title || ''
    const isEquipMessage = /:(.*?):/.test(title)
    const isValidEquipEmoji = validateEmoji(allowedEmojis.equip, reaction.emoji.name)
    if (isEquipMessage && isValidEquipEmoji) {
      const hasDropField = reactionEmbed.fields.some(field => field.name === 'Drop')
      if (hasDropField) {
        return
      }
      const levelField = reactionEmbed.fields.find(field => !/\D/.test(field.value))
      const levelName = levelField.name || ''
      const lang = getLanguageFromEmbed(levelName)
      const id = reactionEmbed.description.split('ID: ')[1]
      const equip = itemsData.find(item => item.id === Number(id))
      const drops = await scraDropByTypeAndId(id, equip.itemTypeId, lang)
      if (!drops.length) {
        return
      }
      reactionEmbed.fields.push({
        name: 'Drop',
        value: drops.map(drop => `${drop.monster}: ${drop.dropChance}`).join('\n')
      })
      const newEmbed = new Discord.MessageEmbed(reactionEmbed)
      await reaction.message.edit(newEmbed)
    }
  } catch (error) {
    handleReactionError(error, reaction, user)
  }
}
