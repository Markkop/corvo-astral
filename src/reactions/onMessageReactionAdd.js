
import Discord from 'discord.js'
import { handleReactionError } from '../utils/handleError'
import { changeAlmanaxDetails } from '../commands/alma'
import { getGroupList } from '../utils/getGroupList'
import { scrapDropByTypeAndId } from '../scrappers/drop'
import { getRecipeFields } from '../commands/recipe'
import recipesData from '../../data/recipes.json'
import itemsData from '../../data/items.json'
import joinPartyByReaction from './joinParty'
import str from '../stringsLang'
import config from '../config'

const { classEmoji } = config
let messagePool = []

const allowedEmojis = {
  almanax: ['🛡️', '🙏', '🌌', '🍀', '🔎', '🗓️', '🔮'],
  equip: ['🛠️', '💰']
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
      await enrichEquipMessage(reaction)
    }
  } catch (error) {
    handleReactionError(error, reaction, user)
  }
}

/**
 * Fills an equipment message with recipe an drop data.
 *
 * @param {object} reaction
 */
async function enrichEquipMessage (reaction) {
  const reactionEmbed = reaction.message.embeds[0] || {}
  const levelField = reactionEmbed.fields.find(field => !/\D/.test(field.value))
  const levelName = levelField.name || ''
  const lang = getLanguageFromEmbed(levelName)
  const id = Number(reactionEmbed.description.split('ID: ')[1])

  if (reaction.emoji.name === '💰') {
    const hasDropField = reactionEmbed.fields.some(field => field.name === 'Drop')
    if (hasDropField) return

    const equip = itemsData.find(item => item.id === id)
    const awaitReaction = await reaction.message.react('⏳')
    const drops = await scrapDropByTypeAndId(id, equip.itemTypeId, lang)
    if (!drops.length) {
      return
    }
    reactionEmbed.fields.push({
      name: 'Drop',
      value: drops.map(drop => `${drop.monster}: ${drop.dropChance}`).join('\n')
    })
    await awaitReaction.remove()
  }

  if (reaction.emoji.name === '🛠️') {
    const hasRecipeField = reactionEmbed.fields.some(field => {
      return Object.values(str.job).some(jobName => jobName === field.name.toLowerCase())
    })
    if (hasRecipeField) return

    const recipes = recipesData.filter(recipe => recipe.result.productedItemId === id)
    if (!recipes.length) return

    const recipeFields = getRecipeFields(recipes, lang)
    reactionEmbed.fields = [
      ...reactionEmbed.fields,
      ...recipeFields
    ]
  }
  const newEmbed = new Discord.MessageEmbed(reactionEmbed)
  await reaction.message.edit(newEmbed)
}
