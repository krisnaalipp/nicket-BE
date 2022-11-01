const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://finalproject:semogalancar@cluster0.ymaqnui.mongodb.net/?retryWrites=true&w=majority"
const dbName = "p3-final-project"
const client = new MongoClient(uri);
let db;

async function connect(params) {
  try {
    await client.connect();
    const dbConnection = client.db(dbName);
    console.log('connect to database')
    db = dbConnection
    return dbConnection
  } catch (err) {
    console.log(err)
  }
}

function getDatabase() {
  return db
}
module.exports = { connect, getDatabase }