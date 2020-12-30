import { mountCommandHelpEmbed } from './help'
import { getRecipeFields } from './recipe'
import recipesData from '../../data/generated/recipes.json'
import itemsData from '../../data/generated/items.json'
import { mountUrl } from '../scrappers/drop'
import findPermutations from '../utils/permutateString'
import { getArgumentsAndOptions, mountNotFoundEmbed } from '../utils/message'
import { setLanguage, isValidLang } from '../utils/language'
import str from '../stringsLang'
import config from '../config'
const { rarityMap } = config

const sublimations = itemsData.filter(item => Boolean(item.sublimation))

/**
 * Parses slot combination string to emojis strings.
 *
 * @param {string} slots
 * @returns {string} Emojis.
 */
function parseSlotsToEmojis (slots) {
  const emojiMap = {
    g: ':green_square:',
    b: ':blue_square:',
    r: ':red_square:',
    w: ':white_large_square:'
  }
  return Array.from(slots.toLowerCase()).map(letter => emojiMap[letter]).join(' ')
}

/**
 * Find sublimation based on their name with the query provided.
 *
 * @param {object[]} sublimationList
 * @param {string} query
 * @param {string} lang
 * @returns {object|object[]}
 */
function findSublimationByName (sublimationList, query, lang) {
  query = query.replace(/2|ll/g, 'ii').replace(/3|lll/g, 'iii')
  return sublimationList.filter(subli => subli.title[lang].toLowerCase().includes(query))
}

/**
 * Find sublimation based on their source with the query provided.
 *
 * @param {object[]} sublimationList
 * @param {string} query
 * @param {string} lang
 * @returns {object|object[]}
 */
function findSublimationBySource (sublimationList, query, lang) {
  return sublimationList.filter(subli => subli.sublimation.source[lang].toLowerCase().includes(query))
}

/**
 * Find sublimation based on matching slots with the query provided.
 *
 * @param {object[]} sublimationList
 * @param {string} query
 * @returns {object|object[]}
 */
function findSublimationByMatchingSlots (sublimationList, query) {
  const isFourSlotsCombination = query.length === 4 && query !== 'epic'
  const regexQuery = new RegExp(query.replace(/w/g, '[r|g|b]{1}'))
  if (isFourSlotsCombination) {
    const firstCombination = query.slice(0, 3)
    const secondCombination = query.slice(1, 4)
    const firstCombinationRegex = new RegExp(firstCombination.replace(/w/g, '[r|g|b]{1}'))
    const secondCombinationRegex = new RegExp(secondCombination.replace(/w/g, '[r|g|b]{1}'))
    const firstCombinationResults = sublimationList.filter(subli => firstCombinationRegex.test(subli.sublimation.slots.toLowerCase()))
    const secondCombinationResults = sublimationList.filter(subli => {
      const isRepeated = firstCombinationResults.includes(subli)
      const matchesCombination = secondCombinationRegex.test(subli.sublimation.slots.toLowerCase())
      return matchesCombination && !isRepeated
    })
    return [...firstCombinationResults, ...secondCombinationResults]
  }
  return sublimationList.filter(subli => regexQuery.test(subli.sublimation.slots.toLowerCase()))
}

/**
 * Created the embed message with the sublimations found and a footer list.
 *
 * @param {object[]} results
 * @param {string} lang
 * @returns {object}
 */
