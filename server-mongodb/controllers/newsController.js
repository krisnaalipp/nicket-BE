const News = require('../models/news2');

class Controller {
  static async readAllNews(req,res){
    try {
      let result = await News.find()
      res.status(200).json(result)
    } catch (error) {
      res.status(500).json(error.message)
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
      if(error.name === 'ValidationError'){
        const errors = Object.values(error.errors).map((el) => el.message);
        res.status(400).json({message : `${errors}`})
      }else {
        res.status(500).json(error.message)
      } 
      
    }
  }
  static async getNewsById(req,res){
    try {
      const {newsId} = req.params
      const user = await News.findById(newsId)
      if(!user){
        return res.status(404).json({message : 'News Not Found'})
      }
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json(error.message)
    }
  }
  static async deleteNews (req,res) {
    try {
      const {newsId} = req.params
      const user = await News.findOne(newsId)
      if(!user){
        return res.status(404).json({message : 'News Not Found'})
      }
      const deletedNews = await News.findByIdAndRemove(newsId)
      res.status(200).json(deletedNews)
    } catch (error) {
      res.status(500).json(error)
    }
  }
} 

module.exports = Controller


