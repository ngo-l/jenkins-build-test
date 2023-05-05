import { ApolloServer as AzureGQLServer } from 'apollo-server-azure-functions'
import { ApolloServerPluginLandingPageGraphQLPlayground } from '@apollo/server-plugin-landing-page-graphql-playground'
import { resolvers } from './resolvers'
import salesPerformanceTypeDefs from './schemas/salesPerformance.graphql'
import healthCheckTypeDefs from './schemas/healthcheck.graphql'
import { CustomGraphQLError } from '../common/errors/CustomError'

const server: AzureGQLServer = new AzureGQLServer({
  typeDefs: [salesPerformanceTypeDefs, healthCheckTypeDefs],
  resolvers,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground({
      settings: {
        'schema.polling.enable': false,
      },
    }),
  ],
  formatError: (error: CustomGraphQLError) => {
    // TODO: make sure the formatted error shows the full error message
    const { message, extensions: { exception: { stacktrace: stackTrace , statusCode } } } = error
    return ({ message, statusCode, stackTrace })
  }
})

export const graphqlServer = server.createHandler({
  cors: {
    origin: ['*'],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["access-control-allow-credentials", "access-control-allow-origin", "content-type"]
  }
})
