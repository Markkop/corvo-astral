import puppeteer from 'puppeteer'

const events = [
  {
    firstDate: '08/25/2020',
    text: {
      en: '+ 20% Amount of Harvest and Success when Planting',
      pt: '+ 20% Quantidade de Colheita e Sucesso ao Plantar',
      fr: '+ 20% de récolte et de succès lors de la plantation',
      es: '+ 20% de cantidad de cosecha y éxito al plantar'
    }
  },
  {
    firstDate: '08/26/2020',
    text: {
      en: '+40 Wisdom',
      pt: '+40 Sabedoria',
      fr: '+40 de sagesse',
      es: '+40 sabiduría'
    }
  },
  {
    firstDate: '08/27/2020',
    text: {
      en: '+40 Prospecting',
      pt: '+40 Prospecção',
      fr: '+40 Prospection',
      es: '+40 prospección'
    }
  },
  {
    firstDate: '08/28/2020',
    text: {
      en: '+ 20% EXP and Manufacturing Speed',
      pt: '+ 20% EXP e Velocidade em Fabricação',
      fr: '+ 20% EXP et vitesse de fabrication',
      es: '+ 20% EXP y velocidad de fabricación'
    }
  },
  {
    firstDate: '08/29/2020',
    text: {
      en: '+ 30% EXP in Harvest and Plantation',
      pt: '+ 30% EXP em Colheita e Plantação',
      fr: "+ 30% d'EXP en récolte et plantation",
      es: '+ 30% EXP en cosecha y plantación'
    }
  }
]

/**
 * Get Wakfu Almanax Bonus.
 *
 * @returns {object}
 */
function getWakfuBonus () {
  const today = new Date(Date.now())
  return events.find(event => {
    const eventFirstDate = new Date(event.firstDate)
    const diffTime = Math.abs(today - eventFirstDate)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return diffDays % 5 === 0
  })
}

/**
 * Get the Almanax Boss.
 *
 * @returns {object}
 */
function getAlmanaxBoss () {
  const almanaxBoss = document.querySelector('#almanax_boss_desc').innerText
  const almanaxInfo = almanaxBoss.split('\n')
  const almanaxBossTitle = almanaxInfo[0]
  const almanaxBossDescription = almanaxInfo[1]
  const imageUrl = document.querySelector('#almanax_boss_image img').getAttribute('src')
  return { title: almanaxBossTitle, description: almanaxBossDescription, imageUrl }
}
/**
 * Get the Almanax Protector (month).
 *
 * @returns {object}
 */
function getAlmanaxProtector () {
  const protectorTitle = document.querySelector('#almanax_protector .protector_more .title').innerText
  const protectorDescription = document.querySelector('#almanax_protector .protector_more .desc').innerText.trim()
  const imageUrl = document.querySelector('#almanax_protector img').getAttribute('src')
  return { title: protectorTitle, description: protectorDescription, imageUrl }
}
/**
 * Get the Almanax Zodiac.
 *
 * @returns {object}
 */
function getAlmanaxZodiac () {
  const zodiacTitle = document.querySelector('#almanax_zodiac .zodiac_more .title').innerText
  const zodiacDescription = document.querySelector('#almanax_zodiac .zodiac_more .desc').innerText.trim()
  const imageUrl = document.querySelector('#almanax_zodiac img').getAttribute('src')
  return { title: zodiacTitle, description: zodiacDescription, imageUrl }
}

/**
 * Get the Almanax Quests and Bonuses.
 *
 * @param {string} wakfuBonus
 * @returns {object}
 */
