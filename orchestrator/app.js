require("dotenv").config();
const {startStandaloneServer} = require('@apollo/server/standalone');
const {ApolloServer} = require('@apollo/server');
const {adminTypeDefs,adminRevolvers} = require('./schema/adminSchema');
const {newsTypeDefs,newsResolvers} = require('./schema/newsSchema');
const {matchTypeDefs,matchResolvers} = require('./schema/matchSchema');
const {transactionResolvers,transactionTypeDefs} = require('./schema/transactionSchema');

const server = new ApolloServer({
  typeDefs : [
   adminTypeDefs,
   newsTypeDefs,
   matchTypeDefs,
   transactionTypeDefs
  ],
  resolvers : [
    adminRevolvers,
    newsResolvers,
    matchResolvers,
    transactionResolvers
  ],
  introspection: true,
  playground: true,
});

startStandaloneServer(server, {
  listen: { 
    port:  process.env.PORT || 4001
  },
}).then(({url})=> {
  console.log(`🚀  Server ready at: ${url}`);
})