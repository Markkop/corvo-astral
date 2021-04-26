import Discord from 'discord.js'
import cron from 'node-cron'
import notifyAlmanaxBonus from './almaNotifier'
import { getAlmanaxBonus, calculateAttackDamage, getHelp, getSublimation, getEquipment, getAbout, partyList, getRecipe, configGuild, getMonster } from './commands'
import onMessageReactionAdd from './reactions/onMessageReactionAdd'
import onMessageReactionRemove from './reactions/onMessageReactionRemove'
import { handleMessageError } from './utils/handleError'
import { getCommand, setStartupConfig } from './utils/message'
import { getMethodBuildFromMessage, getZenithBuildFromMessage } from './integrations'
import config from './config'
import dotenv from 'dotenv'
dotenv.config()

const { defaultConfig: { prefix } } = config

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
  mob: getMonster,
  time: (message) => message.reply(new Date().toString())
}

const builderIntegrations = [
  {
    identifierText: 'builder.methodwakfu.com/builder/',
    getter: getMethodBuildFromMessage
  },
  {
    identifierText: 'zenithwakfu.com/builder/',
    getter: getZenithBuildFromMessage
  }
]

/**
 * Initialize this bot.
 */
async function init () {
  cron.schedule('1 0 * * *', notifyAlmanaxBonus)

  await setStartupConfig()

  const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })

  client.on('ready', async function () {
    console.log(`Online on ${client.guilds.cache.size} servers: ${client.guilds.cache.map(ch => ch.name).join(', ')}`)
    client.user.setActivity('.about or .help', { type: 'PLAYING' })
  })

  client.on('message', async function (message) {
    try {
      if (message.author.bot) return

      // Removing builder preview until further fix
      // const matchingBuilderIntegration = builderIntegrations.find(integration => message.content.includes(integration.identifierText))

      // if (matchingBuilderIntegration) {
      //   return matchingBuilderIntegration.getter(message)
      // }

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

  client.on('messageReactionAdd', onMessageReactionAdd)

  client.on('messageReactionRemove', onMessageReactionRemove)

  client.login(process.env.DISCORD_BOT_TOKEN)
}

init()
