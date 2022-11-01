const express = require('express')
const router = require('./routes')
const app = express()
const port = 4000
const mongoconnection = require('./config/mongoConnection');


app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/',router)

mongoconnection.connect()
.then(()=> {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
})

