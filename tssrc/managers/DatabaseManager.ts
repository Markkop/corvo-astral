import { connection, connect } from 'mongoose'
import { ConfigManager } from '@managers'
import { GuildConfig } from '@types'
import GuildModel from '../models/guild'

export default class DatabaseManager {
  private static instance: DatabaseManager;

  public static getInstance (): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager()
    }

    return DatabaseManager.instance
  }

  private async connectDatabase () {
    try {
      if (connection.readyState === 0) {
        connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/test?retryWrites=true&w=majority`, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async createOrUpdateGuild (guildConfig: GuildConfig): Promise<GuildConfig> {
    try {
      await this.connectDatabase()
      const guild = await GuildModel.findOneAndUpdate({ id: guildConfig.id }, guildConfig, {
        new: true,
        upsert: true
      })
      await guild.save()
      return guild
    } catch (error) {
      console.log(error)
    }
  }

  public async getGuildConfig (guildId: string): Promise<GuildConfig> {
    try {
      await this.connectDatabase()
      const [guildConfig] = await GuildModel.find({ id: guildId }).lean()
      const defaultConfig = ConfigManager.getDefaultConfig()
      if (!guildConfig) {
        return null
      }
      const configs = {
        ...defaultConfig,
        ...guildConfig
      }
      return configs
    } catch (error) {
      console.log(error)
    }
  }

  public async getAllGuildsConfigs (): Promise<GuildConfig[]> {
    try {
      await this.connectDatabase()
      const allGuildsConfig = await GuildModel.find({}).lean()
      return allGuildsConfig
    } catch (error) {
      console.log(error)
    }
  }
}
