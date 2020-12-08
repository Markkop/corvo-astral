import puppeteer from 'puppeteer'

/**
 * Check if all document images has finished loading.
 *
 * @returns {boolean}
 */
function hasImagesLoaded () {
  return Array.from(document.images).every(img => img.complete)
}

/**
 * Scrap build information from Method Builder.
 *
 * @returns {BuildData}
 */
function scrapMethodBuild () {
  // const mainStats = document.querySelectorAll('app-main-characteristics div ')
  const masteryStatsElements = document.querySelectorAll('app-mastery-characteristics div.elementMastery')
  const masteryStats = Array.from(masteryStatsElements).reduce((masteryStats, htmlElement, index) => {
    const element = htmlElement.id
    const text = htmlElement.innerText
    const values = text.split(/(\d+)/).map(Number).filter(Boolean)
    masteryStats[element] = {
      damage: values[0],
      resistPercentage: values[1],
      resistFlat: values[2]
    }
    return masteryStats
  }, {})

  const highestElement = Object.values(masteryStats).reduce((highestElement, { damage }) => {
    return damage > highestElement ? damage : highestElement
  }, 0)

  // const fightStats = document.querySelectorAll('app-fight-characteristics div')
  const secondaryStatsElements = document.querySelectorAll('app-secondary-characteristics div.characteristic')
  const secondaryStats = Array.from(secondaryStatsElements).map(htmlElment => {
    const nameAndValue = htmlElment.innerText.split('\n')
    const name = nameAndValue[0]
    const value = nameAndValue[1]
    return {
      name,
      value: Number(value)
    }
  })
  const damageSecondaryMasteries = secondaryStats.filter(stat => stat.name.includes('Mastery'))
  const summedSecondaryMasteries = damageSecondaryMasteries.reduce((sum, { value }) => {
    if (value < 0) {
      return sum
    }
    return sum + value
  }, 0)
  return {
    masteryStats,
    highestElement,
    secondaryStats,
    summedSecondaryMasteries
  }
}

/**
 * Clicks on the get image export option.
 *
 * @returns { any }
 */
function clickOnGetImageButton () {
  return document.querySelector('app-bottom-sheet-export > * > :nth-child(2)').click()
}

/**
 * @typedef ElementMastery
 * @param {number} damage
 * @param {number} resistPercentage
 * @param {number} resistFlat
 */

/**
 * @typedef MasteryStats
 * @param {ElementMastery} water
 * @param {ElementMastery} air
 * @param {ElementMastery} earth
 * @param {ElementMastery} fire
 */

/**
 * @typedef SecondaryMastery
 * @param {string} name
 * @param {number} value
 */

/**
 * @typedef BuildData
 * @param {MasteryStats} masteryStats
 * @param {number} highestElement
 * @param {SecondaryMastery[]} secondaryStats
 * @param {number} summedSecondaryMasteries
 * @param {string} url
 */

/**
 * Get build data from Methods's Builder.
 *
 * @param {string} buildId
 * @returns {Promise<BuildData>}
 */
export async function getAndScrapMethodBuild (buildId) {
  try {
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--window-size=1050,850'
      ]
    })
    const page = await browser.newPage()
    await page._client.send('Emulation.clearDeviceMetricsOverride')
    const url = `https://builder.methodwakfu.com/builder/code/${buildId}`
    await page.goto(url)
    const [shareButton] = await page.$x("//mat-icon[contains(., 'screen_share')]")
    if (shareButton) {
      await shareButton.click()
    }
    await page.evaluate(clickOnGetImageButton)
    await page.waitForFunction(hasImagesLoaded)
    const buildData = await page.evaluate(scrapMethodBuild)
    await page.screenshot({ path: `${buildId}.png`, clip: { x: 0, y: 90, width: 1050, height: 750 } })

    await browser.close()
    buildData.url = url
    return buildData
  } catch (error) {
    if (error.name === 'TimeoutError') {
      return {}
    }
    console.log(error)
  }
}
