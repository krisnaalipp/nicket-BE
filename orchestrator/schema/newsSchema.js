const redis = require('../config/redisConnection');
const axios = require('axios');

const baseUrl = 'https://nribun-services-user.herokuapp.com/news'

const newsTypeDefs = `#graphql
  type News {
    _id:String
    title:String
    imgUrl:String
    description:String
    tags:String
  }
  type Message {
    message:String
  }
  input InputNews {
    title:String
    imgUrl:String
    description:String
    tags:String
  }

  type Query {
    getNews: [News]
    newsById(id:String) : News
  }
  type Mutation {
    deleteNews(id:String): Message
    createNews(inputNews:InputNews) : Message
  }
`

const newsResolvers = {
  Query : {
    getNews : async() => {
      try {
        let newsCache = await redis.get('news:cache')
        if(newsCache){
          const data = JSON.parse(newsCache)
          return data
        }else {
          const {data} = await axios.get(baseUrl)
          await redis.set('news:cache',JSON.stringify(data))
          return data
        }
        
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    newsById : async (_,args) => {
      try {
        const {id} = args
        const {data} = await axios.get(`${baseUrl}/${id}`)
        return data
      } catch (error) {
        throw error
      }
    }
  },
  Mutation : {
    deleteNews : async(_,args) => {
      try {
        const {id} = args
        const {data} = await axios.delete(`${baseUrl}/${id}`)
        await redis.del('news:cache')
        return data
      } catch (error) {
        throw error
      }
    },
    createNews : async(_,args) => {
      try {
        const {inputNews} = args
        const {data} = await axios.post(`${baseUrl}`,inputNews)
        await redis.del('news:cache')
        return data
      } catch (error) {
        throw error
      }
    }
  }
}

module.exports = {newsTypeDefs,newsResolvers}