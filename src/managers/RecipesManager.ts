import { RecipeItemData } from '@types'
import str from '@stringsLang'
import { MessageManager } from '@managers'
import mappings from '@utils/mappings'
const { rarityMap, jobsMap, itemEmojis } = mappings
const recipesData = require('../../data/generated/recipes.json')
class RecipesManager {
  private recipes: RecipeItemData[]

  constructor () {
    this.recipes = recipesData
  }

  public getRecipesByProductedItemId (itemId: number): RecipeItemData[] {
    return this.recipes.filter(recipe => recipe.result.productedItemId === itemId)
  }

  public findRecipeByName (query, options, lang) {
    return this.recipes.filter(recipe => {
      const recipeResult = recipe.result
      if (!recipeResult.title) {
        return false
      }
      const matchesName = recipeResult.title[lang].toLowerCase().includes(query)
      let matchesRarity = true
      if (options.rarityId && recipeResult.rarity) {
        matchesRarity = options.rarityId === recipeResult.rarity
      }
      const filterAssertion = matchesName && matchesRarity
      return filterAssertion
    })
  }

  public getRecipeFields (recipeResults, lang) {
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
        value: String(firstRecipe.level),
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
        const quantityText = `${quantity}x`
        const quantityCodeText = MessageManager.convertToCodeBlock(quantityText, 5)
        return `${ingredientEmoji} ${quantityCodeText} ${name}`
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
        value: orderedByEmojiTexts.join('\n'),
        inline: false
      })
    })
    return fields
  }
}

const recipesManager = new RecipesManager()
export default recipesManager
