const qtdColheita = {
  firstDate: '08/25/2020',
  name: 'Quantidade em Colheita',
  text: '+20% Quantidade de Colheita e Sucesso ao Plantar'
}
const sabedoria = { firstDate: '08/26/2020', name: 'Sabedoria', text: '+40 Sabedoria' }
const prospeccao = { firstDate: '08/27/2020', name: 'Prospecção', text: '+40 Prospecção' }
const fabricacao = {
  firstDate: '08/28/2020',
  name: 'Fabricação',
  text: '+20% EXP e Velocidade em Fabricação'
}
const expColheita = {
  firstDate: '08/29/2020',
  name: 'Experiência em Colheita',
  text: '+30% EXP em Colheita e Plantação'
}

const events = [qtdColheita, sabedoria, prospeccao, fabricacao, expColheita]

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
  message.reply(`o bônus do alma de hoje é ${todayEvent.text}`)
}
