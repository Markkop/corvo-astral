import mongoose from 'mongoose'
import GuildModel from '../models/guild'

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
    const guild = await GuildModel.findOneAndUpdate({ id: guildId }, { lang: options.lang }, {
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
 * @returns {Promise<object>}
 */
export async function getGuildOptions (guildId) {
  try {
    connectMongoose()
    const guildConfig = await GuildModel.find({ id: guildId })
    return guildConfig
  } catch (error) {
    console.log(error)
  }
}
