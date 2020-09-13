import Discord from 'discord.js'
import { getAlmanaxBonus, calculateAttackDamage, getHelp, getSublimation, getEquipment, getAbout, partyList } from './commands'
import { joinPartyByReaction, leavePartyByReaction } from './reactions'
import { handleMessageError, handleReactionError } from './utils/handleError'
import { getGroupList } from './utils/getGroupList'
import { getCommand } from './utils/message'
import config from './config'
import dotenv from 'dotenv'
dotenv.config()

const { prefix, classEmoji } = config

const commandActions = {
  alma: getAlmanaxBonus,
  calc: calculateAttackDamage,
  help: getHelp,
  subli: getSublimation,
  equip: getEquipment,
  about: getAbout,
  party: partyList,
  time: (message) => message.reply(new Date().toString())
}

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
client.on('message', async function (message) {
  try {
    if (message.author.bot) return
    if (!message.content.startsWith(prefix)) return

    const command = getCommand(prefix, message)
    const action = commandActions[command]

    if (!action) return
    await action(message)
  } catch (error) {
    handleMessageError(error, message)
  }
})

client.on('messageReactionAdd', async function (reaction, user) {
  try {
    if (user.bot) return

    const { members, listingGroupId } = await getGroupList(reaction, user)
    if (!members || !listingGroupId) return

    const className = classEmoji[reaction.emoji.name]
    if (!className) return

    await joinPartyByReaction(reaction, user, members, listingGroupId, className)
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
