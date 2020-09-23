const { ApolloServer, gql, SchemaDirectiveVisitor } = require('apollo-server')
const { ApolloGateway, RemoteGraphQLDataSource } = require('@apollo/gateway')

;(async () => {
  const gateway = new ApolloGateway({
    serviceList: [{
      name: 'resource', url: 'http://localhost:6401'
    }]
  })

  const server = new ApolloServer({
    gateway,
    subscriptions: false
  })

  await server.listen(6400)
  console.log('Gateway is up!')  
})()
