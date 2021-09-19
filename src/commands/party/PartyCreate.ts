import { PartyCommand } from '@baseCommands'
import { GuildConfig, PartialEmbed, PartyOptions } from '@types'
import { Message, TextChannel } from 'discord.js'
import askAndWaitForAnswer from '@utils/askAndWaitForAnswer'
import mappings from '@utils/mappings'
const { classEmoji } = mappings

export default class PartyCreateCommand extends PartyCommand {
  constructor (message: Message, guildConfig: GuildConfig) {
    super(message, guildConfig)
  }

  private async askOptions(): Promise<PartyOptions | undefined> {
    const partyChannel = this.getPartyChannel()
    if (!partyChannel) {
      await this.send("Oops, I couldn't find a Party Channel. Maybe you've forgotten to create one or misconfigured it on .config.")
      return undefined
    }

    const askNameText = ':label: Hey! Tell me the **title** you want for the group that will be listed.'
    const name = await askAndWaitForAnswer(askNameText, this.message)
    if (!name) return undefined

    if (name === 'skip') {
      await this.send('Nice try, but I really need a title.')
      return undefined
    }
    const askDescriptionText = ':speech_balloon: Cool. Any **description**? (this and the following answers are skippable by answering `skip`)'
    const description = await askAndWaitForAnswer(askDescriptionText, this.message)
    if (!description) return undefined

    const askDateText = ':calendar: Ok then. **When** it will be?'
    const date = await askAndWaitForAnswer(askDateText, this.message)
    if (!date) return undefined

    const askLevelText = ':skull: Which **level** or **level range** players will need to be to join it?'
    const level = await askAndWaitForAnswer(askLevelText, this.message)
    if (!level) return undefined

    const askSlotsText = ':small_orange_diamond: How many **slots** the party will have including you?'
    let slots = await askAndWaitForAnswer(askSlotsText, this.message)
    if (!slots) return undefined

    const slotsNumber = Number(slots)
    if (Number.isNaN(slotsNumber)) {
      slots = ''
    }

    return {
      name,
      description,
      date,
      level,
      slots
    }
  }

  private isSkip (text: string) {
    return text === 'skip'
  }

  public async execute (): Promise<void> {
    const options = await this.askOptions()
    if (!options.name) {
      return
    }

    const partyMessages = await this.getChannelParties()
    let identifier = 1
    if (partyMessages.size) {
      const lastPartyMessageSent = partyMessages.first()
      const lastPartyMessageEmbed = lastPartyMessageSent.embeds[0].fields.find(field => field.name.includes('ID'))
      identifier = Number(lastPartyMessageEmbed.value) + 1
    }
    
    const embed = this.mountPartyEmbed(identifier, options)
    const partyChannel = this.getPartyChannel() as TextChannel
    const sentMessage = await partyChannel.send({ embed })
    await this.message.react('⏳')
    await this.send(`:sunglasses: Your party has been listed on ${partyChannel.toString()}. Check it out!`)
    const classEmojis = Object.keys(classEmoji)
    for (let index = 0; index < classEmojis.length; index++) {
      await sentMessage.react(classEmojis[index])
    }
    await this.message.react('✅')
  }

  private mountPartyEmbed (identifier: number, options: PartyOptions): PartialEmbed {
    const maxSlots = 50
    let slots = 6
    if (!this.isSkip(options.slots) && options.slots) {
      slots = (Number(options.slots) >= maxSlots) ? maxSlots : Number(options.slots)
    }
    const memberSlots = Array(slots).fill(':small_orange_diamond:')
    memberSlots[0] = `:small_orange_diamond: <@${this.message.author.id}> | `
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
          value: this.isSkip(options.date) ? 'To be defined' : options.date,
          inline: true
        },
        {
          name: ':skull: Level',
          value: this.isSkip(options.level) ? '1-215' : options.level,
          inline: true
        },
        {
          name: ':busts_in_silhouette: Members',
          value: memberSlots.join('\n'),
          inline: false
        }
      ],
      footer: {
        text: `Created by ${this.message.author.username}`
      }
    } as PartialEmbed

    if (!this.isSkip(options.description)) {
      embed.description = options.description
    }

    return embed
  }
}
