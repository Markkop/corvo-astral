
import Discord from 'discord.js'
import { getAndScrapMonsterById, Monster } from '../scrappers/monster'
import { convertFlatToPercentage } from '../commands/calc'
import { convertToCodeBlock, truncateFieldValue } from '../utils/message'
import { guessLanguage } from '../utils/language'
import str from '../stringsLang'

/**
 * Capitalizes first letters of words in string.
 *
 * @param {string} str - String to be modified.
 * @param {boolean} [lower=false] - Whether all other letters should be lowercased.
 * @returns {string}
 */
function capitalize (str, lower = false) {
  return (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase())
}

/**
 * @param {Monster} monster
 * @returns {import('discord.js').MessageEmbed}
 */
function mountMonsterEmbed (monster) {
  const emojiElements = [':droplet:', ':herb:', ':dash:', ':fire:']
  const damageAndResistsText = monster.resists.details.map((value, index) => {
    const splittedValue = value.replace(/%/g, '').split(' ')
    const damage = convertToCodeBlock(splittedValue[0], 5)
    const rawResist = Number(splittedValue[1])
    const convertedResist = convertFlatToPercentage(rawResist)
    const resist = convertToCodeBlock(convertedResist, 5)
    return `${emojiElements[index]} | :crossed_swords: ${damage} | :shield: ${resist}%`
  })

  const drops = monster.drops.join('\n')

  const fields = [{
    name: capitalize(monster.family.title),
    value: monster.family.value,
    inline: true
  },
  {
    name: capitalize(monster.level.title),
    value: monster.level.value,
    inline: true
  },
  {
    name: capitalize(monster.stats.title, true),
    value: monster.stats.details.join('\n')
  },
  {
    name: capitalize(monster.resists.title, true),
    value: damageAndResistsText.join('\n')
  },
  {
    name: 'Drops',
    value: truncateFieldValue(drops)
  },
  {
    name: 'Spells',
    value: monster.spells.join('\n')
  }
  ]

  const validFields = fields.filter(field => Boolean(field.value))
  return {
    color: '#40b2b5',
    url: monster.url,
    title: capitalize(monster.name, true),
    thumbnail: { url: monster.image },
    fields: validFields
  }
}

/**
 * Join a group party or updates the user listed classes.
 *
 * @param {object} reaction
 * @returns {Promise<object>}
 */
export default async function getMonster (reaction) {
  await reaction.message.reactions.removeAll()
  await reaction.message.react('⏳')
  const embed = reaction.message.embeds[0]
  const title = embed.title
  const lang = guessLanguage(title, str.monstersFound)
  const description = embed.description
  const monstersFound = description.split('\n')
  const selectedMonster = monstersFound.find(monsterText => monsterText.includes(reaction.emoji.name))
  const monsterId = selectedMonster.match(/\[(.*?)\]/)[1].replace(/\D/g, '')
  const monster = await getAndScrapMonsterById(monsterId, lang)
  const monsterEmbed = mountMonsterEmbed(monster)
  const newEmbed = new Discord.MessageEmbed(monsterEmbed)
  await reaction.message.edit(newEmbed)
  await reaction.message.reactions.removeAll()
}
