import { PartyCommand } from '@baseCommands'
import { GuildConfig, PartialEmbed, PartyOptions } from '@types'
import { Interaction, TextChannel } from 'discord.js'
import mappings from '@utils/mappings'
import { SlashCommandBuilder } from '@discordjs/builders'
import str from '@stringsLang'
const { classEmoji } = mappings

export const getData = (lang: string) => new SlashCommandBuilder()
  .setName('party-create')
  .setDescription(str.partyCreateCommandDescription[lang])
  .addStringOption(option => option.setName('name').setDescription(str.partyNameCommandOptionDescription[lang]).setRequired(true))
  .addStringOption(option => option.setName('description').setDescription(str.partyDescriptionCommandOptionDescription[lang]))
  .addStringOption(option => option.setName('date').setDescription(str.partyDateCommandOptionDescription[lang]))
  .addStringOption(option => option.setName('level').setDescription(str.partyLevelCommandOptionDescription[lang]))
  .addNumberOption(option => option.setName('slots').setDescription(str.partySlotsCommandOptionDescription[lang]))


export default class PartyCreateCommand extends PartyCommand {
  constructor (interaction: Interaction, guildConfig: GuildConfig) {
    super(interaction, guildConfig)
  }

  public async execute (): Promise<void> {
    if (!this.interaction.isCommand()) return
    const lang = this.interaction.options.getString('lang')

    if (lang) {
      this.changeLang(lang)
    }

    const partyChannel = this.getPartyChannel() as TextChannel
    if (!partyChannel) {
      await this.send("Oops, I couldn't find a Party Channel. Maybe you've forgotten to create one or misconfigured it on /config.")
      return undefined
    }

    const partyMessages = await this.getChannelParties()
    let identifier = 1
    if (partyMessages.size) {
      const lastPartyMessageSent = partyMessages.first()
      const lastPartyMessageEmbed = lastPartyMessageSent.embeds[0].fields.find(field => field.name.includes('ID'))
      identifier = Number(lastPartyMessageEmbed.value) + 1
    }

    const name = this.interaction.options.getString('name')
    const description = this.interaction.options.getString('description') || ''
    const date = this.interaction.options.getString('date') || 'To be defined'
    const level = this.interaction.options.getString('level') || '1-215' 
    const slots = this.interaction.options.getNumber('slots') || 6

    const options = {
      name,
      description,
      date,
      level,
      slots: String(slots)
    }
    
    const embed = this.mountPartyEmbed(identifier, options)
    const sentMessage = await partyChannel.send({ embeds: [embed] })
    await this.send(`:sunglasses: Your party has been listed on ${partyChannel.toString()}. Check it out!`)
    const classEmojis = Object.keys(classEmoji)
    for (let index = 0; index < classEmojis.length; index++) {
      await sentMessage.react(classEmojis[index])
    }
  }

  private mountPartyEmbed (identifier: number, options: PartyOptions): PartialEmbed {
    const maxSlots = 50
    let slots = 6
    if (options.slots) {
      slots = (Number(options.slots) >= maxSlots) ? maxSlots : Number(options.slots)
    }
    const memberSlots = Array(slots).fill(':small_orange_diamond:')
    memberSlots[0] = `:small_orange_diamond: <@${this.interaction.user.id}> | `
    const embed = {
      title: `<:dungeon:888873201512362035> Party: ${options.name}`,
      fields: [
        {
          name: ':label: ID',
          value: String(identifier),
          inline: true
        },
        {
          name: ':calendar_spiral: Date',
          value: options.date,
          inline: true
        },
        {
          name: ':skull: Level',
          value: options.level,
          inline: true
        },
        {
          name: ':busts_in_silhouette: Members',
          value: memberSlots.join('\n'),
          inline: false
        }
      ],
      footer: {
        text: `Created by ${this.interaction.user.username}`
      }
    } as PartialEmbed

    if (options.description) {
      embed.description = options.description
    }

    return embed
  }
}
