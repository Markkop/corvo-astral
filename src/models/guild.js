import mongoose from 'mongoose'

const GuildSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  lang: {
    type: String,
    default: 'en',
    validate: {
      validator: (lang) => ['en', 'pt', 'fr', 'es'].some((validLang) => validLang === lang),
      message: props => `${props.value} is not a valid language`
    }
  }
})

const Guild = mongoose.model('Guild', GuildSchema)
module.exports = Guild
