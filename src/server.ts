import express from 'express'
import path from 'path'
require('dotenv').config()

const PORT = process.env.PORT || 8080

export default function initiateServer() {
  try {
    const app = express()
    app.use(express.json())
  
    app.get('/badge', (request, response) => {
      response.sendFile(path.resolve(__dirname + '/../data/generated/serversBadge.json'))
    })
    
    app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`) })
  } catch (error) {
    console.error(error)
  }
}

initiateServer()
