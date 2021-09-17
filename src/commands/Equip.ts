import { FinderCommand } from '@baseCommands'
import { ItemManager, RecipesManager, MessageManager } from '@managers'
import { mountUrl } from '@utils/mountUrl'
import str from '@stringsLang'
import { GuildConfig, PartialEmbed } from '@types'
import { Message } from 'discord.js'
import mappings from '@utils/mappings'
const { rarityMap, equipTypesMap } = mappings

export default class EquipCommand extends FinderCommand {
  constructor (message: Message, guildConfig: GuildConfig) {
    super(message, guildConfig)
  }

  public async execute (): Promise<void> {
    const { args, options } = MessageManager.getArgumentsAndOptions(this.message)
    const query = args.join(' ').toLowerCase()

    if (!query) {
      this.sendHelp()
      return
    }

    if (options.lang) {
      this.changeLang(options.lang)
    }

    const results = ItemManager.getEquipmentByName(query, options, this.lang)
    if (!results.length) {
      this.returnNotFound()
      return
    }

    if (options.translate) {
      this.changeLang(options.translate)
    }

    const equipEmbed = this.mountEquipEmbed(results)
    const sentMessage = await this.send({ embed: equipEmbed })

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
          value: firstResult.level,
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
