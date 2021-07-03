import { Client, Message } from 'discord.js'
// import cron from 'node-cron'
// import notifyAlmanaxBonus from './almaNotifier'
// import { getAlmanaxBonus, calculateAttackDamage, getHelp, getSublimation, getEquipment, getAbout, partyList, getRecipe, configGuild, getMonster } from './commands'
// import onMessageReactionAdd from './reactions/onMessageReactionAdd'
// import onMessageReactionRemove from './reactions/onMessageReactionRemove'
import { handleMessageError } from './utils/handleError'
// import { getCommand, setStartupConfig } from './utils/message'
import ConfigManager from './ConfigManager'
import EquipCommand from './commands/EquipCommand'
require('dotenv').config()

const commandsMap = {
  equip: EquipCommand,
  time: (message) => message.reply(new Date().toString())
}

class Bot {
  private client: Client
  private token: string
  private configManager: ConfigManager
  private commandsMap: any

  constructor(client: Client, token: string, configManager: ConfigManager, commandsMap: any) {
    this.client = client
    this.token = token
    this.commandsMap = commandsMap
    this.configManager = configManager
  }

  public listen(): Promise<string> {
    this.client.on('message', this.onMessage.bind(this));
    this.client.on('ready', this.onReady.bind(this))

    return this.client.login(this.token);
  }

  private onReady() {
    console.log(`Online on ${this.client.guilds.cache.size} servers: ${this.client.guilds.cache.map(ch => ch.name).join(', ')}`)
    this.client.user.setActivity('.about or .help', { type: 'PLAYING' })
  }

  private async onMessage(message: Message) {
    try {
      if (message.author.bot) return
      if (!message.guild) return

      const guildConfig = configManager.getGuildConfig(message.guild.id)
      if (!message.content.startsWith(guildConfig.prefix)) return

      const commandWord = this.getCommandWord(guildConfig.prefix, message)
      const command = this.getCommand(commandWord)
      
      if (!command) return

      const CommandClass = new command(message, commandWord, guildConfig)
      await CommandClass.return()
    } catch (error) {
      handleMessageError(error, message)
    }
  }

  private getCommandWord (commandPrefix: string, message: Message) {
    const messageContent = message.content
    const command = messageContent.split(' ')[0]
    return command.slice(commandPrefix.length)
  }

  private getCommand (commandWord: string) {
    return this.commandsMap[commandWord]
  }
} 

const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
const configManager = ConfigManager.getInstance()
const token = process.env.DISCORD_BOT_TOKEN

const bot = new Bot(client, token, configManager, commandsMap)
bot.listen()