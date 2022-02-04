import { BaseCommand } from '@baseCommands'
import str from '@stringsLang'
import { Interaction } from 'discord.js'
import { GuildConfig, PartialEmbed } from '@types'
import mappings from '@utils/mappings'
const { iconCodeMap, rarityMap } = mappings

export default class FinderCommand extends BaseCommand {
  constructor (interaction: Interaction, guildConfig: GuildConfig) {
    super(interaction, guildConfig)
  }

  private mountNotFoundEmbed (lang: string): PartialEmbed {
    return {
      color: 0xbb1327,
      title: `:x: ${str.capitalize(str.noResults[lang])}`,
      description: str.capitalize(str.noResultsMessage(this.commandWord)[lang])
    }
  }

  protected returnNotFound () {
    const notFoundEmbed = this.mountNotFoundEmbed(this.lang)
    return this.send({ embeds: [notFoundEmbed] })
  }

  protected parseIconCodeToEmoji (text: string) {
    return text.split(/(\[.*?\])/).map(word => {
      const isString = typeof iconCodeMap[word] === 'string'
      return isString ? iconCodeMap[word] : word
    }).join('')
  }

  protected getTruncatedResults (results, resultsLimit: number, showRarity = false) {
    let moreResultsText = ''
    if (results.length > resultsLimit) {
      const firstResults = results.slice(0, resultsLimit)
      const otherResults = results.slice(resultsLimit, results.length)
      moreResultsText = ` ${str.andOther[this.lang]} ${otherResults.length} ${str.results[this.lang]}`
      results = firstResults
    }
    return results.map(item => {
      const rarityText = showRarity ? ` (${rarityMap[item.rarity].name[this.lang]})` : ''
      return `${item.title[this.lang]}${rarityText}`
    }).join(', ').trim() + moreResultsText
  }

  protected getRarityIdByRarityNameInAnyLanguage (rarityName: string) {
    return Object.entries(rarityMap).reduce((idDetected, [rarityId, rarityDetails]) => {
      const names = Object.values(rarityDetails.name)
      return names.some(name => rarityName.toLowerCase() === name.toLowerCase()) ? Number(rarityId) : idDetected
    }, 0)
  }
}
