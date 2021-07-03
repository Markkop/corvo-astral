/* istanbul ignore file */
import { Schema, model, Document } from 'mongoose'
import { GuildConfig } from '../types'

interface GuildConfigModelInterface extends GuildConfig, Document {}

const GuildConfigSchema = new Schema<GuildConfigModelInterface>({
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
  },
  buildPreview: {
    type: String,
    validate: {
      validator: (option) => ['enabled', 'disabled'].some((validOption) => validOption === option),
      message: props => `${props.value} is not a valid option`
    }
  }
})

const GuildModel = model<GuildConfigModelInterface>('Guild', GuildConfigSchema)
export default GuildModel
