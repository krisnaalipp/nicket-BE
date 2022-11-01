const { ObjectId } = require('mongodb');
const { getDatabase } = require('../config/mongoConnection');

class User {
  static users() {
    const db = getDatabase()
    
    const user = db.collection('users')
    
    return user
  }
  static async findAll() {
    try {
      const user = this.users()
      const result = await user.find({}, {
        projection: { password: 0 }
      }).toArray()
      return result
    } catch (error) {
      throw error
    }
  }
  static async create(inputUser) {
    try {
      const user = this.users()
      const result = await user.insertOne(inputUser)
      return result
    } catch (error) {
      throw error
    }

  }
  static async findOne(id) {
    try {
      const user = this.users()
      const result = await user.findOne({
        _id: ObjectId(id)
      },{
        projection: { password: 0 }
      })
      return result
    } catch (error) {
      throw error
    }
  
  }
  static async destroy(id){
    try {
      const user = this.users()
      const result = await user.deleteOne({
        _id: ObjectId(id)
      })
      return result
    } catch (error) {
      throw error
    }
  }
}


module.exports = User