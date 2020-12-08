import Discord from 'discord.js'
import { handleReactionError } from '../utils/handleError'
import { changeAlmanaxDetails } from '../commands/alma'
import { getGroupList } from '../utils/getGroupList'
import { scrapDropByTypeAndId } from '../scrappers/drop'
import { getRecipeFields } from '../commands/recipe'
import { guessLanguage } from '../utils/language'
import recipesData from '../../data/recipes.json'
import itemsData from '../../data/items.json'
import joinPartyByReaction from './joinParty'
import getMonster from './getMonster'
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
    if (isAlmanaxMessage && isValidAlmanaxEmoji) {
      await lockMessage(messageId, () => changeAlmanaxDetails(reaction))
    }

    const title = reactionEmbed.title || ''
    const isEquipMessage = /:(.*?):/.test(title)
    const isValidEquipEmoji = validateEmoji(allowedEmojis.equip, reaction.emoji.name)
    if (isEquipMessage && isValidEquipEmoji) {
      await lockMessage(messageId, () => enrichEquipMessage(reaction))
    }

    const validMonsterSearchMessageTitles = Object.values(str.monstersFound)
    const isMonsterSearchMessage = validMonsterSearchMessageTitles.some(validTitle => title.includes(validTitle))
    const isValidMonsterSearchEmoji = description.includes(reaction.emoji.name)
    if (isMonsterSearchMessage && isValidMonsterSearchEmoji) {
      await lockMessage(messageId, () => getMonster(reaction))
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
  const lang = guessLanguage(levelName, str.level)
  const id = Number(reactionEmbed.description.split('ID: ')[1])

  if (reaction.emoji.name === '💰') {
    const hasDropField = reactionEmbed.fields.some(field => field.name === 'Drop')
    if (hasDropField) return

    const equip = itemsData.find(item => item.id === id)
    const awaitReaction = await reaction.message.react('⏳')
    const drops = await scrapDropByTypeAndId(id, equip.itemTypeId, lang)
    await awaitReaction.remove()
    reactionEmbed.fields.push({
      name: 'Drop',
      value: drops.length ? drops.map(drop => `${drop.monster}: ${drop.dropChance}`).join('\n') : '---'
    })
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

/**
 * Locks a message to not trigger processes from reactions.
 *
 * @param {string} messageId
 * @param {Function} unlockedFunction
 */
async function lockMessage (messageId, unlockedFunction) {
  if (messagePool.includes(messageId)) {
    return
  }
  messagePool.push(messageId)
  await unlockedFunction()
  messagePool = messagePool.filter(id => id !== messageId)
}
