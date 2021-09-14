import { PartyReactionCommand } from '@baseCommands'
import { GuildConfig } from '@types'
import { MessageEmbed, MessageReaction, User } from 'discord.js'
import mappings from '@utils/mappings'
const { classEmoji } = mappings

export default class PartyReaction extends PartyReactionCommand {
  private className: string

  constructor (reaction: MessageReaction, user: User, guildConfig: GuildConfig) {
    super(reaction, user, guildConfig)
  }

  private updateEmbedFieldByName(embed: MessageEmbed, fieldName: string, newValue: string) {
    const embedField = this.getEmbedFieldByName(embed, fieldName)
    embedField.value = newValue || embedField.value
    return embed
  }

  // Reuse this code in party update
  private updatePartyFieldByName(embed: MessageEmbed, partyFieldName: string, newValue: string) {
    const updatedEmbed = { ...embed } as MessageEmbed
    if (partyFieldName === 'name') {
      updatedEmbed.title = newValue ? `Party: ${newValue}` : embed.title
    } else if (partyFieldName === 'description') {
      updatedEmbed.description = newValue
    } else if (partyFieldName === 'date') {
      this.updateEmbedFieldByName(updatedEmbed, 'Date', newValue)
    } else if (partyFieldName === 'level') {
      this.updateEmbedFieldByName(updatedEmbed, 'Level', newValue)
    } else if (partyFieldName === 'members') {
      this.updateEmbedFieldByName(updatedEmbed, 'Members', newValue)
    }
    return updatedEmbed
  }

  private getUserJoinedRow(members: string, user: User) {
    return members.split('\n').find(member => member.includes(user.id))
  }

  private getUserJoinedClasses(memberRow: string): string[] {
    return memberRow.split('|')[1].split(',').map(word => word.trim()).filter(Boolean)
  }

  private async joinParty() {
    const partyMembers = this.getEmbedFieldByName(this.message.embeds[0], 'Members').value
    const isUserAlreadyMember = partyMembers.includes(this.user.id)
    if (isUserAlreadyMember) {
      const memberRow = this.getUserJoinedRow(partyMembers, this.user)
      const hasAlreadyJoinedWithClass = memberRow.includes(this.className)
      if (hasAlreadyJoinedWithClass) return

      const memberClasses = this.getUserJoinedClasses(memberRow)
      const hasReachedMaxClassesJoin = memberClasses.length >= 3
      if (hasReachedMaxClassesJoin) return

      memberClasses.push(this.className)
      const newMemberRow = memberClasses.join(', ')
      const newPartyMembers = partyMembers.replace(memberRow, `:small_orange_diamond:  <@${this.user.id}> | ${newMemberRow}`)
      const updatedEmbed = this.updatePartyFieldByName(this.message.embeds[0], 'members', newPartyMembers)
      const embed = { ...updatedEmbed }
      const newEmbed = new MessageEmbed(embed)
      await this.message.edit(newEmbed)
    } else {
      const partySlots = partyMembers.split('/n')
      const freeSlot = partySlots.find(slot => !slot.includes('@'))
      const freeSlotIndex = partySlots.indexOf(freeSlot)
      if (freeSlotIndex < 0) {
        return
      }

      partySlots[freeSlotIndex] = `:small_orange_diamond: <@${this.user.id}> | ${this.className}`
      const newPartySlots = partySlots.join('\n')
      const embedFields = this.message.embeds[0].fields.filter(field => !field.name.includes('Members'))
      const embed = {
        ...this.message.embeds[0],
        fields: [
          ...embedFields,
          {
            name: ':busts_in_silhouette: Members',
            value: newPartySlots
          }
        ]
      }
      const newEmbed = new MessageEmbed(embed)
      await this.message.edit(newEmbed)
    }  
  }

  private async leaveParty() {
    const partyMembers = this.getEmbedFieldByName(this.message.embeds[0], 'Members').value

    const memberRow = this.getUserJoinedRow(partyMembers, this.user)
    const hasAlreadyJoinedWithClass = memberRow.includes(this.className)
    if (hasAlreadyJoinedWithClass) {
      const memberClasses = this.getUserJoinedClasses(memberRow)
      const newMemberClasses = memberClasses.filter(memberClass => memberClass !== this.className)

      const hasLeftWithAllClasses = newMemberClasses.length <= 0
      if (hasLeftWithAllClasses) {
        const partySlots = partyMembers.split('/n')
        const userPartySlot = partySlots.find(slot => slot.includes(this.user.id))
        const userPartySlotIndex = partySlots.indexOf(userPartySlot)
        const newPartySlots = partySlots
        for (let index = userPartySlotIndex; index < partySlots.length; index++) {
          const nextPartySlot = partySlots[index + 1] || ''
          const nextPartySlotIsFullfulled = nextPartySlot.includes('@')
          if (nextPartySlotIsFullfulled) {
            newPartySlots[index] = nextPartySlot
          } else {
            newPartySlots[index] = ':small_orange_diamond:'
          }
        }

        this.message.embeds[0].fields.find(field => field.name.includes('Members')).value = newPartySlots.join('\n')

        const embed = { ...this.message.embeds[0] }
        const newEmbed = new MessageEmbed(embed)
        await this.message.edit(newEmbed)
        return
      }
      
      const newMemberRow = newMemberClasses.join(', ')
      const newPartyMembers = partyMembers.replace(memberRow, `:small_orange_diamond:  <@${this.user.id}> | ${newMemberRow}`)
      const updatedEmbed = this.updatePartyFieldByName(this.message.embeds[0], 'members', newPartyMembers)
      const embed = { ...updatedEmbed }
      const newEmbed = new MessageEmbed(embed)
      await this.message.edit(newEmbed)
    }
  }

  public async execute (action: 'join'|'leave'): Promise<void> {
    const partyId = this.getPartyId(this.message)
    if (!partyId) return

    const className = classEmoji[this.reaction.emoji.name]
    if (!className) return

    this.className = className

    if (action === 'join') {
      await this.joinParty()
      return
    }

    if (action === 'leave') {
      await this.leaveParty()
      return
    }
  }
}
