import { RecipeItemData } from '@types'
const recipesData = require('../../data/recipes.json')

export default class EquipmentManager {
  private recipes: RecipeItemData[]

  constructor () {
    this.recipes = recipesData
  }

  public getRecipesByProductedItemId (itemId: number): RecipeItemData[] {
    return this.recipes.filter(recipe => recipe.result.productedItemId === itemId)
  }
}
