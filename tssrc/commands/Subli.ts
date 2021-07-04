import { FinderCommand } from '@baseCommands'
import { ItemManager, RecipesManager, MessageManager } from '@managers'
import { mountUrl } from '@utils/mountUrl'
import mappings from '@utils/mappings'
import str from '@stringsLang'
import { GuildConfig, ItemData, PartialEmbed } from '@types'
import { Message } from 'discord.js'
const { rarityMap } = mappings

export default class SubliCommand extends FinderCommand {
  constructor (message: Message, guildConfig: GuildConfig) {
    super(message, guildConfig)
  }

  public async execute (): Promise<void> {
    const anyOrderArgument = 'random'
    const { args, options } = MessageManager.getArgumentsAndOptions(this.message)

    if (options.lang) {
      this.changeLang(options.lang)
    }

    const hasAnyOrderArgument = args.includes(anyOrderArgument)
    if (hasAnyOrderArgument) {
      const anyOrderIndex = args.indexOf(anyOrderArgument)
      args.splice(anyOrderIndex, 1)
    }

    const normalizedQuery = args.join(' ').toLowerCase()
    const equivalentQuery = this.findEquivalentQuery(normalizedQuery)
    if (!normalizedQuery) {
      this.replyWithHelp()
      return
    }

    const query = equivalentQuery || normalizedQuery
    const { results, foundBy } = ItemManager.getSublimations(query, options, hasAnyOrderArgument, this.lang)
    if (!results.length) {
      this.returnNotFound()
      return
    }

    if (options.translate) {
      this.changeLang(options.translate)
    }

    const isEpicOrRelic = /epic|relic/.test(query)
    const queriedSlotsText = foundBy === 'slots' && !isEpicOrRelic ? this.parseSlotsToEmojis(query) : query
  
    if (foundBy === 'permutatedSlots') {
      const permutatedSublimationFoundEmbed = this.mountPermutatedSublimationFoundEmbed(results, queriedSlotsText, this.lang)
      this.reply({ embed: permutatedSublimationFoundEmbed })
      return
    }

    if (foundBy === 'name') {
      const sublimationFoundEmbed = this.mountSublimationFoundEmbed(results, this.lang)
      this.reply({ embed: sublimationFoundEmbed })
      return
    }
  
    const sublimationsFoundListEmbed = this.mountSublimationsFoundListEmbed(results, queriedSlotsText, this.lang)
    this.reply({ embed: sublimationsFoundListEmbed })
    return
  }

  private mountSublimationFoundEmbed (results, lang): PartialEmbed {
    const firstResult = results[0]
    const sublimation = firstResult.sublimation
    const isEpicOrRelic = /epic|relic/.test(sublimation.slots)
    const sublimationRarity = sublimation.slots === 'epic' ? 7 : 5
    const icon = isEpicOrRelic ? ':gem:' : ':scroll:'
    const embedColor = isEpicOrRelic ? rarityMap[sublimationRarity].color : rarityMap[3].color
    const maxStack = firstResult.description[lang].replace(/\D/g, '')
    const sublimationEmbed: PartialEmbed = {
      url: mountUrl(firstResult.id, firstResult.itemTypeId, lang),
      color: embedColor,
      title: `${icon} ${firstResult.title[lang]}`,
      thumbnail: { url: `https://static.ankama.com/wakfu/portal/game/item/115/${firstResult.imageId}.png` },
      fields: [
        {
          name: str.capitalize(str.slots[lang]),
          value: isEpicOrRelic ? rarityMap[sublimationRarity].name[lang] : this.parseSlotsToEmojis(sublimation.slots),
          inline: true
        },
        {
          name: str.capitalize(str.maxStacks[lang]),
          value: maxStack || '1',
          inline: true
        }
      ]
    }

    const effects = sublimation.effects[lang] || sublimation.effects.en
    if (effects) {
      sublimationEmbed.fields.push({
        name: str.capitalize(str.effects[lang]),
        value: effects,
        inline: false
      })
    }

    const source = sublimation.source[lang] || sublimation.source.en
    if (source) {
      sublimationEmbed.fields.push({
        name: str.capitalize(str.acquiring[lang]),
        value: source.trim(),
        inline: false
      })
    }

    const recipes = RecipesManager.getRecipesByProductedItemId(firstResult.id)
    if (recipes.length) {
      const recipeFields = RecipesManager.getRecipeFields(recipes, lang)
      sublimationEmbed.fields = [
        ...sublimationEmbed.fields,
        ...recipeFields
      ]
    }
    const hasFoundMoreThanOne = results.length > 1
    if (hasFoundMoreThanOne) {
      sublimationEmbed.footer = {
        text: `${str.capitalize(str.sublimationsFound[lang])}: ${this.getSublimationListText(results, lang)}`
      }
    }
    return sublimationEmbed
  }

  private mountSublimationsFoundListEmbed (results, queriedSlotsText, lang): PartialEmbed {
    return {
      title: `:mag_right: ${str.capitalize(str.sublimationsFound[lang])}`,
      fields: [
        {
          name: str.capitalize(str.query[lang]),
          value: queriedSlotsText,
          inline: true
        },
        {
          name: str.capitalize(str.results[lang]),
          value: results.length,
          inline: true
        },
        {
          name: str.capitalize(str.sublimations[lang]),
          value: this.getSublimationListText(results, lang),
          inline: false
        }
      ]
    }
  }

  private mountPermutatedSublimationFoundEmbed (results, queriedSlotsText, lang): PartialEmbed {
    const totalResults = results.reduce((totalResults, permutatedResult) => {
      return totalResults + permutatedResult.results.length
    }, 0)
    const embed = {
      title: `:mag_right: ${str.capitalize(str.sublimationsFound[lang])}`,
      fields: [
        {
          name: str.capitalize(str.query[lang]),
          value: `${this.parseSlotsToEmojis(queriedSlotsText)} ${str.inAnyOrder[lang]}`,
          inline: true
        },
        {
          name: str.capitalize(str.results[lang]),
          value: totalResults,
          inline: true
        }
      ]
    }
    results.forEach(permutatedResult => {
      const slotsAsEmojis = this.parseSlotsToEmojis(permutatedResult.slots)
      const namedResults = this.getSublimationListText(permutatedResult.results, lang)
      const resultsLength = permutatedResult.results.length
      embed.fields.push({
        name: `${slotsAsEmojis} (${resultsLength})`,
        value: namedResults,
        inline: false
      })
    })
    return embed
  }

  private getSublimationListText (results: ItemData[], lang: string) {
    return results.map(subli => subli.title[lang]).join(', ').trim()
  }

  private findEquivalentQuery (query: string) {
    const epicNames = rarityMap[7].name
    const relicNames = rarityMap[5].name
    return [epicNames, relicNames].reduce((equivalentQuery, names) => {
      const eq = Object.keys(names).find(key => names[key].toLowerCase() === query)
      return eq ? names.en.toLowerCase() : equivalentQuery
    }, '')
  }

  private parseSlotsToEmojis (slots: string) {
    const emojiMap = {
      g: ':green_square:',
      b: ':blue_square:',
      r: ':red_square:',
      w: ':white_large_square:'
    }
    return Array.from(slots.toLowerCase()).map(letter => emojiMap[letter]).join(' ')
  }
}
