import sublimations from '../../data/sublimations'

/**
 * Find sublimation based on the argument provided.
 *
 * @param {object[]} sublimationList
 * @param {string} sublimationAsked
 * @returns {object|object[]}
 */
function findSublimation (sublimationList, sublimationAsked) {
  let sublimation = []
  sublimation = sublimationList.filter(subli => subli.name.toLowerCase().includes(sublimationAsked))
  if (!sublimation.length) {
    sublimation = sublimationList.filter(subli => subli.slots.toLowerCase().includes(sublimationAsked))
  }
  return sublimation
}

const argumentsEquivalent = {
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
  const commandArgument = message.content.split(' ').slice(1).join(' ').toLowerCase()
  const argument = argumentsEquivalent[commandArgument] || commandArgument
  const sublimationsFound = findSublimation(sublimations, argument)
  if (!sublimationsFound.length) {
    message.reply('Sublimação não encontrada :c. Digite `.help subli` para mais informações')
    return
  }

  const sublimationsFoundText = sublimationsFound.map(subli => subli.name).join(', ').trim()
  const moreSublimationsText = `Sublimações encontradas: ${sublimationsFoundText}`
  const hasSameSlot = sublimationsFound.every(subli => subli.slots.toLowerCase().includes(argument))
  if (hasSameSlot) {
    message.reply(moreSublimationsText)
    return
  }
  const reply = `Sublimação: ${sublimationsFound[0].name}
Slot: ${sublimationsFound[0].slots}
Efeitos: ${sublimationsFound[0].effects}
MaxStack: ${sublimationsFound[0].maxStack || '1'}
Drop: ${sublimationsFound[0].drop}`
  const hasMoreSublimations = sublimationsFound.length > 1
  message.reply(reply + (hasMoreSublimations ? '\n' + moreSublimationsText : ''))
}
