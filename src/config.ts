import { GuildConfig, DefaultGuildConfig } from './types'
import DatabaseManager from './databaseManager'

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
    return this.guildsConfig.find(guildConfig => guildConfig.guildId === guildId)
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