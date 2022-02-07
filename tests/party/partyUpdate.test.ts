import PartyUpdateCommand, { getData } from '../../src/commands/party/PartyUpdate'
import { 
  executeCommandWithMockOptionsAndSpyEdit, 
  embedContainingWithoutFetchReply, 
  getParsedCommand
} from '../testutils'

describe('PartyUpdateCommand', () => {
  const commandData = getData('en')

  it('updates a party listing with the new title', async () => {
    const stringCommand = '/party-update id: 2 name: newname'
    const command = getParsedCommand(stringCommand, commandData)

    const mockOptions = {
      command,
      partyChannel: {
        messages: [
          { id: 'existing-party-message-id-0',
            embed: {
              title: '<:dungeon:888873201512362035> Party: group2',
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

    
    const spy = await executeCommandWithMockOptionsAndSpyEdit(PartyUpdateCommand, mockOptions)
    expect(spy).toHaveBeenNthCalledWith(1, embedContainingWithoutFetchReply({
      title: '<:dungeon:888873201512362035> Party: newname'
    }))
  })
})
