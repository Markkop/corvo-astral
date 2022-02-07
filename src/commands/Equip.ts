import { FinderCommand } from '@baseCommands'
import { ItemManager, RecipesManager, MessageManager } from '@managers'
import { mountUrl } from '@utils/mountUrl'
import str from '@stringsLang'
import { GuildConfig, PartialEmbed } from '@types'
import { Interaction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { addLangAndTranslateStringOptions, addStringOptionWithRarityChoices } from '@utils/registerCommands'
import mappings from '@utils/mappings'
const { rarityMap, equipTypesMap } = mappings

export const getData = (lang: string) => {
  const builder = new SlashCommandBuilder()
  builder
    .setName('equip')
    .setDescription(str.equipCommandDescription[lang])
    .addStringOption(option => option.setName('name').setDescription(str.equipNameCommandOptionDescription[lang]).setRequired(true))
  addStringOptionWithRarityChoices(builder, 'rarity', str.equipRarityCommandOptionDescription[lang], lang)
  addLangAndTranslateStringOptions(builder, lang)
  return builder
}

export default class EquipCommand extends FinderCommand {
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

    const results = ItemManager.getEquipmentByName(name, options, this.lang)
    if (!results.length) {
      this.returnNotFound()
      return
    }

    if (translate) {
      this.changeLang(translate)
    }

    const equipEmbed = this.mountEquipEmbed(results)
    const sentMessage = await this.send({ embeds: [equipEmbed] })

    const reactions = []
    const recipes = RecipesManager.getRecipesByProductedItemId(results[0].id)
    if (recipes.length) {
      reactions.unshift('🛠️')
    }
    await MessageManager.reactToMessage(reactions, sentMessage)
  }

  private mountEquipEmbed (results): PartialEmbed {
    const firstResult = results[0]
    const equipEmbed: PartialEmbed = {
      url: mountUrl(firstResult.id, firstResult.itemTypeId, this.lang),
      color: rarityMap[firstResult.rarity].color,
      title: `${rarityMap[firstResult.rarity].emoji} ${firstResult.title[this.lang]}`,
      description: `${firstResult.description[this.lang]}\nID: ${firstResult.id}`,
      thumbnail: { url: `https://static.ankama.com/wakfu/portal/game/item/115/${firstResult.imageId}.png` },
      fields: [
        {
          name: str.capitalize(str.level[this.lang]),
          value: String(firstResult.level),
          inline: true
        },
        {
          name: str.capitalize(str.type[this.lang]),
          value: equipTypesMap[firstResult.itemTypeId][this.lang],
          inline: true
        },
        {
          name: str.capitalize(str.rarity[this.lang]),
          value: rarityMap[firstResult.rarity].name[this.lang],
          inline: true
        }
      ]
    }
    if (firstResult.equipEffects.length) {
      equipEmbed.fields.push({
        name: str.capitalize(str.equipped[this.lang]),
        value: firstResult.equipEffects.map(effect => this.parseIconCodeToEmoji(effect.description[this.lang])).join('\n'),
        inline: false
      })
    }
    if (firstResult.useEffects.length) {
      equipEmbed.fields.push({
        name: str.capitalize(str.inUse[this.lang]),
        value: firstResult.useEffects.map(effect => this.parseIconCodeToEmoji(effect.description[this.lang])).join('\n'),
        inline: false
      })
    }
    const hasCondititions = Boolean(firstResult.conditions && firstResult.conditions.description[this.lang])
    if (hasCondititions) {
      equipEmbed.fields.push({
        name: str.capitalize(str.conditions[this.lang]),
        value: firstResult.conditions.description[this.lang],
        inline: false
      })
    }
    const equipamentsFoundText = this.getTruncatedResults(results, 20, true)
    if (results.length > 1) {
      equipEmbed.footer = {
        text: `${str.capitalize(str.equipmentFound[this.lang])}: ${equipamentsFoundText}`
      }
    }
    return equipEmbed
  }
}
