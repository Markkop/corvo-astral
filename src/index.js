import Discord from 'discord.js'
import { getAlmanaxBonus, calculateAttackDamage } from './commands'
import { parseCommandAndArgsFromMessage } from './utils'
import config from './config'
import dotenv from 'dotenv'
dotenv.config()

const { prefix } = config

const client = new Discord.Client()
client.on('message', function (message) {
  if (message.author.bot) return
  if (!message.content.startsWith(prefix)) return

  const { command, args } = parseCommandAndArgsFromMessage(message, prefix)

  if (command === 'alma') {
    const almanaxBonusReply = getAlmanaxBonus()
    message.reply(almanaxBonusReply)
  }

  if (command === 'calc') {
    const reply = calculateAttackDamage(args)
    message.reply(reply)
  }

  if (command === 'time') {
    message.reply(new Date().toString())
  }
})
client.login(process.env.DISCORD_BOT_TOKEN)
