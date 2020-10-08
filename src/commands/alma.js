import Discord from 'discord.js'
import { handleMessageError } from '../utils/handleError'
import scrapAlmanax from '../scrappers/almanax'

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

    const embed = {
      color: '#40b2b5',
      title: `:partly_sunny: ${stringDate}`,
      description: `**Season:** ${alma.date.season}
**Quest:** ${alma.daily.wakfu.bonus.title}
**Bonus:** ${alma.daily.wakfu.bonus.description}`,
      thumbnail: { url: alma.boss.imageUrl },
      timestamp: new Date()
    }

    const sentMessage = await message.channel.send({ embed })
    const reactions = ['🛡️', '🙏', '🌌', '🧩']
    for (let index = 0; index < reactions.length; index++) {
      await sentMessage.react(reactions[index])
    }
    await awaitReaction.remove()
    message.react('✅')
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
  const timestamp = embed.timestamp

  const alma = await scrapAlmanax(timestamp)
  const fieldMap = {
    '🛡️': {
      color: 'BLUE',
      imageUrl: alma.protector.imageUrl,
      field: {
        name: `Protector: ${alma.protector.title}`,
        value: alma.protector.description
      }
    },
    '🙏': {
      color: 'GREY',
      imageUrl: alma.boss.imageUrl,
      field: {
        name: `Meridia: ${alma.boss.title}`,
        value: alma.boss.description
      }
    },
    '🌌': {
      color: 'PURPLE',
      imageUrl: alma.zodiac.imageUrl,
      field: {
        name: `Zodiac: ${alma.zodiac.title}`,
        value: alma.zodiac.description
      }
    },
    '🧩': {
      color: 'GREEN',
      imageUrl: 'http://static.ankama.com/krosmoz/www/img/almanax/seasons.png',
      field: {
        name: ':jigsaw: Triviax',
        value: alma.trivia
      }
    }
  }

  const embedOptions = fieldMap[reaction.emoji.name]
  if (!embedOptions) {
    return
  }

  embed.fields = [embedOptions.field]
  embed.color = embedOptions.color
  embed.image = { url: embedOptions.imageUrl }

  const newEmbed = new Discord.MessageEmbed(embed)
  await awaitReaction.remove()
  return message.edit(newEmbed)
}
