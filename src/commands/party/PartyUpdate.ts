import { PartyCommand } from '@baseCommands'
import { GuildConfig, PartialEmbed } from '@types'
import { Collection, Interaction, Message, MessageEmbed } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import str from '@stringsLang'

export const getData = (lang: string) => new SlashCommandBuilder()
  .setName('party-update')
  .setDescription(str.partyUpdateCommandDescription[lang])
  .addNumberOption(option => option.setName('id').setDescription(str.partyIdCommandOptionDescription[lang]).setRequired(true))
  .addStringOption(option => option.setName('name').setDescription(str.partyNameCommandOptionDescription[lang]))
  .addStringOption(option => option.setName('description').setDescription(str.partyDescriptionCommandOptionDescription[lang]))
  .addStringOption(option => option.setName('date').setDescription(str.partyDateCommandOptionDescription[lang]))
  .addStringOption(option => option.setName('level').setDescription(str.partyLevelCommandOptionDescription[lang]))

export default class PartyUpdateCommand extends PartyCommand {
  constructor (interaction: Interaction, guildConfig: GuildConfig) {
    super(interaction, guildConfig)
  }

  private mountNoPartyFoundEmbed(): PartialEmbed {
    return {
      title: ':x: Error on using party command',
      description: 'No party message has been found on configured party listing channel'
    }
  }

  private getMessageByEmbedNameAndValue (messages: Collection<string, Message>, name: string, value: string) {
    return messages.find(message => {
      return message.embeds[0].fields.some(field => field.name.includes(name) && field.value === value)
    })
  }
  
  public async execute (): Promise<void> {
    if (!this.interaction.isCommand()) return
    const lang = this.interaction.options.getString('lang')

    if (lang) {
      this.changeLang(lang)
    }

    const partyMessages = await this.getChannelParties() 
    if (!partyMessages.size) {
      const notFoundEmbed = this.mountNoPartyFoundEmbed()
      await this.send({ embeds: [notFoundEmbed]})
    }

    const id = this.interaction.options.getNumber('id')
    if (!id) return

    const matchingParty = this.getMessageByEmbedNameAndValue(partyMessages, 'ID', String(id))
    if (!matchingParty) {
      await this.send("Are you sure? I haven't find any party within the last 100 parties.")
      return
    }

    const hasIdOption = Boolean(id)
    if (!hasIdOption) return

    const matchingPartyEmbed = matchingParty.embeds[0]
    const partySlotsField = this.getEmbedFieldByName(matchingPartyEmbed, 'Members')
    const partySlots = partySlotsField.value.split('\n')
    const userPartySlot = partySlots.find(slot => slot.includes(this.interaction.user.id))
    if (!userPartySlot) {
      await this.send("Soo.. er.. How can I say this? You are not in this party, I'm sorry")
      return 
    }

    const userPartySlotIndex = partySlots.indexOf(userPartySlot)
    const isPartyLeader = userPartySlotIndex === 0
    if (!isPartyLeader) {
      await this.send("You're not this party leader, so try asking them")
      return 
    }

    const name = this.interaction.options.getString('name')
    const description = this.interaction.options.getString('description')
    const date = this.interaction.options.getString('date')
    const level = this.interaction.options.getString('level')

    if (!name && !description && !date && !level) {
      await this.send("At least one option is requred")
      return
    }

    const options = {
      name,
      description,
      date,
      level,
    }

    const updatedEmbed = Object.entries(options).reduce((updatedEmbed, [key, value]) => {
      if (!value) return updatedEmbed
      return this.updatePartyFieldByName(updatedEmbed, key, value)
    }, matchingPartyEmbed)


    const embed = { ...updatedEmbed }
    const newEmbed = new MessageEmbed(embed)
    await this.send(`:sunglasses: All set! Check it out on ${matchingParty.channel.toString()}.`)
    await matchingParty.edit({embeds: [newEmbed]})
    return 
  }
}
