const redis = require('../config/redisConnection');
const axios = require('axios');

const baseUrl = 'https://nicket-services-app.herokuapp.com/match'

const matchTypeDefs = `#graphql
  type Match {
    id:ID
    opponent:String
    opponentLogo:String
    result:String
    startDate:String
    availableSeats:Int
  }
  type Message {
    message: String
  }

  input InputMatch {
    opponent:String
    opponentLogo:String
    startDate:String
  }

  input InputResult{
    result:String
  }

  type Query {
    getMatch:[Match]
    getMatchById(id:ID): Match
    getOneMatch: Match
  }
  type Mutation {
    updateResult(id:ID,inputResult:InputResult):Message
    createMatch(inputMatch:InputMatch):Message
  }

`


const matchResolvers = {
  Query : {
    getMatch : async() => {
      try {
        await redis.del('match:cache')
        let matchCache = await redis.get('match:cache')
        if(matchCache){
          const data = JSON.parse(matchCache)
          return data
        }else {
          const {data} = await axios.get(baseUrl)
          await redis.set('match:cache',JSON.stringify(data))
          return data
        }
        
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    getMatchById: async (_,args) => {
      try {
        const {id} = args
        const {data} = await axios.get(`${baseUrl}/${id}`)
        return data
      } catch (error) {
        throw error
      }
    },
    getOneMatch: async () => {
      try {
        const {data} = await axios.get(`${baseUrl}/limit`)
        return data
      } catch (error) {
        throw error
      }
    }
  },
  Mutation : {
    updateResult : async(_,args) => {
      try {
        const {inputResult,id} = args
        const {data} = await axios.patch(`${baseUrl}/${id}`,inputResult)
        await redis.del('match:cache')
        return data
      } catch (error) {
        throw error
      }
    },
    createMatch : async(_,args) => {
      try {
        const {inputMatch} = args
        const {data} = await axios.post(`${baseUrl}`,inputMatch)
        await redis.del('match:cache')
        return data
      } catch (error) {
        throw error
      }
    }
  }
}

module.exports = {matchTypeDefs,matchResolvers}