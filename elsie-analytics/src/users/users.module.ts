import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { DatabaseModule } from '../common/database/database.module'
import { LoggerModule } from '../common/logger/logger.module'
import { UserRespository } from './users.repository'
import { BusinessUnitSACountResolver } from './users.resolver'
import { UserService } from './users.service'

@Module({
  imports: [LoggerModule, DatabaseModule, ConfigModule],
  controllers: [],
  providers: [UserService, UserRespository, BusinessUnitSACountResolver, ConfigService],
  exports: [UserService, UserRespository, BusinessUnitSACountResolver],
})
export class UserModule {}
