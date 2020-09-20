import itemsData from '../../data/items.json'
import recipesData from '../../data/recipes.json'
import { getRecipeFields } from './recipe'
import { mountCommandHelpEmbed } from './help'
import { getArgumentsAndOptions } from '../utils/message'
import { setLanguage, isValidLang } from '../utils/language'
import config from '../config'
const { rarityMap, equipTypesMap } = config

const equipTypesIds = Object.keys(equipTypesMap).map(Number).filter(id => id !== 647) // Remove costumes
const equipmentList = itemsData.filter(item => {
  return equipTypesIds.includes(item.itemTypeId)
})

const iconCodeMap = {
  '[el1]': ':fire:',
  '[el2]': ':droplet:',
  '[el3]': ':herb:',
  '[el4]': ':dash:',
  '[el6]': ':star2:',
  '[HLINE]': ':left_right_arrow:',
  '[VLINE]': ':arrow_up_down:',
  '[CIRCLERING]': ':arrows_counterclockwise:',
  '[*]': ''
}

/**
 * Remove equip with the same name and lower rarity.
 *
 * @param {object[]} equipmentList
 * @param {string} lang
 * @returns {object[]}
 */
function removeLowerRarities (equipmentList, lang) {
  return equipmentList.filter(equip => {
    const equipName = equip.title[lang]
    const higherRarity = equipmentList.reduce((higherRarity, otherEquip) => {
      const hasSameName = otherEquip.title[lang] === equipName
      if (!hasSameName) {
        return higherRarity
      }
      return Math.max(higherRarity, otherEquip.rarity, equip.rarity)
    }, 0)

    const equipRarity = equip.rarity
    return equipRarity === higherRarity
  })
}

/**
 * Find a equipment list by matching name.
 *
 * @param {object[]} equipmentList
 * @param {string} query
 * @param {string[]} filters
 * @param {string} lang
 * @returns {object[]}
 */
function findEquipmentByName (equipmentList, query, filters, lang) {
  const hasRarityFilter = Boolean(filters.rarity)
  if (!hasRarityFilter) {
    return removeLowerRarities(equipmentList, lang).filter(equip => equip.title[lang].toLowerCase().includes(query))
  }

  return equipmentList.filter(equip => {
    let filterAssertion = true
    const includeQuery = equip.title[lang].toLowerCase().includes(query)
    const hasRarity = rarityMap[equip.rarity].name[lang].toLowerCase().includes(filters.rarity)
    filterAssertion = filterAssertion && hasRarity

    return includeQuery && filterAssertion
  })
}

/**
 * Parse a text string converting icon codes to discord emojis.
 *
 * @param {string} text
 * @returns {string}
 */
function parseIconCodeToEmoji (text) {
  return text.split(/(\[.*?\])/).map(word => iconCodeMap[word] || word).join('')
}

/**
 * Get the text that displays more results.
 *
 * @param {object[]} results
 * @param {number} resultsLimit
 * @param {string} lang
 * @returns {string}
 */
function getMoreEquipmentText (results, resultsLimit, lang) {
  if (results.length > resultsLimit) {
    const firstResults = results.slice(0, resultsLimit)
    const otherResults = results.slice(resultsLimit, results.length)
    const moreResultsText = ` e outros ${otherResults.length} resultados`
    return firstResults.map(equip => equip.title[lang]).join(', ').trim() + moreResultsText
  }
  return results.map(equip => equip.title[lang]).join(', ').trim()
}

/**
 * Mount the not found equipment embed.
 *
 * @returns {object}
 */
function mountNotFoundEmbed () {
  return {
    color: '#bb1327',
    title: ':x: Nenhum equipamento encontrado',
    description: 'Digite `.help equip` para conferir alguns exemplos de como pesquisar.'
  }
}

/**
 * Mount equipment found embed message.
 *
 * @param {object[]} results
 * @param {string} lang
 * @returns {object}
 */
function mountEquipEmbed (results, lang) {
  const firstResult = results[0]
  const equipEmbed = {
    color: rarityMap[firstResult.rarity].color,
    title: `${rarityMap[firstResult.rarity].emoji} ${firstResult.title[lang]}`,
    description: firstResult.description[lang],
    thumbnail: { url: `https://builder.methodwakfu.com/assets/icons/items/${firstResult.imageId}.webp` },
    fields: [
      {
        name: 'Nível',
        value: firstResult.level,
        inline: true
      },
      {
        name: 'Tipo',
        value: equipTypesMap[firstResult.itemTypeId][lang],
        inline: true
      },
      {
        name: 'Raridade',
        value: rarityMap[firstResult.rarity].name[lang],
        inline: true
      }
    ]
  }
  if (firstResult.equipEffects.length) {
    equipEmbed.fields.push({
      name: 'Equipado',
      value: firstResult.equipEffects.map(effect => parseIconCodeToEmoji(effect.description[lang])).join('\n')
    })
  }
  if (firstResult.useEffects.length) {
    equipEmbed.fields.push({
      name: 'Em uso',
      value: firstResult.useEffects.map(effect => parseIconCodeToEmoji(effect.description[lang])).join('\n')
    })
  }
  const hasCondititions = Boolean(firstResult.conditions.description[lang])
  if (hasCondititions) {
    equipEmbed.fields.push({
      name: 'Condições',
      value: firstResult.conditions.description[lang]
    })
  }
  const recipes = recipesData.filter(recipe => recipe.result.productedItemId === firstResult.id)
  if (recipes.length) {
    const recipeFields = getRecipeFields(recipes, lang)
    equipEmbed.fields = [
      ...equipEmbed.fields,
      ...recipeFields
    ]
  }
  const equipamentsFoundText = getMoreEquipmentText(results, 20, lang)
  if (results.length > 1) {
    equipEmbed.footer = {
      text: `Equipamentos encontrados: ${equipamentsFoundText}`
    }
  }
  return equipEmbed
}

/**
 * Replies the user information about the given equipment.
 *
 * @param { import('discord.js').Message } message - Discord message object.
 * @returns { Promise<object>}.
 */
export async function getEquipment (message) {
  const { args, options } = getArgumentsAndOptions(message, '=')
  const query = args.join(' ').toLowerCase()
  if (!query) {
    const helpEmbed = mountCommandHelpEmbed(message)
    return message.channel.send({ embed: helpEmbed })
  }
  let lang = setLanguage(options, config, message.guild.id)

  let results = []
  results = findEquipmentByName(equipmentList, query, options, lang)
  if (!results.length) {
    const notFoundEmbed = mountNotFoundEmbed()
    return message.channel.send({ embed: notFoundEmbed })
  }

  if (isValidLang(options.translate)) {
    lang = options.translate
  }

  const equipEmbed = mountEquipEmbed(results, lang)
  return message.channel.send({ embed: equipEmbed })
}
