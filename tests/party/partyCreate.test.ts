import PartyCreateCommand, { getData } from '../../src/commands/party/PartyCreate'
import { 
  executeCommandWithMockOptionsAndSpySentMessage, 
  embedContainingWithoutFetchReply, 
  getParsedCommand
} from '../testutils'


describe('PartyCreateCommand', () => {
  const commandData = getData('en')

  it('creates the first party message on the party channel if there is no party messages', async () => {
    const stringCommand = '/party-create name: group1 date: 10/10 21:00 level: 200 slots: 6'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandWithMockOptionsAndSpySentMessage(PartyCreateCommand, {command})
    expect(spy).toHaveBeenNthCalledWith(1, embedContainingWithoutFetchReply({
      title: '<:dungeon:888873201512362035> Party: group1',
      fields: [
        { name: ':label: ID', value: '1', inline: true },
        { name: ':calendar_spiral: Date', value: '10/10 21:00', inline: true },
        { name: ':skull: Level', value: '200', inline: true },
        { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@user-id> | \n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:', inline: false }
      ],
      footer: {
        text: "Created by USERNAME"
      }
    }))
  })

  it('creates a party listing with the next identifier', async () => {
    const stringCommand = '/party-create name: group3 date: 10/10 21:00 level: 200 slots: 6'
    const command = getParsedCommand(stringCommand, commandData)
    const mockOptions = {
      command,
      partyChannel: {
        messages: [
          { embed: {
              title: '<:dungeon:888873201512362035> Party: group2',
              fields: [
                { name: ':label: ID', value: '2', inline: true },
                { name: ':calendar_spiral: Date', value: '10/10 21:00', inline: true },
                { name: ':skull: Level', value: '200', inline: true },
                { name: ':busts_in_silhouette: Members', value: ':small_orange_diamond: <@111> | \n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:\n:small_orange_diamond:' }
              ]
            }
          }
        ]
      }
    }

    const spy = await executeCommandWithMockOptionsAndSpySentMessage(PartyCreateCommand, mockOptions)
    expect(spy).toHaveBeenCalledWith(embedContainingWithoutFetchReply({
      fields: expect.arrayContaining([{
        name: ':label: ID',
        value: '3',
        inline: true
      }])
    }))
  })
})
