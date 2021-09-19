import { PartyBaseCommand } from '../../src/commands'
import PartyCreateCommand from '../../src/commands/party/PartyCreate'
import PartyUpdateCommand from '../../src/commands/party/PartyUpdate'
import { executeCommandAndSpySentMessage } from '../testutils'

jest.mock('../../src/commands/party/PartyCreate')
jest.mock('../../src/commands/party/PartyUpdate')

describe('PartyBaseCommand', () => {
  it('calls PartyCreateCommand with .party create', async () => {
    const spy = executeCommandAndSpySentMessage(PartyBaseCommand, '.party create')
    expect(PartyCreateCommand).toHaveBeenCalled()
  })

  it('calls PartyUpdateCommand with .party update', async () => {
    const spy = executeCommandAndSpySentMessage(PartyBaseCommand, '.party update')
    expect(PartyUpdateCommand).toHaveBeenCalled()
  })
})