const Discord = require('discord.js')
const { getAlmanaxBonus } = require('./helpers')
require('dotenv').config()

const client = new Discord.Client()
const prefix = '.'

client.on('message', function (message) {
  if (message.author.bot) return
  if (!message.content.startsWith(prefix)) return

  const commandBody = message.content.slice(prefix.length)
  const args = commandBody.split(' ')
  const command = args.shift().toLowerCase()

  if (command === 'alma') {
    const almanaxBonus = getAlmanaxBonus()
    message.reply(`o bônus do alma de hoje é ${almanaxBonus.text}`)
  }

  if (command === 'calc') {
    const reply = calculateAttackDamage(args)
    message.reply(reply)
  }
})
client.login(process.env.DISCORD_BOT_TOKEN)
