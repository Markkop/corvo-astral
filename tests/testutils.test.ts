import { getParsedCommand } from "./testutils"
import { getData } from '../src/commands/About'

describe('Test utils', () => {
  it('parses a command string  with sub command as expected', () => {
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
  it('parses a command string without subcommand as expected', () => {
    const commandData = getData('en')
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
})