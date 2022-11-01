const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://ilham:arfanfauzan22@cluster0.ctcj3kj.mongodb.net/?retryWrites=true&w=majority"
const dbName = "challenge-2"
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