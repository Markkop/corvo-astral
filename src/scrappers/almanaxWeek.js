import puppeteer from 'puppeteer-extra'
import stealthPlugin from 'puppeteer-extra-plugin-stealth'
import { getWakfuBonus } from './almanax'

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
 * Get the Almanax Meridian Effert.
 *
 * @returns {string}
 */
function getAlmanaxDays () {
  return Array.from(document.querySelectorAll('.almanax_summary')).reduce((days, day) => {
    const date = day.querySelector('.title').innerText.trim()

    const repeatedDay = days.find(d => d.date === date)
    const event = day.querySelector('.special_day .m')
    if (repeatedDay && event) {
      const eventTitle = event.innerText
      const dayEvents = repeatedDay.events
      repeatedDay.events = dayEvents.concat(eventTitle)
      return days
    }
    const bossImage = day.querySelector('#almanax_boss_image img').getAttribute('src')

    const newDay = { date, bossImage }
    newDay.events = event ? [event.innerText] : []
    return days.concat(newDay)
  }, [])
}

/**
 * @typedef AlmanaxWeekData
 * @property {string} scrappedDate
 * @property {string} date
 * @property {object[]} days
 */

/**
 * Scraps almanax page.
 *
 * @param {object} page
 * @returns {Promise<AlmanaxWeekData>}
 */
async function getAlmanaxWeekData (page) {
  const scrappedDate = new Date().toLocaleString()
  const date = await page.evaluate(getAlmanaxDate)
  const days = await page.evaluate(getAlmanaxDays)
  days.forEach((day, index) => {
    const daysFromNow = index + 1
    const today = new Date(Date.now())
    const tomorrow = new Date(Date.now())
    const realDate = tomorrow.setDate(today.getDate() + daysFromNow)
    const wakfuBonus = getWakfuBonus(realDate)
    day.wakfuBonus = wakfuBonus
  })
  return {
    scrappedDate,
    date,
    days
  }
}

/**
 * Initate Almanax Scrapper.
 *
 * @returns {Promise<AlmanaxWeekData>} AlmanaxData.
 */
export default async function scrapAlmanaxWeek () {
  puppeteer.use(stealthPlugin())
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  })
  const page = await browser.newPage()
  await page.goto('http://www.krosmoz.com/en/almanax/semaine', { waitUntil: 'load', timeout: 0 })
  const almanax = await getAlmanaxWeekData(page)
  await browser.close()
  return almanax
}
