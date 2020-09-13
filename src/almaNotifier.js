import Discord from 'discord.js'
import { getAlmanaxBonus } from './commands/alma'
import config from '../src/config'
const { almanaxChannelName } = config

/**
 * Send a message with today's almanax bonus to all channels named "almanax".
 */
function notifyAlmanaxBonus () {
  const client = new Discord.Client()
  client.login(process.env.DISCORD_BOT_TOKEN)
  client.on('ready', async () => {
    const channels = client.channels.cache.map(channel => channel.id)

    for (let index = 0; index < channels.length; index++) {
      const channel = client.channels.cache.get(channels[index])

      if (channel.name.includes(almanaxChannelName)) {
        await getAlmanaxBonus({ channel })
      }
    }

    client.destroy()
  })
}

notifyAlmanaxBonus()
