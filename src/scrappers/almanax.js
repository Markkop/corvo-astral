import puppeteer from 'puppeteer'
import events from '../../data/almanaxBonuses'

/**
 * Get Wakfu Almanax Bonus.
 *
 * @param day
 * @returns {object}
 */
export function getWakfuBonus (day) {
  day = day || new Date(Date.now())
  return events.find(event => {
    const eventFirstDate = new Date(event.firstDate)
    const diffTime = Math.abs(day - eventFirstDate)
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
 * Get the Almanax Event.
 *
 * @returns {Entity}
 */
function getAlmanaEvent () {
  const eventElement = document.querySelector('#almanax_event')
  if (!eventElement) {
    return {}
  }
  const eventText = eventElement.querySelector('#almanax_event_desc').innerText.split('\n')
  const eventTitle = eventText[0]
  const eventDescription = eventText[1]
  const imageUrl = eventElement.querySelector('img').getAttribute('src')
  return { title: eventTitle, description: eventDescription, imageUrl }
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
 * @param {object} wakfuBonus
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

    if (game === 'wakfu') {
      almanaxDailies[propertyName] = {
        bonus: {
          title: bonusTitle,
          description: wakfuBonus.text.en,
          wakfuBonus
        }
      }
    } else {
      almanaxDailies[propertyName] = {
        bonus: {
          title: bonusTitle,
          description: bonusDescription
        }
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
  const date = new Date()
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
 * @property {Entity} event
 * @property {string} trivia
 * @property {string} meridianEffect
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
  const scrappedDate = new Date().toLocaleString()
  const date = await page.evaluate(getAlmanaxDate)
  const boss = await page.evaluate(getAlmanaxBoss)
  const protector = await page.evaluate(getAlmanaxProtector)
  const zodiac = await page.evaluate(getAlmanaxZodiac)
  const event = await page.evaluate(getAlmanaEvent)
  const trivia = await page.evaluate(getAlmanaxTrivia)
  const meridianEffect = await page.evaluate(getAlmanaxMeridianEffect)
  const daily = await page.evaluate(getAlmanaxDailies, getWakfuBonus())
  return {
    scrappedDate,
    date,
    boss,
    protector,
    zodiac,
    event,
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
