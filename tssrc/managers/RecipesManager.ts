import { RecipeItemData } from '@types'
import mappings from '@utils/mappings'
const { equipTypesMap, rarityMap } = mappings
const recipesData = require('../../data/recipes.json')
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
      if (options.rarity && recipeResult.rarity) {
        matchesRarity = rarityMap[recipeResult.rarity].name[lang].toLowerCase().includes(options.rarity)
      }
      const filterAssertion = matchesName && matchesRarity
      return filterAssertion
    })
  }
}

const recipesManager = new RecipesManager()
export default recipesManager
