import 'module-alias/register'
import { Client, Message } from 'discord.js'
// import cron from 'node-cron'
// import notifyAlmanaxBonus from './almaNotifier'
// import { getAlmanaxBonus, calculateAttackDamage, getHelp, getSublimation, getEquipment, getAbout, partyList, getRecipe, configGuild, getMonster } from './commands'
// import onMessageReactionAdd from './reactions/onMessageReactionAdd'
// import onMessageReactionRemove from './reactions/onMessageReactionRemove'
import { handleMessageError } from './utils/handleError'
// import { getCommand, setStartupConfig } from './utils/message'
import { ConfigManager, MessageManager } from '@managers'
import { 
  EquipCommand,
  AboutCommand,
  CalcCommand,
  RecipeCommand,
  SubliCommand
 } from '@commands'
require('dotenv').config()

const commandsMap = {
  equip: EquipCommand,
  about: AboutCommand,
  calc: CalcCommand,
  recipe: RecipeCommand,
  subli: SubliCommand
}

class Bot {
  private client: Client
  private token: string
  private configManager: ConfigManager

  constructor (client: Client, token: string, configManager: ConfigManager) {
    this.client = client
    this.token = token
    this.configManager = configManager
  }

  public listen (): void {
    this.client.on('message', this.onMessage.bind(this))
    this.client.on('ready', this.onReady.bind(this))

    this.client.login(this.token)
  }

  private onReady () {
    console.log(`Online on ${this.client.guilds.cache.size} servers: ${this.client.guilds.cache.map(ch => ch.name).join(', ')}`)
    this.client.user.setActivity('.about or .help', { type: 'PLAYING' })
  }

  private async onMessage (message: Message) {
    try {
      if (message.author.bot) return
      if (!message.guild) return

      const guildConfig = this.configManager.getGuildConfig(message.guild.id)
      if (!message.content.startsWith(guildConfig.prefix)) return

      const commandWord = MessageManager.getCommandWord(guildConfig.prefix, message)
      const Command = this.getCommand(commandWord)

      if (!Command) return

      const CommandClass = new Command(message, guildConfig)
      await CommandClass.execute()
    } catch (error) {
      handleMessageError(error, message)
    }
  }

  private getCommand (commandWord: string) {
    return commandsMap[commandWord]
  }
}

const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
const configManager = ConfigManager.getInstance()
const token = process.env.DISCORD_BOT_TOKEN

const bot = new Bot(client, token, configManager)
bot.listen()
