const cors = require('cors');
const express = require('express');
const errorHandler = require('./middlewares/errorHandler');
const app = express()

const router = require('./routes');

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/',router)
app.use(errorHandler)

const port = 4003


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app