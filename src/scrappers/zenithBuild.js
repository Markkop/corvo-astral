import puppeteer from 'puppeteer'

/**
 * Scrap build information from Zenith Builder.
 *
 * @returns {ZenithBuildData}
 */
function scrapZenithBuild () {
  const masteryStatsElements = document.querySelectorAll('.carac .stats-category:nth-child(2) .stats-content .stats-group:nth-child(2) .stats-body-value span')
  const masteryStats = Array.from(masteryStatsElements).map(element => Number(element.innerText))

  const highestElement = Object.values(masteryStats).reduce((highestElement, damage) => {
    return damage > highestElement ? damage : highestElement
  }, 0)

  const secondaryStatsElements = document.querySelectorAll('.carac .stats-category:nth-child(4) .stats-content .stats-body')
  const secondaryStats = Array.from(secondaryStatsElements).map(htmlElment => {
    const nameAndValue = htmlElment.innerText.split('\n')
    const name = nameAndValue[0]
    const value = nameAndValue[1]
    return {
      name,
      value: Number(value)
    }
  })
  const damageSecondaryMasteries = secondaryStats.filter(stat => stat.name.includes('Maîtrise'))
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
 * @typedef SecondaryMastery
 * @param {string} name
 * @param {number} value
 */

/**
 * @typedef ZenithBuildData
 * @param {number[]} masteryStats
 * @param {number} highestElement
 * @param {SecondaryMastery[]} secondaryStats
 * @param {number} summedSecondaryMasteries
 * @param {string} url
 */

/**
 * Get build data from Zeniths's Builder.
 *
 * @param {string} buildId
 * @returns {Promise<ZenithBuildData>}
 */
export async function getAndScrapZenithBuild (buildId) {
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
    const url = `https://zenithwakfu.com/builder/${buildId}`
    await page.goto(url)
    await page.waitForTimeout(1000)
    const buildData = await page.evaluate(scrapZenithBuild)
    await page.screenshot({ path: `${buildId}.png`, clip: { x: 10, y: 200, width: 980, height: 650 } })

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
