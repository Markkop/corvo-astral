import PartyReaction from '../../src/commands/party/PartyReaction'
import { 
  executePartyReactionAndSpyEdit,
  fieldContainingValue,
  copy
} from '../testutils'

const mockOptions = {
  reaction: {
    emoji: '🥊',
    user: {
      id: 'user-id'
    },
  },
  partyChannel: {
    messages: [
      { id: 'existing-party-message-id-0',
        embed: {
          title: 'Party: group2',
          fields: [
            { name: ':label: ID', value: '2', inline: true },
            { name: ':calendar_spiral: Date', value: '10/10 21:00', inline: true },
            { name: ':skull: Level', value: '200', inline: true },
            { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@user-id> | \n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:' }
          ]
        }
      }
    ]
  }
}

describe('PartyReactionCommand', () => {
  describe('join action', () => {
    it('adds the party leader class to the party', async () => {
      const spy = await executePartyReactionAndSpyEdit(PartyReaction, 'join', mockOptions)
      expect(spy).toHaveBeenNthCalledWith(1, fieldContainingValue(':small_orange_diamond: <@user-id> | Iop'))
    })

    it('adds a second class to the same party member', async () => {
      const options = copy(mockOptions)
      options.partyChannel.messages[0].embed.fields[3].value = ':small_orange_diamond: <@user-id> | Eca \n:small_orange_diamond:'
      const spy = await executePartyReactionAndSpyEdit(PartyReaction, 'join', options)
      expect(spy).toHaveBeenNthCalledWith(1, fieldContainingValue(':small_orange_diamond: <@user-id> | Eca, Iop'))
    })

    it('adds a new member class to the party', async () => {
      const options = copy(mockOptions)
      options.partyChannel.messages[0].embed.fields[3].value = ':small_orange_diamond: <@user-id> | Eca \n:small_orange_diamond:'
      options.reaction.user.id = 'second-user-id'
      const spy = await executePartyReactionAndSpyEdit(PartyReaction, 'join', options)
      expect(spy).toHaveBeenNthCalledWith(1, fieldContainingValue(':small_orange_diamond: <@user-id> | Eca \n:small_orange_diamond: <@second-user-id> | Iop'))
    })
  })

  describe('leave action', () => {
    it('removes a class from a party member with two listed classes', async () => {
      const options = copy(mockOptions)
      options.partyChannel.messages[0].embed.fields[3].value = ':small_orange_diamond: <@user-id> | Eca, Iop \n:small_orange_diamond:'
      const spy = await executePartyReactionAndSpyEdit(PartyReaction, 'leave', options)
      expect(spy).toHaveBeenNthCalledWith(1, fieldContainingValue(':small_orange_diamond: <@user-id> | Eca'))
    })

    it('removes a member when removing its only listed class', async () => {
      const options = copy(mockOptions)
      options.partyChannel.messages[0].embed.fields[3].value = ':small_orange_diamond: <@user-id> | Eca \n:small_orange_diamond: <@second-user-id> | Iop'
      options.reaction.user.id = 'second-user-id'
      const spy = await executePartyReactionAndSpyEdit(PartyReaction, 'leave', options)
      expect(spy).toHaveBeenNthCalledWith(1, fieldContainingValue(':small_orange_diamond: <@user-id> | Eca'))
    })

    it('removes a member and moves the next filled slot to its place, leaving the last slot empty', async () => {
      const options = copy(mockOptions)
      options.partyChannel.messages[0].embed.fields[3].value = ':small_orange_diamond: <@user-id> | Eca \n:small_orange_diamond: <@second-user-id> | Iop \n:small_orange_diamond: <@third-user-id> | Osa '
      options.reaction.user.id = 'second-user-id'
      const spy = await executePartyReactionAndSpyEdit(PartyReaction, 'leave', options)
      expect(spy).toHaveBeenNthCalledWith(1, fieldContainingValue(':small_orange_diamond: <@user-id> | Eca \n:small_orange_diamond: <@third-user-id> | Osa \n:small_orange_diamond:'))
    })

  })
})
