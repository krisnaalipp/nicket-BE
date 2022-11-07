const News = require('../models/news');

class Controller {
  static async readAllNews(req, res) {
    try {
      let result = await News.find()
      res.status(200).json(result)
    } catch (error) {
      res.status(500).json(error.message)
    }
  }
  static async readLimitedNews(req, res) {
    try {
      let result = await News.find({published: true})
      .sort({'createdAt': 'asc'})
      .limit(3)
      res.status(200).json(result)
    } catch (error) {
      res.status(500).json(error.message)
    }
  }
  static async addNewNews(req, res) {
    try {
      const { title, imgUrl, description, tags } = req.body
      // if (!title || !imgUrl || !description || !tags || !createdAt) {
      //   return res.status(404).json({ message: 'Invalid input' })
      // }
      const newsInput = { title, imgUrl, description, tags}
      await News.create(newsInput)
      res.status(201).json({ message: 'Success create a new News' })
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((el) => el.message);
        res.status(400).json({ message: `${errors}` })
      } else {
        res.status(500).json(error.message)
      }

    }
  }
  static async getNewsById(req, res) {
    try {
      const { newsId } = req.params
      const news = await News.findById(newsId)
      if (!news) {
        return res.status(404).json({ message: 'News Not Found' })
      }
      res.status(200).json(news)
    } catch (error) {
      res.status(500).json(error.message)
    }
  }
  static async deleteNews(req, res) {
    try {
      const { newsId } = req.params
      const news = await News.findById(newsId)
      const deletedNews = await News.findByIdAndRemove(newsId,{
        returnOriginal : true
      })
      res.status(200).json(deletedNews)
    } catch (error) {
      res.status(500).json(error.message)
    }
  }
}

module.exports = Controller


