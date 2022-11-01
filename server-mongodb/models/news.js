const { ObjectId } = require('mongodb');
const { getDatabase } = require('../config/mongoConnection');

class User {
  static news() {
    const db = getDatabase()
    
    const news = db.collection('news')
    
    return news
  }
  static async findAll() {
    try {
      const news = this.news()
      const result = await news.find().toArray()
      return result
    } catch (error) {
      throw error
    }
  }
  static async create(inputNews) {
    try {
      const news = this.news()
      const result = await news.insertOne(inputNews)
      return result
    } catch (error) {
      throw error
    }

  }
  static async findOne(id) {
    try {
      const news = this.news()
      const result = await news.findOne({
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
      const news = this.news()
      const result = await news.deleteOne({
        _id: ObjectId(id)
      })
      return result
    } catch (error) {
      throw error
    }
  }
}


module.exports = User