import { getArgumentsAndOptions, convertToCodeBlock } from '../utils/message'
import { setLanguage, isValidLang } from '../utils/language'
import { searchMonsters } from '../scrappers/monster'
import str from '../stringsLang'
import config from '../config'
const { numberEmoji } = config

/**
 * Created the embed message with sublimations found list.
 *
 * @param {object[] }monsters
 * @param {string} lang
 * @returns {object}
 */
function mountMonstersFoundEmbed (monsters, lang) {
  const monstersLines = monsters.map((monster, index) => {
    return `${numberEmoji[index + 1]} ${convertToCodeBlock(`[${monster.id}]`, 6)} ${monster.name} (${monster.family}) (lvl ${monster.level})`
  })
  return {
    title: `:mag_right: ${str.monstersFound[lang]}`,
    description: monstersLines.join('\n')
  }
}

/**
 * Replies the user information about the given sublimation.
 *
 * @param { import('discord.js').Message } message - Discord message object.
 * @returns {Promise<object>}
 */
export async function getMonster (message) {
  const { args, options } = getArgumentsAndOptions(message, '=')

  let lang = setLanguage(options, message.guild.id)
  const query = args.join('-')
  const waitingReaction = await message.react('⏳')
  const monstersFound = await searchMonsters(query, lang) || []
  const maxResults = monstersFound.length > 9 ? 9 : monstersFound.length
  monstersFound.length = maxResults

  if (isValidLang(options.translate)) {
    lang = options.translate
  }

  const monstersFoundEmbed = mountMonstersFoundEmbed(monstersFound, lang)
  waitingReaction.remove()
  const sentMessage = await message.channel.send({ embed: monstersFoundEmbed })
  for (let index = 1; index <= maxResults; index++) {
    await sentMessage.react(numberEmoji[index])
  }
  return sentMessage
}
