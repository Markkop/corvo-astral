import axios from 'axios'
import fs from 'fs'

/**
 * Get and save to file equipament from an external api.
 */
async function getEquipment () {
  try {
    let results = []
    let skip = 0
    for (let rarity = 1; rarity <= 7; rarity++) {
      skip = 0
      const { data } = await axios.get(`https://builder.methodwakfu.com/mw-api/items/?filters={%22rarity%22:[${rarity}],%22typeId%22:[],%22level%22:[1,215],%22actionIds%22:[],%22skip%22:${skip},%22limit%22:24,%22upgrade%22:true}&lang=pt`)
      const { count, items: firstItems } = data
      results = [...results, ...firstItems]
      const numberOfSearchs = Math.ceil(count / 24) - 1
      for (let search = 1; search <= numberOfSearchs; search++) {
        skip = 24 * search
        const url = `https://builder.methodwakfu.com/mw-api/items/?filters={%22rarity%22:[${rarity}],%22typeId%22:[],%22level%22:[1,215],%22actionIds%22:[],%22skip%22:${skip},%22limit%22:24,%22upgrade%22:true}&lang=pt`
        const { data: { items } } = await axios.get(url)
        results = [...results, ...items]
        console.log({ rarity }, { skip }, results.length)
      }
    }

    fs.writeFileSync('data/equipment.json', JSON.stringify(results, null, 2))
  } catch (err) {
    console.error(err)
  }
}

getEquipment()
