import { MessageEmbed } from 'discord.js'

export type LanguageStrings = {
  en: string
  pt: string
  fr: string
  es: string
}
export interface GuildConfig {
  id: string
  lang: string
  prefix: string
  almanaxChannel: string
  partyChannel: string
  buildPreview: string
}

export type DefaultGuildConfig = {
  lang: string
  prefix: string
  almanaxChannel: string
  partyChannel: string
  buildPreview: string
}

export type Language = 'pt' | 'en' | 'es' | 'fr'

export type AlmanaxBonus = {
  firstDate: string
  name: LanguageStrings
  text: LanguageStrings
  images: string[]
}

export type PartialEmbed = Partial<MessageEmbed>

export type ItemEffectDefinition = {
  id: number,
  actionId: number,
  areaShape: number,
  areaSize: number[]
  params: number[]
}

export type ItemUseParameters = {
  useCostAp: number
  useCostMp: number
  useCostWp: number
}

export type ItemConditions = {
  description: LanguageStrings,
  criteria: LanguageStrings
}

export type ItemEffect = {
  definition: ItemEffectDefinition,
  description: LanguageStrings
}

export type SublimationSource = {
  chest: LanguageStrings
  drop: LanguageStrings
  steles: number
  quest: LanguageStrings
}

export type Sublimation = {
  effects: LanguageStrings
  source: LanguageStrings,
  slots: string
}

export type ItemData = {
  id: number,
  title: LanguageStrings,
  description: LanguageStrings,
  level: number,
  useEffects: ItemEffect[],
  equipEffects: ItemEffect[]
  useParameters: ItemUseParameters,
  imageId: number,
  itemTypeId: number
  itemSetId: number
  rarity: number
  conditions: ItemConditions,
  sublimation?: Sublimation
}

export type JobDefintion = {
  id: number
  isArchive: boolean
  isNoCraft: boolean
  isHidden: boolean
  xpFactor: number
  isInnate: boolean
}

export type Job = {
  definition: JobDefintion,
  title: LanguageStrings
}

export type Ingredient = {
  recipeId: number
  itemId: number
  quantity: number
  ingredientOrder: number
  title: LanguageStrings,
  rarity: number
}

export type RecipeResult = {
  recipeId: number
  productedItemId: number
  productOrder: number
  productedItemQuantity: number
  title: LanguageStrings
  description: LanguageStrings,
  rarity: number
}

export type RecipeItemData = {
  id: number
  level: number
  xpRatio: number
  isUpgrade: boolean
  upgradeItemId: number
  job: Job,
  ingredients: Ingredient[]
  result: RecipeResult
}

export type CommandOptions = Record<string, string>

export type CommandData = {
  args: string[],
  options: CommandOptions
}

export type PartyOptions = {
  name: string
  description: string
  date: string,
  level: string,
  slots: string
}
