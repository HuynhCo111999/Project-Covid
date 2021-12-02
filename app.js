const express = require('express')
const app = express()
require('dotenv').config()

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Welcome to Project Covid!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})