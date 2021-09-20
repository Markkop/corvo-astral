import { BaseCommand } from '@baseCommands'
import { MessageManager, ConfigManager } from '@managers'
import { GuildConfig } from '@types'
import { Message } from 'discord.js'

export default class ConfigCommand extends BaseCommand {
  constructor (message: Message, guildConfig: GuildConfig) {
    super(message, guildConfig)
  }

  public async execute (): Promise<void> {
    const { args, options } = MessageManager.getArgumentsAndOptions(this.message)

    if (options.lang) {
      this.changeLang(options.lang)
    }

    const arg = args[0]
    const validArgs = ['get', 'set']
    const validOptions = ['lang', 'almanaxChannel', 'partyChannel', 'buildPreview']
    const isValidArgs = validArgs.some(validArg => validArg === arg)
    const isValidOptions = Object.keys(options).every(option => validOptions.includes(option))

    if (!isValidArgs || !isValidOptions) {
      this.sendHelp()
      return
    }

    const guildId = String(this.message.guild.id)
    if (arg === 'set') {
      if (!this.message.member.hasPermission('ADMINISTRATOR')) {
        this.send('You need administrator permission for this')
        return 
      }
      
      const hasOptions = Boolean(Object.keys(options).length)
      if(!hasOptions) {
        this.sendHelp()
        return
      }

      if (options.lang && !this.isValidLang(options.lang)) {
        this.send(`${options.lang} is not a valid language.`)
        return 
      }

      const configManager = ConfigManager.getInstance()
      const currentConfig = configManager.getGuildConfig(guildId)
      // TO DO: refactor this config setting to be generic
      const newConfig = {
        id: guildId,
        prefix: options.prefix || currentConfig.prefix,
        lang: options.lang || currentConfig.lang,
        almanaxChannel: options.almanaxChannel || currentConfig.almanaxChannel,
        partyChannel: options.partyChannel || currentConfig.partyChannel,
        buildPreview: options.buildPreview || currentConfig.buildPreview,
      }
      await configManager.updateGuildConfig(newConfig)
      const configEmbed = this.mountConfigEmbed('Config updated', newConfig)
      this.send({ embed: configEmbed })
      return
    }

    const configManager = ConfigManager.getInstance()
    const currentConfig = configManager.getGuildConfig(guildId)
    if (!currentConfig) {
      const configEmbed = this.mountConfigEmbed('No custom config found. Using default', ConfigManager.getDefaultConfig())
      this.send({ embed: configEmbed })
      return
    }
    const configEmbed = this.mountConfigEmbed(`Config for "${this.message.guild.name}"`, currentConfig)
    this.send({ embed: configEmbed })
    return
  }

  private mountConfigEmbed (title, config) {
    const guildConfigText = JSON.stringify(config, null, 2)
    return {
      title,
      description: '```json\n' + guildConfigText + '\n```'
    }
  }
}
