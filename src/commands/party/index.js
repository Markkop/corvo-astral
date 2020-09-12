import { createParty } from './create'
import { joinParty } from './join'
import { getArgumentsAndOptions } from '../../utils/message'

const partyActions = {
  create: createParty,
  join: joinParty
}

/**
 * @param message
 */
export function partyList (message) {
  const { args, options } = getArgumentsAndOptions(message, '=')
  const argument = args[0]
  const isValidArgument = Object.keys(partyActions).some(key => key === argument)
  if (!isValidArgument) {
    return
  }

  const partyAction = partyActions[argument]
  return partyAction(message, options)
}
