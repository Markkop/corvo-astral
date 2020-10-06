import events from '../../data/almanaxBonuses'
import { getArgumentsAndOptions } from '../utils/message'
import { setLanguage } from '../utils/language'
import { handleMessageError } from '../utils/handleError'
import str from '../stringsLang'

/**
 * Replies the user with current Almanax bonus.
 *
 * @param { import('discord.js').Message } message - Discord message object.
 * @returns {Promise<object>}
 */
export function getAlmanaxBonus (message) {
  try {
    const { options } = getArgumentsAndOptions(message, '=')
    const lang = setLanguage(options, message.guild.id)
    const today = new Date(Date.now())
    const todayEvent = events.find(event => {
      const eventFirstDate = new Date(event.firstDate)
      const diffTime = Math.abs(today - eventFirstDate)
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      return diffDays % 5 === 0
    })

    const number = Math.floor(Math.random() * 3)
    const image = todayEvent.images[number]
    const embed = {
      color: '#40b2b5',
      title: todayEvent.name[lang],
      description: `${str.capitalize(str.todaysAlma[lang])}: ${todayEvent.text[lang]}`,
      image: { url: image },
      timestamp: new Date()
    }
    return message.channel.send({ embed })
  } catch (error) {
    handleMessageError(error, message)
  }
}
