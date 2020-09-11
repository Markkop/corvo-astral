import { commandsHelp } from './help'
import epic from '../../data/sublimations/epic.json'
import relic from '../../data/sublimations/relic.json'
import normal from '../../data/sublimations/normal.json'
import config from '../config'
const { rarityColors } = config
const sublimations = [...epic, ...relic, ...normal]

/**
 * Parses slot combination string to emojis strings.
 *
 * @param {string} slots
 * @returns {string} Emojis.
 */
function parseSlotsToEmojis (slots) {
  const emojiMap = {
    g: ':green_square:',
    b: ':blue_square:',
    r: ':red_square:',
    w: ':white_large_square:'
  }
  return Array.from(slots.toLowerCase()).map(letter => emojiMap[letter]).join(' ')
}

/**
 * Find sublimation based on their name with the query provided.
 *
 * @param {object[]} sublimationList
 * @param {string} query
 * @returns {object|object[]}
 */
function findSublimationByName (sublimationList, query) {
  query = query.replace(/2|ll/g, 'ii').replace(/3|lll/g, 'iii')
  return sublimationList.filter(subli => {
    const matchedName = subli.name.toLowerCase().includes(query)
    if (matchedName) {
      return true
    }
    const matchedAlias = subli.aliases && subli.aliases.some(alias => alias.toLowerCase().includes(query))
    return matchedAlias
  })
}

/**
 * Find sublimation based on their source with the query provided.
 *
 * @param {object[]} sublimationList
 * @param {string} query
 * @returns {object|object[]}
 */
function findSublimationBySource (sublimationList, query) {
  return sublimationList.filter(subli => subli.source.toLowerCase().includes(query))
}

/**
 * Find sublimation based on matching slots with the query provided.
 *
 * @param {object[]} sublimationList
 * @param {string} query
 * @returns {object|object[]}
 */
function findSublimationByMatchingSlots (sublimationList, query) {
  const isFourSlotsCombination = query.length === 4 && query !== 'epic'
  const regexQuery = new RegExp(query.replace(/w/g, '[r|g|b]{1}'))
  if (isFourSlotsCombination) {
    const firstCombination = query.slice(0, 3)
    const secondCombination = query.slice(1, 4)
    const firstCombinationRegex = new RegExp(firstCombination.replace(/w/g, '[r|g|b]{1}'))
    const secondCombinationRegex = new RegExp(secondCombination.replace(/w/g, '[r|g|b]{1}'))
    const firstCombinationResults = sublimationList.filter(subli => firstCombinationRegex.test(subli.slots.toLowerCase()))
    const secondCombinationResults = sublimationList.filter(subli => {
      const isRepeated = firstCombinationResults.includes(subli)
      const matchesCombination = secondCombinationRegex.test(subli.slots.toLowerCase())
      return matchesCombination && !isRepeated
    })
    return [...firstCombinationResults, ...secondCombinationResults]
  }
  return sublimationList.filter(subli => regexQuery.test(subli.slots.toLowerCase()))
}

const queriesEquivalent = {
  epico: 'épico',
  epic: 'épico',
  relic: 'relíquia',
  reliquia: 'relíquia'
}

/**
 * Created the embed message with the a help message.
 *
 * @returns {object}
 */
function mountHelpEmbed () {
  return {
    color: 'LIGHT_GREY',
    title: ':grey_question: Ajuda: `.subli`',
    description: commandsHelp.subli
  }
}

/**
 * Created the embed message with the a sublimation not found.
 *
 * @returns {object}
 */
function mountNotFoundEmbed () {
  return {
    color: '#bb1327',
    title: ':x: Nenhuma sublimação encontrada',
    description: 'Digite `.help subli` para conferir alguns exemplos de como pesquisar.'
  }
}

/**
 * Created the embed message with the sublimations found and a footer list.
 *
 * @param {object[]} results
 * @param {string} sublimationListText
 * @returns {object}
 */
