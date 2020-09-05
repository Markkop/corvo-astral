import sublimations from '../data/sublimations'
import { commandsHelp } from './help'

/**
 * Find sublimation based on their name with the query provided.
 *
 * @param {object[]} sublimationList
 * @param {string} query
 * @returns {object|object[]}
 */
function findSublimationByName (sublimationList, query) {
  query = query.replace(/2|ll/g, 'ii').replace(/3|lll/g, 'iii')
  return sublimationList.filter(subli => subli.name.toLowerCase().includes(query))
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
    message.reply(commandsHelp.subli)
    return
  }
  const query = queriesEquivalent[normalizedQuery] || normalizedQuery
  const isSearchBySlot = /[rgbw][rgbw][rgbw]?[rgbw]|épico|relíquia/.test(query)
  let results = []
  let hasFoundByName = true
  if (isSearchBySlot) {
    results = findSublimationByMatchingSlots(sublimations, query)
    hasFoundByName = false
  } else {
    results = findSublimationByName(sublimations, query)
    if (!results.length) {
      hasFoundByName = false
      results = findSublimationBySource(sublimations, query)
    }
  }

  if (!results.length) {
    message.reply('Sublimação não encontrada :c. Digite `.help subli` para mais informações')
    return
  }

  const sublimationsFoundText = results.map(subli => subli.name).join(', ').trim()
  const moreSublimationsText = `Sublimações encontradas: ${sublimationsFoundText}`

  if (hasFoundByName) {
    const sublimationText = `Sublimação: ${results[0].name}
Slot: ${results[0].slots}
Efeitos: ${results[0].effects}
MaxStack: ${results[0].maxStack || '1'}
Fonte: ${results[0].source}`
    const hasFoundMoreThanOne = results.length > 1
    const reply = sublimationText + (hasFoundMoreThanOne ? `\n${moreSublimationsText}` : '')
    message.reply(reply)
    return
  }

  message.reply(moreSublimationsText)
}
