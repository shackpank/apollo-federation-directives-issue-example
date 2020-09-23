const { ApolloServer, gql, SchemaDirectiveVisitor, makeExecutableSchema } = require('apollo-server')
const { buildFederatedSchema } = require('@apollo/federation')
const { GraphQLInt, defaultFieldResolver } = require('graphql')

class ResizableDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition (field) {
    field.description = field.description + '\n\nResizable: Pass a width and height, and we will attempt to resize this image'

    field.args.push({ type: GraphQLInt, name: 'width', description: 'Width in pixels' })
    field.args.push({ type: GraphQLInt, name: 'height', description: 'Height in pixels' })

    const { resolve = defaultFieldResolver } = field
    field.resolve = async function (root, params, context, info) {
      const result = await resolve.call(this, root, params, context, info)

      if (result && params.width && params.height) {
        result = result + `&width=${width}&height=${height}`
      }

      return result
    }
  }
}

const typeDefs = gql`
  directive @resizable on FIELD_DEFINITION

  type Resource @key(fields: "reference") {
    """The reference for this resource"""
    reference: ID!
    image: String @resizable
  }

  type Query {
    getResource(reference: ID!): Resource
  }
`

const resolvers = {
  Query: {
    getResource(root, params) {
      const resources = [{
        reference: 'ABC1',
        image: 'http://example.com/image1.png'
      }, {
        reference: 'ABC2',
        image: 'http://example.com/image2.png'
      }]

      return resources.find((r) => r.reference === params.reference)
    }
  }
}

const directives = {
  resizable: ResizableDirective
}

const schema = buildFederatedSchema([{ typeDefs, resolvers }])
SchemaDirectiveVisitor.visitSchemaDirectives(schema, directives)

;(async () => {
  const fedServer = new ApolloServer({
    schema
  })

  await fedServer.listen(6401)
  console.log('Backing API is up!')
})()

