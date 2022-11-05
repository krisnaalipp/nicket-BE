
const {startStandaloneServer} = require('@apollo/server/standalone');
const {ApolloServer} = require('@apollo/server');
const {adminTypeDefs,adminRevolvers} = require('./schema/adminSchema');

const server = new ApolloServer({
  typeDefs : [
   adminTypeDefs
  ],
  resolvers : [
    adminRevolvers
  ],
});

startStandaloneServer(server, {
  listen: { 
    port:  4001
  },
}).then(({url})=> {
  console.log(`🚀  Server ready at: ${url}`);
})