import Discord from 'discord.js'
import { getAlmanaxBonus } from './commands/alma'
import config from './config'

/**
 * Send a message with today's almanax bonus to all channels named "almanax" (default)
 * or the almanaxChannelName set with config command.
 */
function notifyAlmanaxBonus () {
  const client = new Discord.Client()
  client.login(process.env.DISCORD_BOT_TOKEN)
  client.on('ready', async () => {
    const guildsIds = client.guilds.cache.map(guild => guild.id)

    for (let guildIndex = 0; guildIndex < guildsIds.length; guildIndex++) {
      const guildId = guildsIds[guildIndex]
      const guild = client.guilds.cache.get(guildId)

      const guildChannelsIds = guild.channels.cache.map(channel => channel.id)

      const guildConfig = config.guildsOptions.find(config => config.id === guildId) || {}
      const almanaxChannelName = guildConfig.almanaxChannel || config.defaultConfig.almanaxChannelName

      for (let channelIndex = 0; channelIndex < guildChannelsIds.length; channelIndex++) {
        const guildChannelId = guildChannelsIds[channelIndex]
        const guildChannel = guild.channels.cache.get(guildChannelId)
        if (guildChannel.name.includes(almanaxChannelName)) {
          await getAlmanaxBonus({ channel: guildChannel, content: '', guild: { id: guildId } })
        }
      }
    }

    client.destroy()
  })
}

notifyAlmanaxBonus()
