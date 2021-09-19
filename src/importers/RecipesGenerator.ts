import { saveFile, openFile } from "../utils/files"

export default class RecipesGenerator {
  private rawFolderPath: string
  private generatedFolderPath: string
  private recipesData
  private jobsData
  private ingrediendata
  private jobsItemsData
  private itemsData
  private collectibleResourcesData
  private resuldata

  constructor(rawFolderPath: string, generatedFolderPath: string) {
    this.rawFolderPath = rawFolderPath
    this.generatedFolderPath = generatedFolderPath
    this.recipesData = openFile(`${this.rawFolderPath}/cdn/recipes.json`)
    this.jobsData = openFile(`${this.rawFolderPath}/cdn/recipeCategories.json`)
    this.resuldata = openFile(`${this.rawFolderPath}/cdn/recipeResults.json`)
    this.jobsItemsData = openFile(`${this.rawFolderPath}/cdn/jobsItems.json`)
    this.itemsData = openFile(`${this.rawFolderPath}/cdn/items.json`)
    this.collectibleResourcesData = openFile(`${this.rawFolderPath}/cdn/collectibleResources.json`)
    this.ingrediendata = openFile(`${this.rawFolderPath}/cdn/recipeIngredients.json`)
  }

  public combineAndSaveRecipes () {
    try {
      const mountedRecipes = this.recipesData.map(recipe => {
        const job = this.jobsData.find(job => job.definition.id === recipe.categoryId)
        const namedJob = {
          ...job,
          title: job.title
        }
        const ingredients = this.ingrediendata.filter(ingredient => ingredient.recipeId === recipe.id)
        const namedIngredients = ingredients.map(ingredient => {
          const ingredientId = ingredient.itemId
          const jobItem = this.jobsItemsData.find(jobItem => jobItem.definition.id === ingredientId)
          ingredient.title = jobItem.title
          const item = this.itemsData.find(itemData => itemData.definition.item.id === ingredientId)
          if (item) {
            ingredient.rarity = item.definition.item.baseParameters.rarity
          }
          const collectibleResource = this.collectibleResourcesData.find(resource => resource.collectItemId === ingredientId)
          if (collectibleResource) {
            ingredient.job = collectibleResource.skillId
          } else {
            const resultRecipe = this.resuldata.find(result => result.productedItemId === ingredientId)
            if (resultRecipe) {
              const resultRecipeId = resultRecipe.recipeId
              const resultRecipeData = this.recipesData.find(recipe => recipe.id === resultRecipeId)
              ingredient.job = resultRecipeData.categoryId
            }
          }
          return ingredient
        })
        const result = this.resuldata.find(result => result.recipeId === recipe.id)
        let item = this.itemsData.find(itemData => itemData.definition.item.id === result.productedItemId)
        if (!item) {
          item = this.jobsItemsData.find(jobItem => jobItem.definition.id === result.productedItemId)
        }
        const itemBaseParameters = (item.definition && item.definition.item && item.definition.item.baseParameters) || {}
        const namedResult = {
          ...result,
          title: item.title,
          description: item.description || '',
          rarity: itemBaseParameters.rarity || ''
        }
        return {
          id: recipe.id,
          level: recipe.level,
          xpRatio: recipe.xpRatio,
          isUpgrade: recipe.isUpgrade,
          upgradeItemId: recipe.upgradeItemId,
          job: namedJob,
          ingredients: namedIngredients,
          result: namedResult
        }
      })
      const recipesSortedByRarity = mountedRecipes.sort((recipeA, recipeB) => recipeB.result.rarity - recipeA.result.rarity)
      saveFile(recipesSortedByRarity, `${this.generatedFolderPath}/recipes.json`)
      console.log(`Successfully generated ${recipesSortedByRarity.length} recipes`)
    } catch (error) {
      console.log(error)
    }
  }
}