import Discord from 'discord.js'
import { getAlmanaxBonus, calculateAttackDamage, getHelp, getSublimation, getEquipment, getAbout, partyList } from './commands'
import { getGroupList } from './utils/getGroupList'
import { joinPartyByReaction, leavePartyByReaction } from './reactions'
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
client.on('message', function (message) {
  if (message.author.bot) return
  if (!message.content.startsWith(prefix)) return

  const command = getCommand(prefix, message)
  const action = commandActions[command]

  if (!action) return
  action(message)
})

client.on('messageReactionAdd', async function (reaction, user) {
  if (user.bot) return

  const { members, listingGroupId } = await getGroupList(reaction, user)
  if (!members || !listingGroupId) return

  const className = classEmoji[reaction.emoji.name]
  if (!className) return

  await joinPartyByReaction(reaction, user, members, listingGroupId, className)
})

client.on('messageReactionRemove', async function (reaction, user) {
  if (user.bot) return

  const { members, listingGroupId } = await getGroupList(reaction, user)
  if (!members || !listingGroupId) return

  const className = classEmoji[reaction.emoji.name]
  if (!className) return

  await leavePartyByReaction(reaction, user, members, listingGroupId, className)
})
client.login(process.env.DISCORD_BOT_TOKEN)
