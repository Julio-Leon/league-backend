const cors = require('cors')
const express = require('express')
const app = express()
const nodeFetch = require('node-fetch')
require('dotenv').config()

const PORT = process.env.PORT || 4000

const KEY = 'api_key=' + process.env.API_KEY

app.use(cors())
app.use(express.json())



app.listen(PORT, () => {
    console.log('Listening on port:', PORT)
})