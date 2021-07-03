export interface GuildConfig {
  guildId: string
  lang: string
  prefix: string
  almanaxChannel: string
  partyChannel: string
  buildPreview: string
}

export type DefaultGuildConfig = {
  lang: string
  prefix: string
  almanaxChannel: string
  partyChannel: string
  buildPreview: string
}