function mountSublimationFoundEmbed (results, sublimationListText) {
  const firstResult = results[0]
  const isEpicOrRelic = /Épico|Relíquia/.test(firstResult.slots)
  const icon = isEpicOrRelic ? ':gem:' : ':scroll:'
  const sublimationEmbed = {
    color: rarityColors[firstResult.slots] || rarityColors.other,
    url: firstResult.link || 'https://www.wakfu.com/',
    title: `${icon} ${firstResult.name}`,
    thumbnail: { url: firstResult.image || 'https://static.ankama.com/wakfu/portal/game/item/115/81227111.png' },
    fields: [
      {
        name: 'Slot',
        value: isEpicOrRelic ? firstResult.slots : parseSlotsToEmojis(firstResult.slots),
        inline: true
      },
      {
        name: 'Max Stacks',
        value: firstResult.maxStack || '1',
        inline: true
      },
      {
        name: 'Efeitos',
        value: firstResult.effects
      },
      {
        name: 'Obtenção:',
        value: firstResult.source
      }
    ]
  }
  const hasFoundMoreThanOne = results.length > 1
  if (hasFoundMoreThanOne) {
    sublimationEmbed.footer = {
      text: `Sublimações encontradas: ${sublimationListText}`
    }
  }
  return sublimationEmbed
}

/**
 * Created the embed message with sublimations found list.
 *
 * @param {object[]} results
 * @param {string} sublimationListText
 * @param {string} queriedSlotsText
 * @returns {object}
 */
function mountSublimationsFoundListEmbed (results, sublimationListText, queriedSlotsText) {
  return {
    title: ':mag_right: Sublimações encontradas',
    fields: [
      {
        name: 'Busca',
        value: queriedSlotsText,
        inline: true
      },
      {
        name: 'Resultados',
        value: results.length,
        inline: true
      },
      {
        name: 'Sublimações',
        value: sublimationListText
      }
    ]
  }
}

/**
 * Find sublimations using some strategies.
 *
 * @param {object[]} sublimations
 * @param {string} query
 * @returns {object}
 */
function findSublimations (sublimations, query) {
  const isSearchBySlot = /[rgbw][rgbw][rgbw]?[rgbw]|épico|relíquia/.test(query)
  let results = []
  let foundBy = ''
  if (isSearchBySlot) {
    results = findSublimationByMatchingSlots(sublimations, query)
    foundBy = 'slots'
    return { results, foundBy }
  }

  results = findSublimationByName(sublimations, query)
  foundBy = 'name'

  if (results.length) {
    return { results, foundBy }
  }

  results = findSublimationBySource(sublimations, query)
  foundBy = 'source'
  return { results, foundBy }
}

/**
 * Replies the user information about the given sublimation.
 *
 * @param { import('discord.js').Message } message - Discord message object.
 * @returns {Promise<object>}
 */
export function getSublimation (message) {
  const normalizedQuery = message.content.split(' ').slice(1).join(' ').toLowerCase()
  if (!normalizedQuery) {
    const helpEmbed = mountHelpEmbed()
    return message.channel.send({ embed: helpEmbed })
  }
  const query = queriesEquivalent[normalizedQuery] || normalizedQuery
  const { results, foundBy } = findSublimations(sublimations, query)
  if (!results.length) {
    const notFoundEmbed = mountNotFoundEmbed()
    return message.channel.send({ embed: notFoundEmbed })
  }

  const sublimationListText = results.map(subli => subli.name).join(', ').trim()

  if (foundBy === 'name') {
    const sublimationFoundEmbed = mountSublimationFoundEmbed(results, sublimationListText)
    return message.channel.send({ embed: sublimationFoundEmbed })
  }

  const isEpicOrRelic = /épico|relíquia/.test(query)
  const queriedSlotsText = foundBy === 'slots' && !isEpicOrRelic ? parseSlotsToEmojis(query) : query
  const sublimationsFoundListEmbed = mountSublimationsFoundListEmbed(results, sublimationListText, queriedSlotsText)
  return message.channel.send({ embed: sublimationsFoundListEmbed })
}