function mountSublimationFoundEmbed (results, lang) {
  const firstResult = results[0]
  const sublimation = firstResult.sublimation
  const isEpicOrRelic = /epic|relic/.test(sublimation.slots)
  const sublimationRarity = sublimation.slots === 'epic' ? 7 : 5
  const icon = isEpicOrRelic ? ':gem:' : ':scroll:'
  const embedColor = isEpicOrRelic ? rarityMap[sublimationRarity].color : rarityMap[3].color
  const maxStack = firstResult.description[lang].replace(/\D/g, '')
  const sublimationEmbed = {
    url: mountUrl(firstResult.id, firstResult.itemTypeId, lang),
    color: embedColor,
    title: `${icon} ${firstResult.title[lang]}`,
    thumbnail: { url: `https://static.ankama.com/wakfu/portal/game/item/115/${firstResult.imageId}.png` },
    fields: [
      {
        name: str.capitalize(str.slots[lang]),
        value: isEpicOrRelic ? rarityMap[sublimationRarity].name[lang] : parseSlotsToEmojis(sublimation.slots),
        inline: true
      },
      {
        name: str.capitalize(str.maxStacks[lang]),
        value: maxStack || '1',
        inline: true
      }
    ]
  }

  const effects = sublimation.effects[lang] || sublimation.effects.en
  if (effects) {
    sublimationEmbed.fields.push({
      name: str.capitalize(str.effects[lang]),
      value: effects
    })
  }

  const source = sublimation.source[lang] || sublimation.source.en
  if (source) {
    sublimationEmbed.fields.push({
      name: str.capitalize(str.acquiring[lang]),
      value: source.trim()
    })
  }

  const recipes = recipesData.filter(recipe => recipe.result.productedItemId === firstResult.id)
  if (recipes.length) {
    const recipeFields = getRecipeFields(recipes, lang)
    sublimationEmbed.fields = [
      ...sublimationEmbed.fields,
      ...recipeFields
    ]
  }
  const hasFoundMoreThanOne = results.length > 1
  if (hasFoundMoreThanOne) {
    sublimationEmbed.footer = {
      text: `${str.capitalize(str.sublimationsFound[lang])}: ${getSublimationListText(results, lang)}`
    }
  }
  return sublimationEmbed
}

/**
 * Created the embed message with sublimations found list.
 *
 * @param {object[]} results
 * @param {string} queriedSlotsText
 * @param {string} lang
 * @returns {object}
 */
function mountSublimationsFoundListEmbed (results, queriedSlotsText, lang) {
  return {
    title: `:mag_right: ${str.capitalize(str.sublimationsFound[lang])}`,
    fields: [
      {
        name: str.capitalize(str.query[lang]),
        value: queriedSlotsText,
        inline: true
      },
      {
        name: str.capitalize(str.results[lang]),
        value: results.length,
        inline: true
      },
      {
        name: str.capitalize(str.sublimations[lang]),
        value: getSublimationListText(results, lang)
      }
    ]
  }
}

/**
 * Created the embed message with sublimations found list.
 *
 * @param {object[]} results
 * @param {string} queriedSlotsText
 * @param {string} lang
 * @returns {object}
 */
function mountPermutatedSublimationFoundEmbed (results, queriedSlotsText, lang) {
  const totalResults = results.reduce((totalResults, permutatedResult) => {
    return totalResults + permutatedResult.results.length
  }, 0)
  const embed = {
    title: `:mag_right: ${str.capitalize(str.sublimationsFound[lang])}`,
    fields: [
      {
        name: str.capitalize(str.query[lang]),
        value: `${parseSlotsToEmojis(queriedSlotsText)} ${str.inAnyOrder[lang]}`,
        inline: true
      },
      {
        name: str.capitalize(str.results[lang]),
        value: totalResults,
        inline: true
      }
    ]
  }
  results.forEach(permutatedResult => {
    const slotsAsEmojis = parseSlotsToEmojis(permutatedResult.slots)
    const namedResults = getSublimationListText(permutatedResult.results, lang)
    const resultsLength = permutatedResult.results.length
    embed.fields.push({
      name: `${slotsAsEmojis} (${resultsLength})`,
      value: namedResults
    })
  })
  return embed
}

/**
 * Find sublimations using some strategies.
 *
 * @param {object[]} sublimations
 * @param {string} query
 * @param {boolean} hasAnyOrderArgument
 * @param {string} lang
 * @returns {object}
 */
