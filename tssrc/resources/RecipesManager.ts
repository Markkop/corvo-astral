const recipesData = require('../../data/recipes.json')

export default class EquipmentManager {
  private recipes
  
  constructor() {
    this.recipes = recipesData
  }

  public getRecipesByProductedItemId(itemId) {
    return this.recipes.filter(recipe => recipe.result.productedItemId === itemId)
  }
}