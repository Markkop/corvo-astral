import Discord from 'discord.js'
import { getAlmanaxBonus, calculateAttackDamage, getHelp } from './commands'
import { getCommand } from './utils'
import config from './config'
import dotenv from 'dotenv'
dotenv.config()

const { prefix } = config

const commandActions = {
  alma: getAlmanaxBonus,
  calc: calculateAttackDamage,
  help: getHelp,
  time: () => new Date().toString()
}

const client = new Discord.Client()
client.on('message', function (message) {
  if (message.author.bot) return
  if (!message.content.startsWith(prefix)) return

  const command = getCommand(message)
  const action = commandActions[command]

  if (!action) return
  action(message)
})
client.login(process.env.DISCORD_BOT_TOKEN)
