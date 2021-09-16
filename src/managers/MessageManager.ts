import { Message } from 'discord.js'
import { CommandData, LanguageStrings } from '@types'

class MessageManager {
  public static getCommandWord (commandPrefix: string, message: Message): string {
    const messageContent = message.content
    const command = messageContent.split(' ')[0]
    return command.slice(commandPrefix.length)
  }

  public static getArgumentsAndOptions (message: Message, optionsConector = '='): CommandData {
    let messageContent = message.content.replace(/“|”/g, '"')
    const quoteOptions = messageContent.match(/(".*?")/g) || []
    quoteOptions.forEach(quoteOption => {
      const quoteOptionWithUnderscore = quoteOption.replace(/ /g, '_')
      messageContent = messageContent.replace(quoteOption, quoteOptionWithUnderscore)
    })
    const args = messageContent.split(' ').slice(1).filter(arg => !arg.includes(optionsConector))
    const options: Record<string, string> = messageContent.split(' ').slice(1).reduce((options, argument) => {
      if (!argument.includes(optionsConector)) {
        return options
      }
      const splittedArgument = argument.split(optionsConector)
      const argumentName = splittedArgument[0]
      const argumentValue = splittedArgument[1].replace(/_/g, ' ').replace(/"/g, '')
      return { ...options, [argumentName]: argumentValue }
    }, {})
    return { args, options }
  }

  public static async reactToMessage (reactions: string[], message: Message): Promise<void> {
    for (let index = 0; index < reactions.length; index++) {
      await message.react(reactions[index])
    }
  }

  public static convertToCodeBlock (text: string, codeBlockCharactersLength: number) {
    const textCharacters = String(text).split('')
    const whiteSpacesCharacters = Array(codeBlockCharactersLength).fill(' ')
    whiteSpacesCharacters.splice(0, textCharacters.length, ...textCharacters)
    return `\`${whiteSpacesCharacters.join('')}\``
  }

  // Check if it makes sense to have this method in this class
  public static guessLanguage (text: string, strObject: LanguageStrings) {
    return Object.entries(strObject).reduce((lang, [langEntry, nameEntry]) => {
      if (text.toLowerCase().includes(nameEntry.toLowerCase())) {
        return langEntry
      }
      return lang
    }, 'en')
  }
}

export default MessageManager
