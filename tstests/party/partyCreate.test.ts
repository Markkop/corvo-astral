import PartyCreateCommand from '../../tssrc/commands/party/PartyCreate'
import { 
  executeCommandWithMockOptionsAndSpySentMessage, 
  executeCommandAndSpySentMessage, 
  embedContaining 
} from '../testutils'
import askAndWaitForAnswer from '../../tssrc/utils/askAndWaitForAnswer'

jest.mock('../../tssrc/utils/askAndWaitForAnswer', () => jest.fn())

function mockAskAndWaitAnswers(answers: string[]) {
  answers.forEach(answer => {
    (askAndWaitForAnswer as jest.Mock).mockResolvedValueOnce(answer)
  })
}

describe('PartyCreateCommand', () => {
  it('creates the first party message on the party channel if there is no party messages', async () => {
    mockAskAndWaitAnswers(['group1', 'skip', '10/10 21:00', '200', '6'])
    const spy = await executeCommandAndSpySentMessage(PartyCreateCommand, '.party create')
    expect(spy).toHaveBeenNthCalledWith(1, embedContaining({
      title: 'Party: group1',
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
    const mockOptions = {
      message: {
        content: '.party create'
      },
      partyChannel: {
        messages: [
          { embed: {
              title: 'Party: group2',
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

    mockAskAndWaitAnswers(['group3', 'skip', '10/10 21:00', '200', '6'])
    const spy = await executeCommandWithMockOptionsAndSpySentMessage(PartyCreateCommand, mockOptions)
    expect(spy).toHaveBeenCalledWith(embedContaining({
      fields: expect.arrayContaining([{
        name: ':label: ID',
        value: '3',
        inline: true
      }])
    }))
  })
})