function getAlmanaxDailies (wakfuBonus) {
  const games = ['wakfu', 'dofus', 'dofus touch']
  const dailies = Array.from(document.querySelectorAll('.achievement'))
  const almanaxDailies = {}
  for (let index = 0; index < games.length; index++) {
    const game = games[index]
    const daily = dailies.find(dailyElement => dailyElement.querySelector('.top h4').innerText.toLowerCase().includes(game))
    if (!daily) {
      continue
    }
    const propertyName = game === 'dofus touch' ? 'dofusTouch' : game
    const dailyInfo = daily.querySelector('.achievement .mid').innerText.split('\n').filter(Boolean)
    const bonusTitle = dailyInfo[0]
    const bonusDescription = dailyInfo[1]
    const questTitle = dailyInfo[2]
    const questDescription = dailyInfo[3]

    const description = game === 'wakfu' ? wakfuBonus : bonusDescription
    almanaxDailies[propertyName] = {
      bonus: {
        title: bonusTitle,
        description: description
      }
    }
    if (questTitle) {
      almanaxDailies[propertyName].quest = {
        title: questTitle,
        description: questDescription,
        imageUrl: daily.querySelector('.achievement .mid img').getAttribute('src')
      }
    }
  }

  return almanaxDailies
}

/**
 * Get the Almanax Date.
 *
 * @returns {object}
 */
function getAlmanaxDate () {
  var date = new Date()
  date.setFullYear(date.getFullYear() - 1043)
  const year = date.getFullYear()
  const day = document.querySelector('#almanax_day .day-number').innerText
  const month = document.querySelector('#almanax_day .day-text').innerText
  const season = document.querySelector('#almanax').className
  return { day, month, year, season }
}

/**
 * Get the Almanax Trivia.
 *
 * @returns {string}
 */
function getAlmanaxTrivia () {
  const trivia = document.querySelector('#almanax_rubrikabrax').innerText
  return trivia.split('\n')[1]
}

/**
 * Get the Almanax Meridian Effert.
 *
 * @returns {string}
 */
function getAlmanaxMeridianEffect () {
  return document.querySelector('#almanax_meryde_effect p ').innerText
}

/**
 * @typedef AlmanaxData
 * @property {string} scrappedDate
 * @property {object} date
 * @property {string} date.day
 * @property {string} date.month
 * @property {string} date.season
 * @property {Entity} boss
 * @property {Entity} protector
 * @property {Entity} zodiac
 * @property {string} trivia
 * @property {Daily} wakfu
 * @property {Daily} dofus
 * @property {Daily} dofusTouch
 *
 * @typedef Entity
 * @property {string} title
 * @property {string} description
 * @property {string} imageUrl
 *
 * @typedef Daily
 * @property {object} daily
 * @property {string} daily.title
 * @property {string} daily.description
 * @property {object} [quest]
 * @property {string} quest.title
 * @property {string} quest.description
 */

/**
 * Scraps almanax page.
 *
 * @param {object} page
 * @returns {AlmanaxData}
 */
async function getAlmanaxData (page) {
  const date = await page.evaluate(getAlmanaxDate)
  const boss = await page.evaluate(getAlmanaxBoss)
  const protector = await page.evaluate(getAlmanaxProtector)
  const zodiac = await page.evaluate(getAlmanaxZodiac)
  const trivia = await page.evaluate(getAlmanaxTrivia)
  const scrappedDate = new Date().toLocaleString()
  const meridianEffect = await page.evaluate(getAlmanaxMeridianEffect)
  const daily = await page.evaluate(getAlmanaxDailies, getWakfuBonus().text.en)
  return {
    scrappedDate,
    date,
    boss,
    protector,
    zodiac,
    trivia,
    meridianEffect,
    daily
  }
}

/**
 * Initate Almanax Scrapper.
 *
 * @param {number} timestamp
 * @returns {Promise<AlmanaxData>} AlmanaxData.
 */
export default async function scrapAlmanax (timestamp) {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  })
  const page = await browser.newPage()
  let date = ''
  if (timestamp) {
    date = new Date(timestamp).toISOString().split('T')[0]
  }
  await page.goto(`http://www.krosmoz.com/en/almanax/${date}`, { waitUntil: 'load', timeout: 0 })
  const almanax = await getAlmanaxData(page)
  await browser.close()
  return almanax
}
