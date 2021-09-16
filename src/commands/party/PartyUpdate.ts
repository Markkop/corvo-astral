import { PartyCommand } from '@baseCommands'
import { GuildConfig } from '@types'
import { Collection, Message, MessageEmbed } from 'discord.js'
import askAndWaitForAnswer from '@utils/askAndWaitForAnswer'

export default class PartyUpdateCommand extends PartyCommand {
  constructor (message: Message, guildConfig: GuildConfig) {
    super(message, guildConfig)
  }

  private mountNoPartyFoundEmbed() {
    return {
      embed: {
        color: '#bb1327',
        title: ':x: Error on using party command',
        description: 'No party message has been found on configured party listing channel'
      }
    }
  }

  private getMessageByEmbedNameAndValue (messages: Collection<string, Message>, name: string, value: string) {
    return messages.find(message => {
      return message.embeds[0].fields.some(field => field.name.includes(name) && field.value === value)
    })
  }
  
  public async execute (): Promise<void> {
    const partyMessages = await this.getChannelParties() 
    if (!partyMessages.size) {
      await this.send(this.mountNoPartyFoundEmbed())
    }

    const askIdText = 'Oh, you again? First tell me the :label: **ID** from the party you want to update.'
    const id = await askAndWaitForAnswer(askIdText, this.message)
    if (!id) return

    const matchingParty = this.getMessageByEmbedNameAndValue(partyMessages, 'ID', id)
    if (!matchingParty) {
      await this.send("Are you sure? I haven't find any party within the last 100 parties.")
      return
    }

    const hasIdOption = Boolean(id)
    if (!hasIdOption) return

    const matchingPartyEmbed = matchingParty.embeds[0]
    const partySlotsField = this.getEmbedFieldByName(matchingPartyEmbed, 'Members')
    const partySlots = partySlotsField.value.split('\n')
    const userPartySlot = partySlots.find(slot => slot.includes(this.message.author.id))
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

    const changeOptions = ['name', 'description', 'date', 'level']
    const changeOptionsText = changeOptions.join(', ')
    const askChangeText = `Cool, I've found the party. What do you want to change? (${changeOptionsText})`
    const content = await askAndWaitForAnswer(askChangeText, this.message)
    if (!content) return

    const isValidContent = changeOptions.includes(content)
    if (!isValidContent) {
      await this.send(`Sorry, buddy. But I can only change ${changeOptionsText}`)
      return 
    }

    const askNewContent = `Right, so what's the new value for **${content}**?`
    const newContent = await askAndWaitForAnswer(askNewContent, this.message)
    if (!newContent) return

    const updatedEmbed = this.updatePartyFieldByName(matchingPartyEmbed, content, newContent)

    const embed = { ...updatedEmbed }
    const newEmbed = new MessageEmbed(embed)
    await this.send(`:sunglasses: All set! Check it out on ${matchingParty.channel.toString()}.`)
    await matchingParty.edit(newEmbed)
    return 
  }
}
