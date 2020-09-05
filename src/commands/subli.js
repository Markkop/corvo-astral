import sublimations from '../data/sublimations'

/**
 * Find sublimation based on their name with the query provided.
 *
 * @param {object[]} sublimationList
 * @param {string} query
 * @returns {object|object[]}
 */
function findSublimationByName (sublimationList, query) {
  return sublimationList.filter(subli => subli.name.toLowerCase().includes(query))
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
  if (isFourSlotsCombination) {
    const firstCombination = query.slice(0, 3)
    const secondCombination = query.slice(1, 4)
    const firstCombinationResults = sublimationList.filter(subli => subli.slots.toLowerCase().includes(firstCombination))
    const secondCombinationResults = sublimationList.filter(subli => subli.slots.toLowerCase().includes(secondCombination))
    return [...firstCombinationResults, ...secondCombinationResults]
  }
  return sublimationList.filter(subli => subli.slots.toLowerCase().includes(query))
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
  const query = queriesEquivalent[normalizedQuery] || normalizedQuery
  const isSearchBySlot = /[rgbw][rgbw][rgbw]?[rgbw]|épico|relíquia/.test(query)
  let results = []
  if (isSearchBySlot) {
    results = findSublimationByMatchingSlots(sublimations, query)
  } else {
    results = findSublimationByName(sublimations, query)
  }

  if (!results.length) {
    message.reply('Sublimação não encontrada :c. Digite `.help subli` para mais informações')
    return
  }

  const sublimationsFoundText = results.map(subli => subli.name).join(', ').trim()
  const moreSublimationsText = `Sublimações encontradas: ${sublimationsFoundText}`

  if (isSearchBySlot) {
    message.reply(moreSublimationsText)
    return
  }

  const reply = `Sublimação: ${results[0].name}
Slot: ${results[0].slots}
Efeitos: ${results[0].effects}
MaxStack: ${results[0].maxStack || '1'}
Drop: ${results[0].drop}`
  const hasMoreSublimations = results.length > 1
  message.reply(reply + (hasMoreSublimations ? '\n' + moreSublimationsText : ''))
}
