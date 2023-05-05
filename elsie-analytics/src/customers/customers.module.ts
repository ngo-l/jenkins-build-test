import { Module } from '@nestjs/common'
import { UserModule } from '../users/users.module'
import { DatabaseModule } from '../common/database/database.module'
import { LoggerModule } from '../common/logger/logger.module'
import { CustomerRepository } from './customers.repository'
import {
  BsinessUnitCustomerCountResolver,
  CustomerCountResolver,
  CustomerResolver,
} from './customers.resolver'
import { CustomerService } from './customers.service'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [LoggerModule, DatabaseModule, UserModule, ConfigModule],
  controllers: [],
  providers: [
    CustomerService,
    CustomerRepository,
    CustomerResolver,
    CustomerCountResolver,
    BsinessUnitCustomerCountResolver,
    ConfigService
  ],
  exports: [
    CustomerService,
    CustomerRepository,
    CustomerResolver,
    CustomerCountResolver,
    BsinessUnitCustomerCountResolver,
  ],
})
export class CustomerModule {}
