import { Module } from '@nestjs/common'
import { UserModule } from '../users/users.module'
import { DatabaseModule } from '../common/database/database.module'
import { LoggerModule } from '../common/logger/logger.module'
import { OrderRepository } from './orders.repository'
import { OrderResolver } from './orders.resolver'
import { OrderService } from './orders.service'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [LoggerModule, DatabaseModule, UserModule, ConfigModule],
  providers: [OrderRepository, OrderService, OrderResolver, ConfigService],
  exports: [OrderRepository, OrderService, OrderResolver],
})
export class OrderModule {}
