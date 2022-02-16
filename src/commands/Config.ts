import { BaseCommand } from '@baseCommands'
import { ConfigManager } from '@managers'
import { GuildConfig } from '@types'
import { Interaction, Permissions } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import str from '@stringsLang'
import { addStringOptionWithLanguageChoices, registerCommands } from '@utils/registerCommands'

export const getData = (lang: string) => new SlashCommandBuilder()
  .setName('config')
  .setDescription(str.configCommandDescription[lang])
  .addSubcommand(subcommand =>
		subcommand
			.setName('get')
			.setDescription(str.getConfigCommandDescription[lang]))
	.addSubcommand(subcommand => {
		subcommand
			.setName('set')
			.setDescription(str.setConfigCommandDescription[lang])
      .addChannelOption(option => option.setName('almanax-channel').setDescription(str.almanaxChannelConfigCommandOptionDescription[lang]))
      .addChannelOption(option => option.setName('party-channel').setDescription(str.partyChannelConfigCommandOptionDescription[lang]))
      .addBooleanOption(option => option.setName('build-preview').setDescription(str.buildPreviewConfigCommandOptionDescription[lang]))
    addStringOptionWithLanguageChoices(subcommand, 'lang', str.langConfigCommandOptionDescription[lang])
    return subcommand
  })

export default class ConfigCommand extends BaseCommand {
  constructor (interaction: Interaction, guildConfig: GuildConfig) {
    super(interaction, guildConfig)
  }

  public async execute (): Promise<void> {
    if (!this.interaction.isCommand()) return

    const guildId = String(this.interaction.guild.id)
    if (this.interaction.options.getSubcommand() === 'set') {
      const userPermissions = this.interaction.member.permissions as Permissions
      if (!userPermissions.has(Permissions.ALL)) {
        this.send('You need administrator permission for this')
        return 
      }
      
      const lang = this.interaction.options.getString('lang')
      if (lang && !this.isValidLang(lang)) {
        this.send(`${lang} is not a valid language.`)
        return 
      }

      const configManager = ConfigManager.getInstance()
      const currentConfig = configManager.getGuildConfig(guildId)
      
      const almanaxChannel = this.interaction.options.getChannel('almanax-channel')
      const partyChannel = this.interaction.options.getChannel('party-channel')
      const buildPreview = this.interaction.options.getBoolean('build-preview')
      const hasBuildPreviewOption = typeof buildPreview === 'boolean'
      const buildPreviewOption = buildPreview ? 'enabled' : 'disabled'

      if(!lang && !almanaxChannel && !partyChannel && !hasBuildPreviewOption) {
        this.send('At least one option is required')
        return
      }

      const newConfig = {
        id: guildId,
        prefix: currentConfig.prefix,
        lang: lang || currentConfig.lang,
        almanaxChannel: almanaxChannel?.name || currentConfig.almanaxChannel,
        partyChannel: partyChannel?.name || currentConfig.partyChannel,
        buildPreview: hasBuildPreviewOption ? buildPreviewOption : currentConfig.buildPreview,
      }

      await configManager.updateGuildConfig(newConfig)
      const configEmbed = this.mountConfigEmbed('Config updated', newConfig)
      registerCommands(this.interaction.client, guildId, newConfig, this.interaction.guild.name)
      await this.send({ embeds: [configEmbed] })
      return
    }

    const configManager = ConfigManager.getInstance()
    const currentConfig = configManager.getGuildConfig(guildId)
    if (!currentConfig) {
      const configEmbed = this.mountConfigEmbed('No custom config found. Using default', ConfigManager.getDefaultConfig())
      this.send({ embeds: [configEmbed] })
      return
    }
    const configEmbed = this.mountConfigEmbed(`Config for "${this.interaction.guild.name}"`, currentConfig)
    this.send({ embeds: [configEmbed] })
    return
  }

  private mountConfigEmbed (title, config) {
    const guildConfigText = JSON.stringify(config, null, 2)
    return {
      title,
      description: '```json\n' + guildConfigText + '\n```'
    }
  }
}
