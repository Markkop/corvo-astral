import Discord from 'discord.js'
import { reactToMessage } from '../utils/message'
import { handleMessageError } from '../utils/handleError'
import scrapAlmanax from '../scrappers/almanax'
import { capitalize } from '../utils/strings'
import scrapAlmanaxWeek from '../scrappers/almanaxWeek'

/**
 * Replies the user with current Almanax bonus.
 *
 * @param { import('discord.js').Message } message - Discord message object.
 * @param {object} alma - Scrapped almanax data for almaNotifier.
 * @returns {Promise<object>}
 */
export async function getAlmanaxBonus (message, alma) {
  try {
    const awaitReaction = await message.react('⏳')
    if (!alma) {
      alma = await scrapAlmanax()
    }
    const stringDate = `${alma.date.day} ${alma.date.month} ${alma.date.year}`
    const image = alma.boss.imageUrl
    const embed = {
      color: '#40b2b5',
      title: `:partly_sunny: ${stringDate}`,
      description: `**Season:** ${capitalize(alma.date.season)}
**Bonus:** ${alma.wakfuBonus.text.en}`,
      thumbnail: { url: image },
      footer: {
        text: new Date(Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
      }
    }

    const sentMessage = await message.channel.send({ embed })
    const reactions = ['🛡️', '🙏', '🌌', '🍀', '🔎', '🔮']
    if (alma.event.title) {
      reactions.push('🗓️')
    }
    await reactToMessage(reactions, sentMessage)
    await awaitReaction.remove()
    return sentMessage
  } catch (error) {
    handleMessageError(error, message)
  }
}

/**
 * Change the details of the Almanax message by reaction.
 *
 * @param {object} reaction
 * @returns {Promise<object>}
 */
export async function changeAlmanaxDetails (reaction) {
  const message = reaction.message
  const awaitReaction = await message.react('⏳')
  const embed = reaction.message.embeds[0]
  const timestamp = Number(new Date(embed.footer.text))

  let alma
  if (reaction.emoji.name === '🔮') {
    alma = await scrapAlmanaxWeek()
  } else {
    alma = await scrapAlmanax(timestamp)
  }
  const getFieldMap = {
    '🛡️': (alma) => ({
      color: 'BLUE',
      imageUrl: alma.protector.imageUrl,
      field: {
        name: `Protector: ${alma.protector.title}`,
        value: alma.protector.description
      }
    }),
    '🙏': (alma) => ({
      color: 'GREY',
      imageUrl: alma.boss.imageUrl,
      field: {
        name: `Meridia: ${alma.boss.title}`,
        value: alma.boss.description
      }
    }),
    '🌌': (alma) => ({
      color: 'PURPLE',
      imageUrl: alma.zodiac.imageUrl,
      field: {
        name: `Zodiac: ${alma.zodiac.title}`,
        value: alma.zodiac.description
      }
    }),
    '🍀': (alma) => ({
      color: 'GREEN',
      imageUrl: 'https://static.ankama.com/dofus/www/game/havenbags/themes/15.png',
      field: {
        name: 'The Meridian Effect:',
        value: alma.meridianEffect
      }
    }),
    '🔎': (alma) => ({
      color: 'GREY',
      imageUrl: getRandomImage(alma.daily.wakfu.bonus.wakfuBonus.images),
      field: {
        name: 'Triviax:',
        value: alma.trivia
      }
    }),
    '🔮': (alma) => ({
      color: 'AQUA',
      imageUrl: 'https://static.ankama.com/wakfu/portal/game/item/115/60314168.png',
      field: {
        name: 'Forecast:',
        value: alma.days.map((day) => {
          const characters = day.date.split('')
          const quantityText = Array(15).fill(' ')
          quantityText.splice(0, characters.length, ...characters)
          let bonusText = day.wakfuBonus.name.en
          if (day.events.length) {
            bonusText = `${bonusText} **[${day.events.join(', ')}]**`
          }
          return `:white_small_square: \`${quantityText.join('')}\` ${bonusText}`
        })
      }
    }),
    '🗓️': (alma) => ({
      color: '#c29f6d',
      imageUrl: alma.event.imageUrl,
      field: {
        name: `Event: ${alma.event.title}`,
        value: alma.event.description
      }
    })
  }

  const embedOptions = getFieldMap[reaction.emoji.name](alma)
  if (!embedOptions) {
    return
  }

  const isEventEmoji = reaction.emoji.name === '🗓️'
  const hasEvent = Boolean(alma.event && alma.event.title)
  if (isEventEmoji && !hasEvent) {
    return
  }

  embed.fields = [embedOptions.field]
  embed.color = embedOptions.color
  embed.thumbnail = { url: embedOptions.imageUrl }

  const newEmbed = new Discord.MessageEmbed(embed)
  await awaitReaction.remove()
  return message.edit(newEmbed)
}

/**
 * Gets a random imagem.
 *
 * @param {string[]} images
 * @returns {string}
 */
function getRandomImage (images) {
  const index = Math.floor(Math.random() * images.length)
  return images[index]
}
