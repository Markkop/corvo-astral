import itemsData from '../../data/generated/items.json'
import recipesData from '../../data/generated/recipes.json'
import { mountCommandHelpEmbed } from './help'
import { getArgumentsAndOptions, mountNotFoundEmbed, reactToMessage } from '../utils/message'
import { setLanguage, isValidLang } from '../utils/language'
import { hasTextOrNormalizedTextIncluded } from '../utils/strings'
import { mountUrl } from '../scrappers/drop'
import str from '../stringsLang'
import config from '../config'
const { rarityMap, equipTypesMap } = config

const equipTypesIds = Object.keys(equipTypesMap).map(Number).filter(id => id !== 647) // Remove costumes
const equipmentList = itemsData
  .filter(item => equipTypesIds.includes(item.itemTypeId))
  .sort((itemA, itemB) => itemB.rarity - itemA.rarity)

const iconCodeMap = {
  '[el1]': ':fire:',
  '[el2]': ':droplet:',
  '[el3]': ':herb:',
  '[el4]': ':dash:',
  '[el6]': ':star2:',
  '[HLINE]': ':left_right_arrow:',
  '[VLINE]': ':arrow_up_down:',
  '[CIRCLERING]': ':arrows_counterclockwise:',
  '[*]': ''
}

/**
 * Find a equipment list by matching name.
 *
 * @param {object[]} equipmentList
 * @param {string} query
 * @param {string[]} filters
 * @param {string} lang
 * @returns {object[]}
 */
function findEquipmentByName (equipmentList, query, filters, lang) {
  const hasRarityFilter = Boolean(filters.rarity)
  if (!hasRarityFilter) {
    return equipmentList.filter(equip => hasTextOrNormalizedTextIncluded(equip.title[lang], query))
  }

  return equipmentList.filter(equip => {
    let filterAssertion = true
    const includeQuery = hasTextOrNormalizedTextIncluded(equip.title[lang], query)
    const hasRarity = rarityMap[equip.rarity].name[lang].toLowerCase().includes(filters.rarity)
    filterAssertion = filterAssertion && hasRarity

    return includeQuery && filterAssertion
  })
}

/**
 * Parse a text string converting icon codes to discord emojis.
 *
 * @param {string} text
 * @returns {string}
 */
function parseIconCodeToEmoji (text) {
  return text.split(/(\[.*?\])/).map(word => iconCodeMap[word] || word).join('')
}

/**
 * Get the text that displays more results.
 *
 * @param {object[]} results
 * @param {number} resultsLimit
 * @param {string} lang
 * @returns {string}
 */
function getMoreEquipmentText (results, resultsLimit, lang) {
  let moreResultsText = ''
  if (results.length > resultsLimit) {
    const firstResults = results.slice(0, resultsLimit)
    const otherResults = results.slice(resultsLimit, results.length)
    moreResultsText = ` ${str.andOther[lang]} ${otherResults.length} ${str.results[lang]}`
    results = firstResults
  }
  return results.map(equip => `${equip.title[lang]} (${rarityMap[equip.rarity].name[lang]})`).join(', ').trim() + moreResultsText
}

/**
 * Mount equipment found embed message.
 *
 * @param {object[]} results
 * @param {string} lang
 * @returns {object}
 */
function mountEquipEmbed (results, lang) {
  const firstResult = results[0]
  const equipEmbed = {
    url: mountUrl(firstResult.id, firstResult.itemTypeId, lang),
    color: rarityMap[firstResult.rarity].color,
    title: `${rarityMap[firstResult.rarity].emoji} ${firstResult.title[lang]}`,
    description: `${firstResult.description[lang]}\nID: ${firstResult.id}`,
    thumbnail: { url: `https://static.ankama.com/wakfu/portal/game/item/115/${firstResult.imageId}.png` },
    fields: [
      {
        name: str.capitalize(str.level[lang]),
        value: firstResult.level,
        inline: true
      },
      {
        name: str.capitalize(str.type[lang]),
        value: equipTypesMap[firstResult.itemTypeId][lang],
        inline: true
      },
      {
        name: str.capitalize(str.rarity[lang]),
        value: rarityMap[firstResult.rarity].name[lang],
        inline: true
      }
    ]
  }
  if (firstResult.equipEffects.length) {
    equipEmbed.fields.push({
      name: str.capitalize(str.equipped[lang]),
      value: firstResult.equipEffects.map(effect => parseIconCodeToEmoji(effect.description[lang])).join('\n')
    })
  }
  if (firstResult.useEffects.length) {
    equipEmbed.fields.push({
      name: str.capitalize(str.inUse[lang]),
      value: firstResult.useEffects.map(effect => parseIconCodeToEmoji(effect.description[lang])).join('\n')
    })
  }
  const hasCondititions = Boolean(firstResult.conditions.description[lang])
  if (hasCondititions) {
    equipEmbed.fields.push({
      name: str.capitalize(str.conditions[lang]),
      value: firstResult.conditions.description[lang]
    })
  }
  const equipamentsFoundText = getMoreEquipmentText(results, 20, lang)
  if (results.length > 1) {
    equipEmbed.footer = {
      text: `${str.capitalize(str.equipmentFound[lang])}: ${equipamentsFoundText}`
    }
  }
  return equipEmbed
}

/**
 * Replies the user information about the given equipment.
 *
 * @param { import('discord.js').Message } message - Discord message object.
 * @returns { Promise<object>}.
 */
export async function getEquipment (message) {
  const { args, options } = getArgumentsAndOptions(message, '=')
  const query = args.join(' ').toLowerCase()
  let lang = setLanguage(options, message.guild.id)

  if (!query) {
    const helpEmbed = mountCommandHelpEmbed(message, lang)
    return message.channel.send({ embed: helpEmbed })
  }

  let results = []
  results = findEquipmentByName(equipmentList, query, options, lang)
  if (!results.length) {
    const notFoundEmbed = mountNotFoundEmbed(message, lang)
    return message.channel.send({ embed: notFoundEmbed })
  }

  if (isValidLang(options.translate)) {
    lang = options.translate
  }

  const equipEmbed = mountEquipEmbed(results, lang)
  const sentMessage = await message.channel.send({ embed: equipEmbed })

  const reactions = ['💰']
  const recipes = recipesData.filter(recipe => recipe.result.productedItemId === results[0].id)
  if (recipes.length) {
    reactions.unshift('🛠️')
  }
  await reactToMessage(reactions, sentMessage)
  return sentMessage
}
