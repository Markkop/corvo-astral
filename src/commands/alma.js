import events from '../../data/almanaxBonuses'

/**
 * Replies the user with current Almanax bonus.
 *
 * @param { import('discord.js').Message } message - Discord message object.
 */
export function getAlmanaxBonus (message) {
  const today = new Date(Date.now())
  const todayEvent = events.find(event => {
    const eventFirstDate = new Date(event.firstDate)
    const diffTime = Math.abs(today - eventFirstDate)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return diffDays % 5 === 0
  })
  if (!todayEvent) {
    message.reply('não consegui descobrir qual o alma de hoje, algo deu errado :C')
    return
  }
  const number = Math.floor(Math.random() * 3)
  const image = todayEvent.images[number]
  const embed = {
    color: '#40b2b5',
    title: todayEvent.name,
    description: 'Hoje o bônus do alma é: ' + todayEvent.text,
    image: { url: image },
    timestamp: new Date()
  }
  message.channel.send({ embed })
}
