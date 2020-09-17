import recipesData from '../../data/recipes.json'
import equipmentData from '../../data/equipment.json'
import { mountCommandHelpEmbed } from './help'
import { getArgumentsAndOptions } from '../utils/message'
import config from '../config'
const { rarityMap, jobEmojis } = config

/**
 * Find recipe based on their name with the query provided.
 *
 * @param {object[]} recipeList
 * @param {string} query
 * @param {object} options
 * @returns {object|object[]}
 */
function findRecipeByName (recipeList, query, options) {
  return recipeList.filter(recipe => {
    const recipeResult = recipe.result
    if (!recipeResult.title) {
      return false
    }
    const matchesName = recipeResult.title.pt.toLowerCase().includes(query)
    let matchesRarity = true
    if (options.raridade && recipeResult.rarity) {
      matchesRarity = rarityMap[recipeResult.rarity].name.toLowerCase().includes(options.raridade)
    }
    const filterAssertion = matchesName && matchesRarity
    return filterAssertion
  })
}

/**
 * Created the embed message with the a recipe not found.
 *
 * @returns {object}
 */
function mountNotFoundEmbed () {
  return {
    color: '#bb1327',
    title: ':x: Nenhuma receita encontrada',
    description: 'Digite `.help recipe` para conferir alguns exemplos de como pesquisar.'
  }
}

/**
 * Mount the embed for recipes.
 *
 * @param {object[]} results
 * @returns {object}
 */
function mountRecipeEmbed (results) {
  const firstRecipe = results[0]
  const recipeResultRarity = firstRecipe.result.rarity
  const equipment = equipmentData.find(equip => equip.id === firstRecipe.result.productedItemId)
  const imageUrl = equipment ? `https://builder.methodwakfu.com/assets/icons/items/${equipment.img}.webp` : 'https://static.ankama.com/wakfu/portal/game/item/115/71919456.png'
  const recipesWithSameResult = results.filter(recipe => recipe.result.productedItemId === firstRecipe.result.productedItemId)

  const rarityEmoji = recipeResultRarity ? `${rarityMap[recipeResultRarity].emoji} ` : ''
  const embedColor = firstRecipe.result.rarity ? rarityMap[firstRecipe.result.rarity].color : 'LIGHT_GREY'
  const embed = {
    color: embedColor,
    title: `${rarityEmoji}Receita de ${firstRecipe.result.title.pt}`,
    thumbnail: { url: imageUrl },
    fields: [
      {
        name: ':tools: Profissão',
        value: firstRecipe.job.title.pt,
        inline: true
      },
      {
        name: ':mortar_board: Nível',
        value: firstRecipe.level,
        inline: true
      }
    ]
  }
  recipesWithSameResult.forEach(recipe => {
    const ingredientsText = recipe.ingredients.reduce((ingredientsText, ingredient) => {
      const rarityEmoji = ingredient.rarity ? rarityMap[ingredient.rarity].emoji : ''
      const jobEmoji = jobEmojis[ingredient.job]
      const ingredientEmoji = rarityEmoji || jobEmoji || ':white_small_square:'
      const quantity = ingredient.quantity
      const name = ingredient.title.pt
      const text = `${ingredientEmoji} ${quantity}x ${name}`
      return `${text}\n${ingredientsText}`
    }, '')
    embed.fields.push({
      name: 'Ingredientes',
      value: ingredientsText.trim()
    })
  })

  const moreResults = results.filter(recipe => recipe.result.productedItemId !== firstRecipe.result.productedItemId)
  const nonRepatedMoreResults = Array.from(new Set(moreResults.map(recipe => recipe.result.productedItemId))).map(productedItemId => moreResults.find(recipe => recipe.result.productedItemId === productedItemId))

  if (nonRepatedMoreResults.length > 1) {
    const otherRecipes = nonRepatedMoreResults.map(recipe => {
      const recipeResultRarity = recipe.result.rarity
      const rarityEmoji = recipeResultRarity ? `${rarityMap[recipeResultRarity].emoji} ` : ''
      return `${rarityEmoji}${recipe.result.title.pt}`
    })
    embed.footer = {
      text: otherRecipes.join(', ')
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
  if (!query) {
    const helpEmbed = mountCommandHelpEmbed(message)
    return message.channel.send({ embed: helpEmbed })
  }

  const results = findRecipeByName(recipesData, query, options)
  if (!results.length) {
    const notFoundEmbed = mountNotFoundEmbed()
    return message.channel.send({ embed: notFoundEmbed })
  }

  const recipeEmbed = mountRecipeEmbed(results)
  return message.channel.send({ embed: recipeEmbed })
}
