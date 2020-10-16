import puppeteer from 'puppeteer'

/**
 * Scrap drop information from item.
 *
 * @returns {object}
 */
function scrapDrop () {
  const containers = Array.from(document.querySelectorAll('.ak-container .ak-panel'))
  const droppedByContainer = containers.find(el => {
    const asideElement = el.querySelector('.ak-aside') || {}
    const dropText = asideElement.innerText || ''
    return dropText.includes('%')
  })
  if (!droppedByContainer) {
    return []
  }

  const monsters = droppedByContainer.querySelectorAll('.ak-main-content ')
  return Array.from(monsters).map(element => {
    const dropElement = element.querySelector('.ak-aside')
    const dropChanceText = dropElement.innerText
    const monsterElement = element.querySelector('.ak-content .ak-linker')
    const monsterText = monsterElement.innerText
    return { monster: monsterText, dropChance: dropChanceText }
  })
}

/**
 * Initate Drop Scrapper by item id and type.
 *
 * @param {number|string} itemId
 * @param {number} type
 * @param {string} lang
 * @returns {Promise<object>} DropData.
 */
export async function scraDropByTypeAndId (itemId, type, lang) {
  const categories = [
    {
      title: {
        en: 'armors',
        pt: 'armaduras',
        es: 'armaduras',
        fr: 'armures'
      },
      types: [103, 132, 133, 134, 136, 138]
    },
    {
      title: {
        en: 'armors',
        pt: 'armas',
        es: 'armas',
        fr: 'weapons'
      },
      types: [101, 108, 110, 11, 112, 113, 114, 115, 117, 119, 120, 189, 219, 223, 253, 254, 480, 512, 519, 520]
    },
    {
      title: {
        en: 'pets',
        pt: 'mascotes',
        es: 'mascotas',
        fr: 'familiers'
      },
      types: [582]
    },
    {
      title: {
        fr: 'montures',
        en: 'mounts',
        es: 'monturas',
        pt: 'montarias'
      },
      types: [611]
    },
    {
      title: {
        fr: 'accessoires',
        en: 'accessories',
        es: 'accesorios',
        pt: 'acessorios'
      },
      types: [646]
    }
  ]
  const category = categories.find(cat => cat.types.some(catType => catType === type))

  const encyclopedia = {
    fr: 'encyclopedie',
    pt: 'enciclopedia',
    es: 'enciclopedia',
    en: 'encyclopedia'
  }

  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  })
  const page = await browser.newPage()
  await page.goto(`https://www.wakfu.com/${lang}/mmorpg/${encyclopedia[lang]}/${category.title[lang]}/${itemId}`)
  await page.waitForSelector('.ak-encyclo-detail-illu img', { timeout: 60000 })
  const drop = await page.evaluate(scrapDrop)
  await browser.close()
  return drop
}

/**
 * Initate Drop Scrapper by name and level.
 *
 * @param {string} itemName
 * @returns {Promise<object>} DropData.
 */
export async function scraDropByName (itemName) {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  })
  const page = await browser.newPage()
  await page.goto('https://www.google.com/')
  await page.waitForSelector('input[type=text]', {
    visible: true
  })
  await page.focus('input[type=text]')
  await page.keyboard.type(`intitle:"${itemName}" site:wakfu.com ${String.fromCharCode(13)}`)
  await page.waitForNavigation()
  const resultSelector = '#main #center_col div div div div a h3 span'
  const hasResult = await page.evaluate((resultSelector) => {
    return Boolean(document.querySelector(resultSelector))
  }, resultSelector)
  if (!hasResult) {
    return []
  }
  await page.click(resultSelector)
  await page.waitForSelector('.ak-encyclo-detail-illu img', { timeout: 60000 })
  const drop = await page.evaluate(scrapDrop)
  await browser.close()
  return drop
}
