import { FinderCommand } from '@baseCommands'
import { ItemManager, RecipesManager } from '@managers'
import str from '@stringsLang'
import { GuildConfig, PartialEmbed, RecipeItemData } from '@types'
import { Interaction, Message } from 'discord.js'
import mappings from '@utils/mappings'
const { rarityMap, jobsMap, itemEmojis } = mappings
import { SlashCommandBuilder } from '@discordjs/builders'
import { addLangAndTranslateStringOptions, addStringOptionWithRarityChoices } from '@utils/registerCommands'

export const getData = (lang: string) => {
  const builder = new SlashCommandBuilder()
  builder
    .setName('recipe')
    .setDescription(str.recipeCommandDescription[lang])
    .addStringOption(option => option.setName('name').setDescription(str.recipeNameCommandOptionDescription[lang]).setRequired(true))
  addStringOptionWithRarityChoices(builder, 'rarity', str.recipeRarityCommandOptionDescription[lang], lang)
  addLangAndTranslateStringOptions(builder, lang)
  return builder
}

export default class RecipeCommand extends FinderCommand {
  constructor (interaction: Interaction, guildConfig: GuildConfig) {
    super(interaction, guildConfig)
  }

  public async execute (): Promise<void> {
    if (!this.interaction.isCommand()) return
    const lang = this.interaction.options.getString('lang')
    const translate = this.interaction.options.getString('translate')
    const rarity = this.interaction.options.getString('rarity')

    if (lang) {
      this.changeLang(lang)
    }

    const name = this.interaction.options.getString('name')

    const options = {
      rarityId: rarity && this.getRarityIdByRarityNameInAnyLanguage(rarity)
    }

    const results = RecipesManager.findRecipeByName(name, options, this.lang)
    if (!results.length) {
      this.returnNotFound()
      return
    }

    if (translate) {
      this.changeLang(translate)
    }

    const recipeEmbed = this.mountRecipeEmbed(results)
    this.send({ embeds: [recipeEmbed] })
  }

  private mountRecipeEmbed (results: RecipeItemData[]): PartialEmbed {
    const firstRecipe = results[0]
    const equipment = ItemManager.getItemById(firstRecipe.result.productedItemId)
    const job = jobsMap[firstRecipe.job.definition.id]
    const imageUrl = equipment ? `https://static.ankama.com/wakfu/portal/game/item/115/${equipment.imageId}.png` : job.recipeImage
    
    const recipeResultRarity = firstRecipe.result.rarity
    const rarityEmoji = recipeResultRarity ? `${rarityMap[recipeResultRarity].emoji} ` : ''
    const embedColor = firstRecipe.result.rarity ? rarityMap[firstRecipe.result.rarity].color : 0xBCC0C0
    const embed: PartialEmbed = {
      color: embedColor,
      title: `${rarityEmoji}${str.capitalize(str.recipe[this.lang])}: ${firstRecipe.result.title[this.lang]}`,
      thumbnail: { url: imageUrl },
      fields: RecipesManager.getRecipeFields(results, this.lang)
    }
  
    const moreResults = results.filter(recipe => recipe.result.productedItemId !== firstRecipe.result.productedItemId)
    const nonRepatedMoreResults = Array.from(new Set(moreResults.map(recipe => recipe.result.productedItemId))).map(productedItemId => moreResults.find(recipe => recipe.result.productedItemId === productedItemId))
  
    if (nonRepatedMoreResults.length > 1) {
      const moreRecipesText = this.getMoreRecipesText(nonRepatedMoreResults, 20, this.lang)
      embed.footer = {
        text: `${str.capitalize(str.recipesFound[this.lang])}: ${moreRecipesText}`
      }
    }
    return embed
  }

  private getMoreRecipesText (results, resultsLimit, lang) {
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
}
