import { BaseCommand } from '@baseCommands'
import str from '@stringsLang'
import { Message } from 'discord.js'
import { GuildConfig, PartialEmbed } from '@types'
import mappings from '@utils/mappings'
const { iconCodeMap, rarityMap } = mappings

export default class FinderCommand extends BaseCommand {
  constructor (message: Message, guildConfig: GuildConfig) {
    super(message, guildConfig)
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
    return this.send({ embed: notFoundEmbed })
  }

  protected parseIconCodeToEmoji (text: string) {
    return text.split(/(\[.*?\])/).map(word => iconCodeMap[word] || word).join('')
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
}
