import { getParsedCommand } from "./testutils"
import { getData as getAboutData } from '../src/commands/About'
import { getData as getPartyCreateData } from '../src/commands/party/PartyCreate'

describe('Test utils', () => {
  it('getParsedCommand parses a command string with sub command as expected', () => {
    const commandData = {
      "name": "config",
      "description": "View or change bot configuration",
      "options": [
        {
          "type": 1,
          "name": "get",
          "description": "View bot configuration",
          "options": []
        },
        {
          "type": 1,
          "name": "set",
          "description": "Change bot configuration",
          "options": [
            {
              "name": "almanax-channel",
              "description": "The channel that will report the Almanax bonus daily",
              "required": false,
              "type": 7
            },
            {
              "name": "party-channel",
              "description": "The channel will contain the group listings",
              "required": false,
              "type": 7
            },
            {
              "name": "build-preview",
              "description": "Enables use of build preview ",
              "required": false,
              "type": 5
            },
            {
              "type": 3,
              "name": "lang",
              "description": "The language that will be used in searches and in command results",
              "required": false,
              "choices": [
                { "name": "en", "value": "en" },
                { "name": "fr", "value": "fr" },
                { "name": "pt", "value": "pt" },
                { "name": "es", "value": "es" }
              ]
            }
          ]
        }
      ]
    }

    const commandString = '/config set lang: en'
    const parsedCommand = getParsedCommand(commandString, commandData)
    const expected = {
      "id": "config",
      "name": "config",
      "type": 1,
      "options": [
        {
          "type": 1,
          "name": "set",
          "options": [{
            "value": "en",
            "type": 3,
            "name": "lang"
          }],
        }
      ]
    }
    expect(parsedCommand).toEqual(expected)
  })
  it('getParsedCommand parses a command string without subcommand as expected', () => {
    const commandData = getAboutData('en')
    const commandString = '/about lang: en'
    const parsedCommand = getParsedCommand(commandString, commandData)
    const expected = {
      name: 'about',
      id: 'about',
      type: 1,
      options: [{
        value: 'en',
        type: 3,
        name: 'lang'
      }]
    }
    expect(parsedCommand).toEqual(expected)
  })
  
  it('getParsedCommand parses a command string with : ', () => {
    const commandData = getPartyCreateData('en')
    const commandString = '/party-create name: group1 date: 10/10 21:00 level: 200 slots: 6'
    const parsedCommand = getParsedCommand(commandString, commandData)
    const expected = {
      type: 1,
      options: [
        { value: 'group1', type: 3, name: 'name' },
        { value: '10/10 21:00', type: 3, name: 'date' },
        { value: '200', type: 3, name: 'level' },
        { value: 6, type: 10, name: 'slots' }
      ],
      name: 'party-create',
      id: 'party-create'
    }
    expect(parsedCommand).toEqual(expected)
  })
})