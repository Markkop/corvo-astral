import puppeteer from 'puppeteer'

const encyclopedia = {
  fr: 'encyclopedie',
  pt: 'enciclopedia',
  es: 'enciclopedia',
  en: 'encyclopedia'
}

const monsters = {
  fr: 'monstres',
  pt: 'monstros',
  es: 'monstruos',
  en: 'monsters'
}

/**
 * Scrap drop information from item.
 *
 * @returns {object}
 */
function scrapMonsterSearch () {
  const hasNoResultsElements = document.querySelector('.ak-list-info-no-item')
  if (hasNoResultsElements) {
    return []
  }

  const monsterResultsElements = Array.from(document.querySelectorAll('.ak-table tbody tr'))
  if (!monsterResultsElements.length) {
    return []
  }

  return monsterResultsElements.map(element => {
    const nameElement = element.querySelector('td:nth-child(2) a')
    const name = nameElement.innerText
    const idMatch = nameElement.href.match(/([0-9]+)/)
    const id = idMatch[1]
    const familyElement = element.querySelector('td:nth-child(3)')
    const family = familyElement.innerText
    const levelElement = element.querySelector('td:nth-child(5)')
    const levelText = levelElement.innerText || ' '
    const level = levelText.split(' ')[1].trim()
    return { name, family, level, id }
  })
}

/**
 * @typedef Monster
 * @property {string} name
 * @property {string} url
 * @property {string} image
 * @property {TextDetail} level
 * @property {TextDetail} family
 * @property {MonsterDetails} stats
 * @property {MonsterDetails} resists
 * @property {string[]} drops
 * @property {string[]} spells
 */

/**
 * @typedef TextDetail
 * @property {string} title
 * @property {string} value
 */

/**
 * @typedef MonsterDetails
 * @property {string} title
 * @property {string[]} details
 */

/**
 * Scrap monster data from its page.
 *
 * @returns {Monster}
 */
function scrapMonster () {
  /**
   * @param {HTMLElement} element
   * @returns {TextDetail}
   */
  function getTextDetails (element) {
    const text = element.innerText || ''
    const data = text.split(':')
    return {
      title: data[0].trim(),
      value: data[1].trim()
    }
  }

  const url = window.location.href

  const nameElement = document.querySelector('.ak-container .ak-title-container .ak-return-link')
  const name = nameElement.innerText

  const levelElement = document.querySelector('.ak-encyclo-detail-level')
  const level = getTextDetails(levelElement)

  const familyElement = document.querySelector('.ak-encyclo-detail-type')
  const family = getTextDetails(familyElement)

  const imageElement = document.querySelector('.ak-encyclo-detail-illu-monster img')
  const image = imageElement.src

  const detailsContainers = document.querySelectorAll('.ak-encyclo-detail-right .ak-container.ak-panel')

  // Ankama please... Two elements with the same id??
  const otherDataElements = document.querySelectorAll("[id='ak-encyclo-monster-drops ak-container ak-content-list']")

  const dropTableElement = otherDataElements[0] || false
  const dropElements = Array.from(dropTableElement && dropTableElement.querySelectorAll('.ak-content'))
  const drops = dropElements.map(element => element.innerText.replace('\n', ': '))

  const spellTableElement = otherDataElements[1] || false
  const spellElements = Array.from(spellTableElement && spellTableElement.querySelectorAll('.ak-title'))
  const spells = spellElements.map(element => element.innerText)

  /**
   * Get the Container Title and its details.
   *
   * @param { HTMLElement[] } detailsContainers
   * @param {number}index
   * @returns { MonsterDetails }
   */
  function getListDetails (detailsContainers, index) {
    const container = detailsContainers[index]
    if (!container) {
      return {}
    }
    const titleElement = container.querySelector('.ak-panel-title')
    const title = titleElement.innerText
    const detailsElements = Array.from(container.querySelectorAll('.ak-content-list .ak-title'))
    const details = detailsElements.map(element => element.innerText.trim())
    return { title, details }
  }

  const stats = getListDetails(detailsContainers, 0)
  const resists = getListDetails(detailsContainers, 1)

  return {
    url,
    name,
    level,
    family,
    image,
    stats,
    resists,
    drops,
    spells
  }
}

/**
 * @typedef MonsterSearchResults
 * @param { Monster[] } monstersFound
 * @param { string } url
 */

/**
 * Access the Monster Search page and scrap its results.
 *
 * @param {number|string} query
 * @param {string} lang
 * @returns {Promise<MonsterSearchResults>}
 */
export async function searchMonsters (query, lang) {
  try {
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    })
    const page = await browser.newPage()
    const url = `https://www.wakfu.com/${lang}/mmorpg/${encyclopedia[lang]}/${monsters[lang]}?text=${query}&sort=3D`
    await page.goto(url)
    const monstersFound = await page.evaluate(scrapMonsterSearch) || []
    await browser.close()
    return { monstersFound, url }
  } catch (error) {
    if (error.name === 'TimeoutError') {
      return []
    }
  }
}

/**
 * Access a Monster Page and scrap its data.
 *
 * @param {string} monsterId
 * @param {string} lang
 * @returns {Promise<object>}
 */
export async function getAndScrapMonsterById (monsterId, lang) {
  try {
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    })
    const page = await browser.newPage()
    await page.goto(`https://www.wakfu.com/${lang}/mmorpg/${encyclopedia[lang]}/${monsters[lang]}/${monsterId}`)
    await page.waitForSelector('.ak-encyclo-detail-right', { timeout: 60000 })
    const monstersFound = await page.evaluate(scrapMonster)

    await browser.close()
    return monstersFound
  } catch (error) {
    if (error.name === 'TimeoutError') {
      return {}
    }
  }
}
