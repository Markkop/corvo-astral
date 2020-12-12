import ingredientsData from '../../data/raw/cdn/recipeIngredients'
import recipesData from '../../data/raw/cdn/recipes'
import jobsData from '../../data/raw/cdn/recipeCategories'
import resultsData from '../../data/raw/cdn/recipeResults'
import jobsItemsData from '../../data/raw/cdn/jobsItems'
import itemsData from '../../data/raw/cdn/items'
import collectibleResourcesData from '../../data/raw/cdn/collectibleResources'
import { saveFile } from '../utils/files'

/**
 * Combine recipes information to a single file.
 */
export function mountRecipes () {
  try {
    const mountedRecipes = recipesData.map(recipe => {
      const job = jobsData.find(job => job.definition.id === recipe.categoryId)
      const namedJob = {
        ...job,
        title: job.title
      }
      const ingredients = ingredientsData.filter(ingredient => ingredient.recipeId === recipe.id)
      const namedIngredients = ingredients.map(ingredient => {
        const ingredientId = ingredient.itemId
        const jobItem = jobsItemsData.find(jobItem => jobItem.definition.id === ingredientId)
        ingredient.title = jobItem.title
        const item = itemsData.find(itemData => itemData.definition.item.id === ingredientId)
        if (item) {
          ingredient.rarity = item.definition.item.baseParameters.rarity
        }
        const collectibleResource = collectibleResourcesData.find(resource => resource.collectItemId === ingredientId)
        if (collectibleResource) {
          ingredient.job = collectibleResource.skillId
        } else {
          const resultRecipe = resultsData.find(result => result.productedItemId === ingredientId)
          if (resultRecipe) {
            const resultRecipeId = resultRecipe.recipeId
            const resultRecipeData = recipesData.find(recipe => recipe.id === resultRecipeId)
            ingredient.job = resultRecipeData.categoryId
          }
        }
        return ingredient
      })
      const result = resultsData.find(result => result.recipeId === recipe.id)
      let item = itemsData.find(itemData => itemData.definition.item.id === result.productedItemId)
      if (!item) {
        item = jobsItemsData.find(jobItem => jobItem.definition.id === result.productedItemId)
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
    saveFile(recipesSortedByRarity, 'data/generated/recipes.json')
    console.log(`Successfully generated ${recipesSortedByRarity.length} recipes`)
  } catch (error) {
    console.log(error)
  }
}
