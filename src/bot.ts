import 'module-alias/register'
require('dotenv').config()
import { Client, Interaction, Message, MessageReaction, TextChannel, User, Intents } from 'discord.js'
import cron from 'node-cron'
import { handleInteractionError, handleMessageError, handleReactionError } from './utils/handleError'
import { ConfigManager, MessageManager } from '@managers'
import ReactionService from './services/ReactionService'
import { 
  // EquipCommand,
  AlmaCommand,
  AboutCommand,
  CalcCommand,
  // RecipeCommand,
  // SubliCommand,
  // PartyBaseCommand,
  // HelpCommand,
  ConfigCommand
 } from '@commands'
import { GuildConfig } from '@types'
import { saveServersNumber } from '@utils/serversNumber'
import { registerCommands } from '@utils/registerCommands'


const commandsMap = {
  // equip: EquipCommand,
  about: AboutCommand,
  calc: CalcCommand,
  // recipe: RecipeCommand,
  // subli: SubliCommand,
  alma: AlmaCommand,
  // party: PartyBaseCommand,
  // help: HelpCommand,
  config: ConfigCommand
}

class Bot {
  private client: Client
  private token: string
  private configManager: ConfigManager

  constructor (client: Client, token: string, configManager: ConfigManager) {
    this.client = client
    this.token = token
    this.configManager = configManager
    cron.schedule('1 0 * * *', this.sendDailyAlmanaxBonus.bind(this))
  }

  public listen (): void {
    // this.client.on('message', this.onMessage.bind(this))
    this.client.on('interactionCreate', this.onInteractionCreate.bind(this))
    this.client.on('ready', this.onReady.bind(this))
    this.client.on('messageReactionAdd', this.onMessageReactionAdd.bind(this))
    this.client.on('messageReactionRemove', this.onMessageReactionRemove.bind(this))

    this.client.login(this.token)
  }

  private onReady () {
    const servers = this.client.guilds.cache.size
    console.log(`Online on ${servers} servers: ${this.client.guilds.cache.map(guild => guild.name).join(', ')}`)
    this.client.user.setActivity('.about or .help', { type: 'PLAYING' })
    saveServersNumber(servers)
    this.client.guilds.cache.forEach(guild => {
      const guildConfig = this.configManager.getGuildConfig(guild.id)
      registerCommands(this.client, guild.id, guildConfig as GuildConfig)
    })
  }


  // private async onMessage (message: Message) {
  //   try {
  //     if (message.author.bot) return
  //     if (!message.guild) return

  //     const guildConfig = this.configManager.getGuildConfig(message.guild.id)
  //     if (!message.content.startsWith(guildConfig.prefix)) return

  //     const commandWord = MessageManager.getCommandWord(guildConfig.prefix, message)
  //     const Command = this.getCommand(commandWord)

  //     if (!Command) return

  //     const CommandClass = new Command(message, guildConfig)
  //     await CommandClass.execute()
  //   } catch (error) {
  //     handleMessageError(error, message)
  //   }
  // }

  private async onInteractionCreate (interaction: Interaction) {
    try {
      if (!interaction.isCommand()) return;

      const commandName = interaction.commandName
      const Command = this.getCommand(commandName)

	    if (!Command) return;

      const guildConfig = this.configManager.getGuildConfig(interaction.guildId)

      const CommandClass = new Command(interaction, guildConfig)
      await CommandClass.execute()
    } catch (error) {
      handleInteractionError(error, interaction)
    }
  }

  private async onMessageReactionAdd(reaction: MessageReaction, user: User) {
    try {
      const guildConfig = this.configManager.getGuildConfig(reaction.message.guild.id)
      ReactionService.handleReactionAdd(reaction, user, guildConfig as GuildConfig)
    } catch (error) {
      handleReactionError(error, reaction, user)
    }
  }

  private async onMessageReactionRemove(reaction: MessageReaction, user: User) {
    try {
      const guildConfig = this.configManager.getGuildConfig(reaction.message.guild.id)
      ReactionService.handleReactionRemove(reaction, user, guildConfig as GuildConfig)
    } catch (error) {
      handleReactionError(error, reaction, user)
    }
  }

  private getCommand (commandWord: string) {
    return commandsMap[commandWord]
  }

  // TO DO: Refactor and move this function
  private async sendDailyAlmanaxBonus() {
    try {
      const guildsIds = this.client.guilds.cache.map(guild => guild.id)

      for (let guildIndex = 0; guildIndex < guildsIds.length; guildIndex++) {
        const guildId = guildsIds[guildIndex]
        const guild = this.client.guilds.cache.get(guildId)
        const guildChannelsIds = guild.channels.cache.map(channel => channel.id)
        const guildConfig = this.configManager.getGuildConfig(guildId)
        const almanaxChannelName = guildConfig.almanaxChannel
        if (!almanaxChannelName) continue

        for (let channelIndex = 0; channelIndex < guildChannelsIds.length; channelIndex++) {
          const guildChannelId = guildChannelsIds[channelIndex]
          const guildChannel = guild.channels.cache.get(guildChannelId) as TextChannel
          if (!guildChannel.name.includes(almanaxChannelName)) continue
          const embed = AlmaCommand.getAndMountAlmanaxBonusEmbed(guildConfig.lang)
          try {
            await guildChannel.send({ embeds: [embed] })
          } catch (error) {
            console.log(`${error.name}: ${error.message} on ${guildChannel.name} at ${guild.name}`)
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export default function initiateBot() {
  const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
  const configManager = ConfigManager.getInstance()
  const token = process.env.DISCORD_BOT_TOKEN
  
  const bot = new Bot(client, token, configManager)
  bot.listen()
}

initiateBot()

