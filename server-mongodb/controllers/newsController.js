const News = require('../models/news');

class Controller {
  static async readAllNews(req,res){
    try {
      let result = await News.findAll()
      res.status(200).json(result)
    } catch (error) {
      res.status(500).json(error)
    }
  }
  static async addNewNews (req,res){
    try {
      const {title,imgUrl,description,tags,createdAt} = req.body
      if(!title || !imgUrl || !description || !tags || !createdAt ){
        return res.status(404).json({message : 'Invalid input'})
      }
      const newsInput = {title,imgUrl,description,tags,createdAt}
      await News.create(newsInput)
      res.status(201).json({message : 'Success create a new News'})
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
  }
  static async getNewsById(req,res){
    try {
      const {newsId} = req.params
      const user = await News.findOne(id)
      if(!user){
        return res.status(404).json({message : 'News Not Found'})
      }
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json(error)
    }
  }
  static async deleteNews (req,res) {
    try {
      const {newsId} = req.params
      const user = await News.findOne(id)
      if(!user){
        return res.status(404).json({message : 'News Not Found'})
      }
      await News.destroy(id)
      res.status(200).json({message : 'Successfully delete News'})
    } catch (error) {
      res.status(500).json(error)
    }
  }
} 

module.exports = Controller


