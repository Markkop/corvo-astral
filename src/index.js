import Discord from 'discord.js'
import cron from 'node-cron'
import notifyAlmanaxBonus from './almaNotifier'
import { getAlmanaxBonus, calculateAttackDamage, getHelp, getSublimation, getEquipment, getAbout, partyList, getRecipe, configGuild } from './commands'
import { joinPartyByReaction, leavePartyByReaction } from './reactions'
import { handleMessageError, handleReactionError } from './utils/handleError'
import { changeAlmanaxDetails } from './commands/alma'
import { getGroupList } from './utils/getGroupList'
import { getCommand, setStartupConfig } from './utils/message'
import config from './config'
import dotenv from 'dotenv'
dotenv.config()

const { defaultConfig: { prefix }, classEmoji } = config

const commandActions = {
  alma: getAlmanaxBonus,
  calc: calculateAttackDamage,
  help: getHelp,
  subli: getSublimation,
  equip: getEquipment,
  about: getAbout,
  party: partyList,
  recipe: getRecipe,
  config: configGuild,
  time: (message) => message.reply(new Date().toString())
}

/**
 * Initialize this bot.
 */
async function init () {
  cron.schedule('1 0 * * *', notifyAlmanaxBonus)

  await setStartupConfig()

  const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })

  client.on('ready', async function () {
    console.log(`Online on ${client.guilds.cache.size} servers: ${client.guilds.cache.map(ch => ch.name).join(', ')}`)
  })

  client.on('message', async function (message) {
    try {
      if (message.author.bot) return
      if (!message.content.startsWith(prefix)) return
      if (!message.guild) return

      const command = getCommand(prefix, message)
      const action = commandActions[command]

      if (!action) return
      await action(message)
    } catch (error) {
      handleMessageError(error, message)
    }
  })

  let messagePool = []
  client.on('messageReactionAdd', async function (reaction, user) {
    try {
      if (user.bot) return

      if (reaction.partial) {
        try {
          await reaction.fetch()
        } catch (error) {
          console.log('Something went wrong when fetching the message: ', error)
          return {}
        }
      }

      const { members, listingGroupId } = await getGroupList(reaction, user)
      if (members && listingGroupId) {
        const className = classEmoji[reaction.emoji.name]
        if (!className) return

        return await joinPartyByReaction(reaction, user, members, listingGroupId, className)
      }

      const messageId = reaction.message.id
      const reactionEmbed = reaction.message.embeds[0] || {}
      const description = reactionEmbed.description || ''
      const isAlmanaxMessage = description.includes('Bonus:')
      if (isAlmanaxMessage) {
        const isValidEmoji = ['🛡️', '🙏', '🌌', '🍀', '🔎', '🗓️', '🔮'].includes(reaction.emoji.name)
        if (isValidEmoji && !messagePool.includes(messageId)) {
          messagePool.push(messageId)
          await changeAlmanaxDetails(reaction)
          messagePool = messagePool.filter(id => id !== messageId)
        }
      }
    } catch (error) {
      handleReactionError(error, reaction, user)
    }
  })

  client.on('messageReactionRemove', async function (reaction, user) {
    try {
      if (user.bot) return

      const { members, listingGroupId } = await getGroupList(reaction, user)
      if (!members || !listingGroupId) return

      const className = classEmoji[reaction.emoji.name]
      if (!className) return

      await leavePartyByReaction(reaction, user, members, listingGroupId, className)
    } catch (error) {
      handleReactionError(error, reaction, user)
    }
  })

  client.login(process.env.DISCORD_BOT_TOKEN)
}

init()
