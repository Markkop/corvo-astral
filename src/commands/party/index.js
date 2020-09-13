import { createParty } from './create'
import { joinParty } from './join'
import { updateParty } from './update'
import { leaveParty } from './leave'
import { commandsHelp } from '../help'
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
    return message.channel.send({
      embed: {
        color: 'LIGHT_GREY',
        title: ':grey_question: Ajuda: `.party join`',
        description: commandsHelp.party
      }
    })
  }

  const partyAction = partyActions[argument]
  return partyAction(message, options)
}
