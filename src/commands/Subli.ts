import { FinderCommand } from '@baseCommands'
import { ItemManager, RecipesManager } from '@managers'
import { mountUrl } from '@utils/mountUrl'
import mappings from '@utils/mappings'
import str from '@stringsLang'
import { GuildConfig, PartialEmbed } from '@types'
import { Interaction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { addLangAndTranslateStringOptions, addStringOptionWithRarityChoices } from '@utils/registerCommands'

const { rarityMap } = mappings

export const getData = (lang: string) => new SlashCommandBuilder()
  .setName('subli')
  .setDescription(str.subliCommandDescription[lang])
  .addSubcommand(subcommand => {
    subcommand
      .setName('by-name')
      .setDescription(str.byNameSubliConfigCommandDescription[lang])
      .addStringOption(option => option.setName('name').setDescription(str.subliNameCommandOptionDescription[lang]).setRequired(true))
    addStringOptionWithRarityChoices(subcommand, 'rarity', str.subliRarityCommandOptionDescription[lang], lang, ItemManager.getSublimationRarityIds())
    addLangAndTranslateStringOptions(subcommand, lang)
    return subcommand
  })
  .addSubcommand(subcommand => {
    subcommand
      .setName('by-slots')
      .setDescription(str.bySlotsSubliConfigCommandDescription[lang])
      .addStringOption(option => option.setName('slots').setDescription(str.subliSlotsCommandOptionDescription[lang]).setRequired(true))
      .addBooleanOption(option => option.setName('random').setDescription(str.subliRandomCommandOptionDescription[lang]))
    addLangAndTranslateStringOptions(subcommand, lang)
    return subcommand
  })
  

export default class SubliCommand extends FinderCommand {
  constructor (interaction: Interaction, guildConfig: GuildConfig) {
    super(interaction, guildConfig)
  }

  public async execute (): Promise<void> {
    if (!this.interaction.isCommand()) return
    const lang = this.interaction.options.getString('lang')
    const translate = this.interaction.options.getString('translate')
    const slots = this.interaction.options.getString('slots')
    const random = this.interaction.options.getBoolean('random')
    const rarity = this.interaction.options.getString('rarity')

    if (lang) {
      this.changeLang(lang)
    }

    const name = this.interaction.options.getString('name')
    let query = ''
    if (name) {
      const normalizedQuery = name && name.toLowerCase()
      const equivalentQuery = this.findEquivalentQuery(normalizedQuery)
      query = equivalentQuery || normalizedQuery
    }


    const options = {
      query,
      rarityId: rarity && this.getRarityIdByRarityNameInAnyLanguage(rarity),
      slots: slots && slots.toLowerCase(),
      random,
    }

    const { results, foundBy } = ItemManager.getSublimations(options, this.lang)
    if (!results.length) {
      this.returnNotFound()
      return
    }

    if (translate) {
      this.changeLang(translate)
    }

    const isEpicOrRelic = /epic|relic/.test(options.slots)
    const queriedSlotsText = foundBy === 'slots' && !isEpicOrRelic ? this.parseSlotsToEmojis(options.slots) : options.slots
  
    if (foundBy === 'permutatedSlots') {
      let maxTruncation = 30
      let permutatedSublimationFoundEmbed = this.mountPermutatedSublimationFoundEmbed(results, queriedSlotsText, this.lang, maxTruncation)
      let embedLength = JSON.stringify(permutatedSublimationFoundEmbed).length

      while (embedLength > 6000) {
        maxTruncation -= 1
        permutatedSublimationFoundEmbed = this.mountPermutatedSublimationFoundEmbed(results, queriedSlotsText, this.lang, maxTruncation)
        embedLength = JSON.stringify(permutatedSublimationFoundEmbed).length
      }
    
      this.send({ embeds: [permutatedSublimationFoundEmbed] })
      return
    }

    if (foundBy === 'name') {
      const sublimationFoundEmbed = this.mountSublimationFoundEmbed(results, this.lang)
      this.send({ embeds: [sublimationFoundEmbed] })
      return
    }
  
    const sublimationsFoundListEmbed = this.mountSublimationsFoundListEmbed(results, queriedSlotsText, this.lang)
    this.send({ embeds: [sublimationsFoundListEmbed] })
    return
  }

  private mountSublimationFoundEmbed (results, lang): PartialEmbed {
    const firstResult = results[0]
    const sublimation = firstResult.sublimation
    const isEpicOrRelic = /epic|relic/.test(sublimation.slots)
    const sublimationRarity = sublimation.slots === 'epic' ? 7 : 5
    const icon = isEpicOrRelic ? ':gem:' : ':scroll:'
    const embedColor = isEpicOrRelic ? rarityMap[sublimationRarity].color : rarityMap[firstResult.rarity].color
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
        },
        {
          name: str.capitalize(str.rarity[lang]),
          value: rarityMap[firstResult.rarity].name[lang],
          inline: true
        }
      ]
    }

    const effects = sublimation.effects && (sublimation.effects[lang] || sublimation.effects.en)
    if (effects) {
      sublimationEmbed.fields.push({
        name: str.capitalize(str.effects[lang]),
        value: this.parseIconCodeToEmoji(effects),
        inline: false
      })
    }

    const source = sublimation.source && (sublimation.source[lang] || sublimation.source.en)
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
        text: `${str.capitalize(str.sublimationsFound[lang])}: ${this.getTruncatedResults(results, 30)}`
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
          value: String(results.length),
          inline: true
        },
        {
          name: str.capitalize(str.sublimations[lang]),
          value: this.getTruncatedResults(results, 30),
          inline: false
        }
      ]
    }
  }

  private mountPermutatedSublimationFoundEmbed (results, queriedSlotsText, lang, maxTruncation): PartialEmbed {
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
          value: String(totalResults),
          inline: true
        }
      ]
    }
    results.forEach(permutatedResult => {
      const slotsAsEmojis = this.parseSlotsToEmojis(permutatedResult.slots)
      const namedResults = this.getTruncatedResults(permutatedResult.results, maxTruncation)
      const resultsLength = permutatedResult.results.length
      embed.fields.push({
        name: `${slotsAsEmojis} (${resultsLength})`,
        value: namedResults,
        inline: false
      })
    })

    return embed
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
      g: '<:green:888856997112463421>',
      b: '<:blue:888856996726579271>',
      r: '<:red:888856996831449109>',
      w: '<:white:888856997066330172>'
    }
    return Array.from(slots.toLowerCase()).map(letter => emojiMap[letter]).join(' ')
  }
}
