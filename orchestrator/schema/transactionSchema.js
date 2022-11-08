const redis = require('../config/redisConnection');
const axios = require('axios');

const baseUrl = 'https://nicket-services-app.herokuapp.com/order'
// const baseUrl = 'http://localhost:4003/order'

const transactionTypeDefs = `#graphql
  type Transaction {
    id:ID
    ktp:String
    email:String
    categorySeat:String 
    ticketPrice:Int
    amount:Int,
    MatchId:Int
    isPaid:Boolean
    createdAt:String
    Seats:[Seat]
  }
  type Seat {
    seatNumber:String 
  }
  type Message {
    message:String
    id:ID
  }
  type PostOrder{
    transactionToken:String
  }
  input InputSeat{
    seatNumber: String
  }
  input InputTransaction{
    ktp:String
    email:String
    categorySeat:String 
    ticketPrice:Int
    MatchId:Int
    seat:[InputSeat]
  }
  input UpdateTransactiom{
    TransactionId:ID
    transaction_status:String
  }
  type Query {
    getTransaction:[Transaction]
    getTransactionDetail(id:ID):Transaction
  }
  type Mutation {
    createTransaction(inputTransaction:InputTransaction):Message
    postOrder(id:ID):PostOrder
    updateTransaction(updateTransaction:UpdateTransactiom):Message
  }
`

const transactionResolvers = {
  Query : {
    getTransaction : async() => {
      try {
        let newsCache = await redis.get('transaction:cache')
        if(newsCache){
          const data = JSON.parse(newsCache)
          return data
        }else {
          const {data} = await axios.get(baseUrl)
          await redis.set('transaction:cache',JSON.stringify(data))
          return data
        }
        
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    getTransactionDetail : async (_,args) => {
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
    postOrder : async(_,args) => {
      try {
        const {id} = args
        const input = {
          TransactionId : id
        }
        const {data} = await axios.post(`${baseUrl}`,input)
        await redis.del('transaction:cache')
        return data
      } catch (error) {
        throw error
      }
    },
    createTransaction : async(_,args) => {
      try {
        const {inputTransaction} = args
        const {data} = await axios.post(`${baseUrl}/input`,inputTransaction)
        await redis.del('transaction:cache')
        return data
      } catch (error) {
        throw error
      }
    },
    updateTransaction:async(_,args) => {
      try {
        const {updateTransaction} = args
        const {data} = await axios.post(`${baseUrl}/payment`,updateTransaction)
        await redis.del('transaction:cache')
        return data
      } catch (error) {
        throw error
      }
     
    }
  }
}

module.exports = {transactionResolvers,transactionTypeDefs}


