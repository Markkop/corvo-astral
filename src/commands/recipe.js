import recipesData from '../../data/recipes.json'
import itemsData from '../../data/items.json'
import { mountCommandHelpEmbed } from './help'
import { getArgumentsAndOptions, mountNotFoundEmbed } from '../utils/message'
import { setLanguage, isValidLang } from '../utils/language'
import str from '../stringsLang'
import config from '../config'
const { rarityMap, jobsMap } = config

const itemEmojis = {
  24029: ':droplet:',
  27093: ':sparkles:',
  20605: ':adhesive_bandage:',
  20606: ':adhesive_bandage:',
  21115: ':adhesive_bandage:',
  21116: ':adhesive_bandage:',
  21117: ':adhesive_bandage:',
  21118: ':adhesive_bandage:',
  21119: ':adhesive_bandage:',
  21120: ':adhesive_bandage:',
  21121: ':adhesive_bandage:',
  21122: ':adhesive_bandage:',
  21123: ':adhesive_bandage:',
  21124: ':adhesive_bandage:',
  21125: ':adhesive_bandage:',
  27886: ':adhesive_bandage:'
}

/**
 * Find recipe based on their name with the query provided.
 *
 * @param {object[]} recipeList
 * @param {string} query
 * @param {object} options
 * @param {string} lang
 * @returns {object|object[]}
 */
function findRecipeByName (recipeList, query, options, lang) {
  return recipeList.filter(recipe => {
    const recipeResult = recipe.result
    if (!recipeResult.title) {
      return false
    }
    const matchesName = recipeResult.title[lang].toLowerCase().includes(query)
    let matchesRarity = true
    if (options.rarity && recipeResult.rarity) {
      matchesRarity = rarityMap[recipeResult.rarity].name[lang].toLowerCase().includes(options.rarity)
    }
    const filterAssertion = matchesName && matchesRarity
    return filterAssertion
  })
}

/**
 * Get the text that displays more results.
 *
 * @param {object[]} results
 * @param {number} resultsLimit
 * @param {string} lang
 * @returns {string}
 */
function getMoreRecipesText (results, resultsLimit, lang) {
  const otherRecipes = results.map(recipe => {
    const recipeResultRarity = recipe.result.rarity
    const rarityName = recipeResultRarity ? ` (${rarityMap[recipeResultRarity].name[lang]})` : ''
    return `${recipe.result.title[lang]}${rarityName}`
  })
  if (results.length > resultsLimit) {
    const firstResults = otherRecipes.slice(0, resultsLimit)
    const otherResults = otherRecipes.slice(resultsLimit, otherRecipes.length)
    const moreResultsText = ` ${str.andOther[lang]} ${otherResults.length} ${str.results[lang]}`
    return firstResults.join(', ').trim() + moreResultsText
  }
  return otherRecipes.join(', ').trim()
}

/**
 * Get recipe fields for embed message.
 *
 * @param {object[]} recipeResults
 * @param {string} lang
 * @returns {object[]}
 */
export function getRecipeFields (recipeResults, lang) {
  const firstRecipe = recipeResults[0]
  const recipesWithSameResult = recipeResults.filter(recipe => recipe.result.productedItemId === firstRecipe.result.productedItemId)
  const job = jobsMap[firstRecipe.job.definition.id]
  const jobEmoji = job.emoji
  const jobName = job.title[lang]

  const fields = [
    {
      name: str.capitalize(str.job[lang]),
      value: `${jobEmoji} ${jobName}`,
      inline: true
    },
    {
      name: str.capitalize(str.level[lang]),
      value: firstRecipe.level,
      inline: true
    }
  ]
  recipesWithSameResult.forEach(recipe => {
    const ingredientsText = recipe.ingredients.map(ingredient => {
      const rarityEmoji = ingredient.rarity ? rarityMap[ingredient.rarity].emoji : ''
      const job = jobsMap[ingredient.job] || {}
      const jobEmoji = job.emoji
      const itemEmoji = itemEmojis[ingredient.itemId]
      const ingredientEmoji = rarityEmoji || jobEmoji || itemEmoji || ':white_small_square:'
      const quantity = ingredient.quantity
      const name = ingredient.title[lang]
      const quantityCharacters = `${quantity}x`.split('')
      const quantityText = Array(5).fill(' ')
      quantityText.splice(0, quantityCharacters.length, ...quantityCharacters)
      return `${ingredientEmoji} \`${quantityText.join('')}\` ${name}`
    })
    const orderedByEmojiTexts = ingredientsText.sort((textA, textB) => {
      const textAhasDefaultEmoji = textA.includes(':white_small_square:')
      const textBhasDefaultEmoji = textB.includes(':white_small_square:')
      if (textAhasDefaultEmoji && !textBhasDefaultEmoji) return 1
      if (!textAhasDefaultEmoji && textBhasDefaultEmoji) return -1
      return 0
    })
    fields.push({
      name: str.capitalize(str.ingredients[lang]),
      value: orderedByEmojiTexts.join('\n')
    })
  })
  return fields
}

/**
 * Mount the embed for recipes.
 *
 * @param {object[]} results
 * @param {string} lang
 * @returns {object}
 */
function mountRecipeEmbed (results, lang) {
  const firstRecipe = results[0]
  const recipeResultRarity = firstRecipe.result.rarity
  const equipment = itemsData.find(equip => equip.id === firstRecipe.result.productedItemId)
  const job = jobsMap[firstRecipe.job.definition.id]
  const imageUrl = equipment ? `https://static.ankama.com/wakfu/portal/game/item/115/${equipment.imageId}.png` : job.recipeImage

  const rarityEmoji = recipeResultRarity ? `${rarityMap[recipeResultRarity].emoji} ` : ''
  const embedColor = firstRecipe.result.rarity ? rarityMap[firstRecipe.result.rarity].color : 'LIGHT_GREY'
  const embed = {
    color: embedColor,
    title: `${rarityEmoji}${str.capitalize(str.recipe[lang])}: ${firstRecipe.result.title[lang]}`,
    thumbnail: { url: imageUrl },
    fields: getRecipeFields(results, lang)
  }

  const moreResults = results.filter(recipe => recipe.result.productedItemId !== firstRecipe.result.productedItemId)
  const nonRepatedMoreResults = Array.from(new Set(moreResults.map(recipe => recipe.result.productedItemId))).map(productedItemId => moreResults.find(recipe => recipe.result.productedItemId === productedItemId))

  if (nonRepatedMoreResults.length > 1) {
    const moreRecipesText = getMoreRecipesText(nonRepatedMoreResults, 20, lang)
    embed.footer = {
      text: `${str.capitalize(str.recipesFound[lang])}: ${moreRecipesText}`
    }
  }
  return embed
}

/**
 * Gets a recipe.
 *
 * @param {object} message
 * @returns {Promise<Object>}
 */
export function getRecipe (message) {
  const { args, options } = getArgumentsAndOptions(message, '=')
  const query = args.join(' ').toLowerCase()

  let lang = setLanguage(options, message.guild.id)

  if (!query) {
    const helpEmbed = mountCommandHelpEmbed(message, lang)
    return message.channel.send({ embed: helpEmbed })
  }

  const results = findRecipeByName(recipesData, query, options, lang)
  if (!results.length) {
    const notFoundEmbed = mountNotFoundEmbed(message, lang)
    return message.channel.send({ embed: notFoundEmbed })
  }

  if (isValidLang(options.translate)) {
    lang = options.translate
  }
  const recipeEmbed = mountRecipeEmbed(results, lang)
  return message.channel.send({ embed: recipeEmbed })
}
