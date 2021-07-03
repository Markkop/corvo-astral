import { GuildConfig, DefaultGuildConfig } from './types'
import DatabaseManager from './DatabaseManager'

class ConfigManager {
  private static instance: ConfigManager;

  private guildsConfig: GuildConfig[]
  private static defaultGuildConfig: DefaultGuildConfig = {
    lang: 'en',
    prefix: '.',
    almanaxChannel: 'almanax',
    partyChannel: 'listagem-de-grupos',
    buildPreview: 'enabled'
  }

  private constructor() {
    this.loadGuildsConfig()
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }

    return ConfigManager.instance;
  }

  public getGuildConfig(guildId: string) {
    const guildConfig = this.guildsConfig.find(config => config.guildId === guildId)
    const defaultConfig = ConfigManager.getDefaultConfig()
    if (!guildConfig) {
      return defaultConfig
    }
    return { ...defaultConfig, ...guildConfig}
  }

  public static getDefaultConfig() {
    return this.defaultGuildConfig
  }

  public async createGuildConfig(config: GuildConfig) {
    const databaseManager = DatabaseManager.getInstance()
    await databaseManager.createOrUpdateGuild(config)
    this.guildsConfig.push(config)
  }

  private async loadGuildsConfig() {
    const databaseManager = DatabaseManager.getInstance()
    this.guildsConfig = await databaseManager.getAllGuildsConfigs()
  }

}

export default ConfigManager