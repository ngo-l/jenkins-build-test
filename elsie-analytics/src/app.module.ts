import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { IGraphQLException } from './common/exceptions/graphqlError'
import { OrderModule } from './orders/orders.module'
import { CustomerModule } from './customers/customers.module'
import { UserModule } from './users/users.module'
import { HealthModule } from './health/health.module'

const deploymentEnvironment =
  process.env.DEPLOYMENT_ENVIRONMENT || 'development'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`config/${deploymentEnvironment}/secrets.env`],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: deploymentEnvironment === 'development',
      playground: deploymentEnvironment !== 'production',
      typePaths: ['./**/*.graphql'],
      formatError: (error) => {
        const exception: IGraphQLException = error.extensions.exception
        const { status, message, stacktrace } = exception
        return { message, statusCode: status, stackTrace: stacktrace }
      },
    }),
    UserModule,
    OrderModule,
    CustomerModule,
    HealthModule,
  ],
})
export class AppModule {}
