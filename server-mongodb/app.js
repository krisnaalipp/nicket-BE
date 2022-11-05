const express = require('express')
const router = require('./routes')
const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use('/',router)
let uri = "mongodb+srv://finalproject:semogalancar@cluster0.ymaqnui.mongodb.net/running?retryWrites=true&w=majority"

// if(process.env.NODE_ENV === 'test'){
//   uri = "mongodb+srv://finalproject:semogalancar@cluster0.ymaqnui.mongodb.net/test?retryWrites=true&w=majority"
// }

// mongoose.connect(uri,{useNewUrlParser:true})
// .then(()=> {
//   if(process.env.NODE_ENV !== 'test'){
//     app.listen(port, () => {
//       console.log(`Example app listening on port ${port}`)
//     })
//   }
// })

module.exports = app


// mongoconnection.connect()
// .then(()=> {
//   app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
//   })
// })

