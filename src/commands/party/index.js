import { createParty } from './create'
import { joinParty } from './join'
import { updateParty, legacyUpdateParty } from './update'
import { leaveParty } from './leave'
import { mountCommandHelpEmbed } from '../help'
import { getArgumentsAndOptions } from '../../utils/message'

const partyActions = {
  create: createParty,
  join: joinParty,
  update: updateParty,
  leave: leaveParty
}

/**
 * Create, join, update or leave a party listing.
 *
 * @param {object} message
 * @returns {Promise<object>}
 */
export function partyList (message) {
  const { args, options } = getArgumentsAndOptions(message, '=')
  const argument = args[0]
  const isValidArgument = Object.keys(partyActions).some(key => key === argument)
  if (!isValidArgument) {
    const helpEmbed = mountCommandHelpEmbed(message, 'en')
    return message.channel.send({ embed: helpEmbed })
  }

  const isLegacyUpdate = argument === 'update' && options.mode === 'legacy'
  if (isLegacyUpdate) {
    return legacyUpdateParty(message, options)
  }

  const partyAction = partyActions[argument]
  return partyAction(message, options)
}
