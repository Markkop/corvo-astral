/* istanbul ignore file */
import mongoose from 'mongoose'
import GuildModel from '../models/guild'
import config from '../config'

/**
 * Connects mongoose to remote MongoDB.
 */
export async function connectMongoose () {
  try {
    if (mongoose.connection.readyState === 0) {
      mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/test?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      })
    }
  } catch (error) {
    console.log(error)
  }
}

/**
 * Disconnects mongoose from remote MongoDB.
 */
export async function disconnectMongoose () {
  try {
    if (mongoose.connection.readyState === 1) {
      mongoose.disconnect()
    }
  } catch (error) {
    console.log(error)
  }
}

/**
 * Update or create a guild config.
 *
 * @param {string} guildId
 * @param {object} options
 * @returns {Promise<object>}
 */
export async function createOrUpdateGuild (guildId, options) {
  try {
    connectMongoose()
    const guild = await GuildModel.findOneAndUpdate({ id: guildId }, options, {
      new: true,
      upsert: true
    })
    await guild.save()
    return guild
  } catch (error) {
    console.log(error)
  }
}

/**
 * Get a guild config.
 *
 * @param {string} guildId
 * @returns {Promise<object|null>}
 */
export async function getGuildOptions (guildId) {
  try {
    connectMongoose()
    const [guildConfig] = await GuildModel.find({ id: guildId }).lean()
    const defaultConfig = config.defaultConfig
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

/**
 * Get all guilds config.
 *
 * @returns {Promise<object>}
 */
export async function getAllGuildsOptions () {
  try {
    connectMongoose()
    const allGuildsConfig = await GuildModel.find({})
    return allGuildsConfig
  } catch (error) {
    console.log(error)
  }
}
