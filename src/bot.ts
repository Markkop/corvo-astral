import {
  AboutCommand,
  AlmaCommand,
  CalcCommand,
  ConfigCommand,
  EquipCommand,
  HelpCommand,
  PartyCreateCommand,
  PartyUpdateCommand,
  RecipeCommand,
  SubliCommand
} from '@commands'
import { ConfigManager, MessageManager } from '@managers'
import stringsLang from '@stringsLang'
import { GuildConfig } from '@types'
import { registerCommands } from '@utils/registerCommands'
import { Client, Guild, Intents, Interaction, Message, MessageReaction, TextChannel, User } from 'discord.js'
import express from 'express'
import 'module-alias/register'
import './registerAlias'
import ReactionService from './services/ReactionService'
import { handleInteractionError, handleMessageError, handleReactionError } from './utils/handleError'
require('dotenv').config()

const commandsMap = {
  equip: EquipCommand,
  about: AboutCommand,
  calc: CalcCommand,
  recipe: RecipeCommand,
  subli: SubliCommand,
  alma: AlmaCommand,
  'party-create': PartyCreateCommand,
  'party-update': PartyUpdateCommand,
  help: HelpCommand,
  config: ConfigCommand
}

class Bot {
  private client: Client
  private token: string
  private configManager: ConfigManager

  constructor(client: Client, token: string, configManager: ConfigManager) {
    this.client = client
    this.token = token
    this.configManager = configManager
    // Disabled due to the new Almanax changes
    // cron.schedule('1 0 * * *', this.sendDailyAlmanaxBonus.bind(this))
  }

  public listen(): void {
    this.client.on('messageCreate', this.onMessage.bind(this))
    this.client.on('interactionCreate', this.onInteractionCreate.bind(this))
    this.client.on('ready', this.onReady.bind(this))
    this.client.on('messageReactionAdd', this.onMessageReactionAdd.bind(this))
    this.client.on('messageReactionRemove', this.onMessageReactionRemove.bind(this))
    this.client.on('guildCreate', this.onGuildCreate.bind(this))

    this.client.login(this.token)
  }

  private listenTo8080() {
    const app = express()
    app.get('/', (req, res) => {
      res.send('Ok')
    })
    app.listen(8080)
  }

  private onReady() {
    const servers = this.client.guilds.cache.size
    console.log(`Online on ${servers} servers: ${this.client.guilds.cache.map(guild => guild.name).join(', ')}`)
    this.client.user.setActivity('/about or /help', { type: 'PLAYING' })
    // saveServersNumber(servers)
    this.registerCommandsAfterLoadingConfigs()
    this.listenTo8080()
  }

  private onGuildCreate(guild: Guild) {
    const guildConfig = this.configManager.getGuildConfig(guild.id)
    registerCommands(this.client, guild.id, guildConfig as GuildConfig, guild.name)
    console.log(`Just joined on ${guild.name} and registered slash commands!`)
  }

  private registerCommandsAfterLoadingConfigs() {
    const interval = setInterval(() => {
      if (!this.configManager.hasLoadedConfigs) return
      clearInterval(interval)
      this.client.guilds.cache.forEach(guild => {
        const guildConfig = this.configManager.getGuildConfig(guild.id)
        registerCommands(this.client, guild.id, guildConfig as GuildConfig, guild.name)
      })
      console.log("Slash commands registered!")
    }, 1000)
  }

  /**
   * Temporary onMessage listener which will be removed after April 30th
   */
  private async onMessage(message: Message) {
    try {
      if (message.author.bot) return
      if (!message.guild) return

      const guildConfig = this.configManager.getGuildConfig(message.guild.id)
      if (!message.content.startsWith(guildConfig.prefix)) return

      const commandWord = MessageManager.getCommandWord(guildConfig.prefix, message)
      const Command = this.getCommand(commandWord)

      if (!Command) return

      message.reply({
        embeds: [
          {
            color: 0xFFFF00,
            title: ':tools: Slash Commands',
            description: stringsLang.deprecatedMessageCommand[guildConfig.lang],
          }
        ]
      })
    } catch (error) {
      handleMessageError(error, message)
    }
  }

  private async onInteractionCreate(interaction: Interaction) {
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

  private getCommand(commandWord: string) {
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
  const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGES],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
  })
  const configManager = ConfigManager.getInstance()
  const token = process.env.DISCORD_BOT_TOKEN

  const bot = new Bot(client, token, configManager)
  bot.listen()
}

initiateBot()

