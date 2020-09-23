import { getArgumentsAndOptions, getCommand, setStartupConfig } from '../src/utils/message'
import { setLanguage } from '../src/utils/language'
import findPermutations from '../src/utils/permutateString'
import { handleMessageError, handleReactionError } from '../src/utils/handleError'
import { mockMessage } from './testUtils'

jest.mock('../src/utils/mongoose', () => ({
  getAllGuildsOptions: () => []
}))

describe('getArgumentsAndOptions', () => {
  it('get arguments and options correctly', () => {
    const message = { content: '.equip o eterno raridade=mítico' }
    const { args, options } = getArgumentsAndOptions(message, '=')
    expect(args).toEqual(['o', 'eterno'])
    expect(options).toEqual({ raridade: 'mítico' })
  })

  it('get options with quotes', () => {
    const message = { content: '.comando algum argumento opcao1="azul claro" opcao2="banana"' }
    const { args, options } = getArgumentsAndOptions(message, '=')
    expect(args).toEqual(['algum', 'argumento'])
    expect(options).toEqual({ opcao1: 'azul claro', opcao2: 'banana' })
  })

  it('get options with and without quotes', () => {
    const message = { content: '.comando algum argumento opcao1=azul opcao2="banana"' }
    const { args, options } = getArgumentsAndOptions(message, '=')
    expect(args).toEqual(['algum', 'argumento'])
    expect(options).toEqual({ opcao1: 'azul', opcao2: 'banana' })
  })

  it('get command correctly', () => {
    const message = { content: '.calc base 20 dmg 30 res 10' }
    const command = getCommand('.', message)
    expect(command).toEqual('calc')
  })
})

describe('findPermutations', () => {
  it('finds a permutation for a 4 character string', () => {
    const permutations = findPermutations('rgww')
    expect(permutations).toEqual(['rgww', 'rwgw', 'rwwg', 'grww', 'gwrw', 'gwwr', 'wrgw', 'wrwg', 'wgrw', 'wgwr', 'wwrg', 'wwgr'])
  })

  it("returns an empty array if it's more than 4 characters", () => {
    const permutations = findPermutations('relic')
    expect(permutations).toEqual([])
  })

  it('returns the same string if it has one character', () => {
    const permutations = findPermutations('a')
    expect(permutations).toEqual('a')
  })
})

describe('handleError functions', () => {
  it('handleMessageError calls console log', () => {
    const spy = jest.spyOn(global.console, 'log').mockImplementation()
    const message = mockMessage('')
    const error = { toString: jest.fn() }
    handleMessageError(error, message)
    expect(spy).toHaveBeenCalled()
  })

  it('handleReactionError calls console log', () => {
    const spy = jest.spyOn(global.console, 'log').mockImplementation()
    const reaction = { message: mockMessage('') }
    const user = { username: '' }
    const error = { toString: jest.fn() }
    handleReactionError(error, reaction, user)
    expect(spy).toHaveBeenCalled()
  })
})

describe('setLanguage', () => {
  it('returns the language provided', () => {
    const lang = setLanguage({ lang: 'pt' }, 100)
    expect(lang).toEqual('pt')
  })

  it('returns the default language if the provided is not valid', () => {
    const lang = setLanguage({ lang: 'idkman' }, 100)
    expect(lang).toEqual('en')
  })
})

describe('setStartupConfig', () => {
  it('calls console log', async () => {
    const spy = jest.spyOn(global.console, 'log').mockImplementation()
    await setStartupConfig()
    expect(spy).toHaveBeenCalled()
  })
})
