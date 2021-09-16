import { GuildMember, Message, MessageReaction, User } from "discord.js"

class GroupFinder {
  public async getGroupList (message: Message, user: User) {
    if (user.bot) return {}
  
    const messageEmbed = message.embeds[0]
    if (!messageEmbed) return {}
  
    const listingGroupIdField = messageEmbed.fields.find(field => field.name.includes('ID'))
    if (!listingGroupIdField) return {}
    const listingGroupId = listingGroupIdField.value
  
    const listingGroupMembersField = messageEmbed.fields.find(field => field.name.includes('Members'))
    if (!listingGroupMembersField) return {}
    const members = listingGroupMembersField.value
  
    return { listingGroupId, members }
  }

  // Change the wait that partyList work so it doesnt depend on message. Adapter design pattern perhaps?
  // Refactor party commands with this approach so we can call party join action without passing message
  // public async joinPartyByReaction (reaction: MessageReaction, user: User, members: string, listingGroupId: string, className: string) {
  //   const isUserAlreadyMember = members.includes(user.id)
  //   const message = {
  //     client: reaction.message.client,
  //     author: user,
  //     react: () => {},
  //     channel: { send: () => {} },
  //     guild: reaction.message.guild
  //   }
  //   if (isUserAlreadyMember) {
  //     const memberRow = members.split('\n').find(member => member.includes(user.id))
  //     if (memberRow.includes(className)) return
  //     const memberClasses = memberRow.split('|')[1].split(',').map(word => word.trim()).filter(Boolean)
  //     if (memberClasses.length >= 3) return
  //     memberClasses.push(className)
  //     const newMemberRow = memberClasses.join(', ')
  //     message.content = `.party update id=${listingGroupId} class="${newMemberRow}" mode="legacy"`
  //   } else {
  //     message.content = `.party join id=${listingGroupId} class=${className}`
  //   }
  
  //   return partyList(message)
  // }
}

export default new GroupFinder()