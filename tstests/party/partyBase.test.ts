import { PartyBaseCommand } from '../../tssrc/commands'
import PartyCreateCommand from '../../tssrc/commands/party/PartyCreate'
import PartyUpdateCommand from '../../tssrc/commands/party/PartyUpdate'
import { executeCommandAndSpySentMessage } from '../testutils'

jest.mock('../../tssrc/commands/party/PartyCreate')
jest.mock('../../tssrc/commands/party/PartyUpdate')

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