const redis = require('../config/redisConnection');
const axios = require('axios');

// const baseUrl = 'https://nribun-services-user.herokuapp.com/admin'
const baseUrl = 'http://localhost:4000/admin'



const adminTypeDefs = `#graphql
  type Admin {
    _id:String
    username:String
    email:String
  }
  type Message {
    message:String
  }
  type LoginResponse{
    access_token:String
  }
  
  input AdminInput {
    username:String!
    email:String!
    password:String!
  }
  input LoginInput{
    email:String
    password:String
  }

  type Query {
    getAdmin: [Admin],
    getAdminById(_id : String!) : Admin
    
  }
  type Mutation {
    createAdmin(inputAdmin: AdminInput) : Message
    deleteAdmin(_id : String!) : Message
    loginAdmin(inputLogin:LoginInput):LoginResponse
  }
`


const adminRevolvers = {
  Query: {
    getAdmin : async () => {
      try {
        let adminCache = await redis.get('cache:admin')
        if(adminCache){
          const data = JSON.parse(adminCache)
          return data
        }else {
          const {data} = await axios.get(`${baseUrl}`)
          await redis.set('cache:admin',JSON.stringify(data))
          return data
        }
      } catch (error) {
        throw error
      }
    },
    getAdminById : async (_,args) => {
      try {
        const {data} = await axios.get(`${baseUrl}/${args._id}`)
        return data
      } catch (error) {
        throw error
      }
    },
  },
  Mutation: {
    createAdmin : async (_,args) => {
      try {
        const {inputAdmin} = args
        const {data} = await axios.post(baseUrl,inputAdmin)
        await redis.del('cache:admin')
        return data
      } catch (error) {
        throw error
      }
    },
    deleteAdmin : async (_,args) => {
      try {
        const {_id} = args
        const {data}=await axios.delete(`${baseUrl}/${_id}`)
        await redis.del('cache:admin')
        return data
      } catch (error) {
        throw error
      }
    },
    loginAdmin: async (_,args) => {
      try {
        const {inputLogin} = args
        const {data} = await axios.post(`${baseUrl}/login`,inputLogin)
        return data
      } catch (error) {
        throw error
      }
    } 
  }
}

module.exports = {
  adminTypeDefs,
  adminRevolvers
}