import { connection, connect, disconnect } from 'mongoose'
import ConfigManager from './ConfigManager'
import { GuildConfig } from './types'
import GuildModel from './models/guild'

export default class DatabaseManager {
  private constructor() {}
  private static instance: DatabaseManager;

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }

    return DatabaseManager.instance;
  }

  private async connectDatabase() {
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

  public async createOrUpdateGuild (guildConfig: GuildConfig) {
    try {
      await this.connectDatabase()
      const guild = await GuildModel.findOneAndUpdate({ id: guildConfig.guildId }, guildConfig, {
        new: true,
        upsert: true
      })
      await guild.save()
      return guild
    } catch (error) {
      console.log(error)
    }
  }

  public async getGuildConfig (guildId: string) {
    try {
      await this.connectDatabase()
      const [guildConfig] = await GuildModel.find({ id: guildId }).lean()
      const defaultConfig = ConfigManager.getDefaultConfig()
      if (!guildConfig) {
        return null
      }
      delete guildConfig._id
      delete guildConfig.__v
      delete guildConfig.id
      const configs = {
        ...defaultConfig,
        ...guildConfig
      }
      return configs
    } catch (error) {
      console.log(error)
    }
  }

  public async getAllGuildsConfigs () {
    try {
      await this.connectDatabase()
      const allGuildsConfig = await GuildModel.find({}).lean()
      return allGuildsConfig
    } catch (error) {
      console.log(error)
    }
  }
}