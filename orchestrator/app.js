require("dotenv").config();
const {startStandaloneServer} = require('@apollo/server/standalone');
const {ApolloServer} = require('@apollo/server');
const {adminTypeDefs,adminRevolvers} = require('./schema/adminSchema');
const {newsTypeDefs,newsResolvers} = require('./schema/newsSchema');

const server = new ApolloServer({
  typeDefs : [
   adminTypeDefs,
   newsTypeDefs
  ],
  resolvers : [
    adminRevolvers,
    newsResolvers
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