function findSublimations (sublimations, query, hasAnyOrderArgument, lang) {
  const isSearchBySlot = /[rgbw][rgbw][rgbw]?[rgbw]|epic|relic/.test(query)
  let results = []
  let foundBy = ''

  if (isSearchBySlot && hasAnyOrderArgument) {
    const queryPermutation = findPermutations(query)
    queryPermutation.forEach((queryPerm) => {
      const permutatedResults = findSublimationByMatchingSlots(sublimations, queryPerm)
      results.push({
        slots: queryPerm,
        results: permutatedResults
      })
    })

    return { results, foundBy: 'permutatedSlots' }
  }

  if (isSearchBySlot) {
    results = findSublimationByMatchingSlots(sublimations, query)
    foundBy = 'slots'
    return { results, foundBy }
  }

  results = findSublimationByName(sublimations, query, lang)
  foundBy = 'name'

  if (results.length) {
    return { results, foundBy }
  }

  results = findSublimationBySource(sublimations, query, lang)
  foundBy = 'source'
  return { results, foundBy }
}

/**
 * Join all sublimation names.
 *
 * @param {object[]} results
 * @param {string} lang
 * @returns {string}
 */
function getSublimationListText (results, lang) {
  return results.map(subli => subli.title[lang]).join(', ').trim()
}

/**
 * Find a matching equivalent query from epic and relic sublimation rarities.
 *
 * @param {string} query
 * @returns {string}
 */
function findEquivalentQuery (query) {
  const epicNames = rarityMap[7].name
  const relicNames = rarityMap[5].name
  return [epicNames, relicNames].reduce((equivalentQuery, names) => {
    const eq = Object.keys(names).find(key => names[key].toLowerCase() === query)
    return eq ? names.en.toLowerCase() : equivalentQuery
  }, '')
}

/**
 * Replies the user information about the given sublimation.
 *
 * @param { import('discord.js').Message } message - Discord message object.
 * @returns {Promise<object>}
 */
export function getSublimation (message) {
  const anyOrderArgument = 'random'
  const { args, options } = getArgumentsAndOptions(message, '=')

  let lang = setLanguage(options, message.guild.id)

  const hasAnyOrderArgument = args.includes(anyOrderArgument)
  if (hasAnyOrderArgument) {
    const anyOrderIndex = args.indexOf(anyOrderArgument)
    args.splice(anyOrderIndex, 1)
  }
  const normalizedQuery = args.join(' ').toLowerCase()
  const equivalentQuery = findEquivalentQuery(normalizedQuery)
  if (!normalizedQuery) {
    const helpEmbed = mountCommandHelpEmbed(message, lang)
    return message.channel.send({ embed: helpEmbed })
  }
  const query = equivalentQuery || normalizedQuery
  const { results, foundBy } = findSublimations(sublimations, query, hasAnyOrderArgument, lang)
  if (!results.length) {
    const notFoundEmbed = mountNotFoundEmbed(message, lang)
    return message.channel.send({ embed: notFoundEmbed })
  }

  const isEpicOrRelic = /epic|relic/.test(query)
  const queriedSlotsText = foundBy === 'slots' && !isEpicOrRelic ? parseSlotsToEmojis(query) : query

  if (foundBy === 'permutatedSlots') {
    const permutatedSublimationFoundEmbed = mountPermutatedSublimationFoundEmbed(results, queriedSlotsText, lang)
    return message.channel.send({ embed: permutatedSublimationFoundEmbed })
  }

  if (isValidLang(options.translate)) {
    lang = options.translate
  }
  if (foundBy === 'name') {
    const sublimationFoundEmbed = mountSublimationFoundEmbed(results, lang)
    return message.channel.send({ embed: sublimationFoundEmbed })
  }

  const sublimationsFoundListEmbed = mountSublimationsFoundListEmbed(results, queriedSlotsText, lang)
  return message.channel.send({ embed: sublimationsFoundListEmbed })
}
