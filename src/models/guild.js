/* istanbul ignore file */
import mongoose from 'mongoose'

const GuildSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  lang: {
    type: String,
    validate: {
      validator: (lang) => ['en', 'pt', 'fr', 'es'].some((validLang) => validLang === lang),
      message: props => `${props.value} is not a valid language`
    }
  },
  almanaxChannel: {
    type: String
  },
  partyChannel: {
    type: String
  }
})

const Guild = mongoose.model('Guild', GuildSchema)
module.exports = Guild
