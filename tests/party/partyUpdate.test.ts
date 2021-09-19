import PartyUpdateCommand from '../../src/commands/party/PartyUpdate'
import { 
  executeCommandWithMockOptionsAndSpyEdit,
} from '../testutils'
import askAndWaitForAnswer from '../../src/utils/askAndWaitForAnswer'

jest.mock('../../src/utils/askAndWaitForAnswer', () => jest.fn())

function mockAskAndWaitAnswers(answers: string[]) {
  answers.forEach(answer => {
    (askAndWaitForAnswer as jest.Mock).mockResolvedValueOnce(answer)
  })
}

describe('PartyUpdateCommand', () => {
  it('updates a party listing with the new title', async () => {
    const mockOptions = {
      message: {
        content: '.party create'
      },
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

    mockAskAndWaitAnswers(['2', 'name', 'newname'])
    const spy = await executeCommandWithMockOptionsAndSpyEdit(PartyUpdateCommand, mockOptions)
    expect(spy).toHaveBeenNthCalledWith(1, expect.objectContaining({
      title: '<:dungeon:888873201512362035> Party: newname'
    }))
  })
})
