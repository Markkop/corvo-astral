import { getArguments, getCommand } from '../src/utils/message'

describe('getArguments', () => {
  it('get arguments correctly', () => {
    const message = { content: '!calc base 20 dmg 30 res 10' }
    const args = getArguments(message)
    expect(args).toEqual(['base', '20', 'dmg', '30', 'res', '10'])
  })

  it('get command correctly', () => {
    const message = { content: '!calc base 20 dmg 30 res 10' }
    const command = getCommand('!', message)
    expect(command).toEqual('calc')
  })
})
