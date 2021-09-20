import axios from "axios"

export async function saveServersNumber(serversNumber: number) {
  try {
    if (!process.env.ON_HEROKU) {
      return
    }
    const tableEndpoint = `https://api.airtable.com/v0/${process.env.AIRTABLE_TABLE_PATH}`      
    const headers = {
      Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json'
    }
    const record = JSON.stringify({
      "records": [
        {
          "id": process.env.AIRTABLE_RECORD_ID,
          "fields": {
            "Name": String(serversNumber)
          }
        }
      ]
    })
    await axios.patch(tableEndpoint, record, {headers})
    console.log(`Servers number updated: ${serversNumber}`)
  } catch (error) {
    console.log(error)
  }
}