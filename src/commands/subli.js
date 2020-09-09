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
 * Replies the user information about the given sublimation.
 *
 * @param { import('discord.js').Message } message - Discord message object.
 */
export function getSublimation (message) {
  const normalizedQuery = message.content.split(' ').slice(1).join(' ').toLowerCase()
  if (!normalizedQuery) {
    message.channel.send({
      embed: {
        color: 'LIGHT_GREY',
        title: ':grey_question: Ajuda: `.subli`',
        description: commandsHelp.subli
      }
    })
    return
  }
  const query = queriesEquivalent[normalizedQuery] || normalizedQuery
  const isSearchBySlot = /[rgbw][rgbw][rgbw]?[rgbw]|épico|relíquia/.test(query)
  let results = []
  let hasFoundByName = true
  let hasFoundBySlots = false
  if (isSearchBySlot) {
    results = findSublimationByMatchingSlots(sublimations, query)
    hasFoundBySlots = true
    hasFoundByName = false
  } else {
    results = findSublimationByName(sublimations, query)
    if (!results.length) {
      hasFoundByName = false
      results = findSublimationBySource(sublimations, query)
    }
  }

  if (!results.length) {
    message.channel.send({
      embed: {
        color: '#bb1327',
        title: ':x: Nenhuma sublimação encontrada',
        description: 'Digite `.help subli` para conferir alguns exemplos de como pesquisar.'
      }
    })
    return
  }

  const sublimationsFoundText = results.map(subli => subli.name).join(', ').trim()

  if (hasFoundByName) {
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
        text: `Sublimações encontradas: ${sublimationsFoundText}`
      }
    }
    message.channel.send({ embed: sublimationEmbed })
    return
  }
  const isEpicOrRelic = /épico|relíquia/.test(query)
  const queriedSlotsText = hasFoundBySlots && !isEpicOrRelic ? parseSlotsToEmojis(query) : query
  const resultsEmbed = {
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
        value: sublimationsFoundText
      }
    ]
  }
  message.channel.send({ embed: resultsEmbed })
}
