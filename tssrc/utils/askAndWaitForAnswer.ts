import { Message } from "discord.js"

export default async function askAndWaitForAnswer (questionText: string, message: Message, noResponseText?: string): Promise<string | null> {
  try {
    await message.channel.send(questionText)
    const filterMessagesByAuthorId = (newMessage: Message) => newMessage.author.id === message.author.id
    const waitTime = 90 * 1000
    const waitConfig = {
      max: 1,
      time: waitTime,
      errors: ['time']
    }
    const awaitedMessages = await message.channel.awaitMessages(filterMessagesByAuthorId, waitConfig)
    const answerMessage = awaitedMessages.first()
    return answerMessage.content
  } catch (error) {
    await message.channel.send(noResponseText || 'Nevermind then')
    return null
  }
}