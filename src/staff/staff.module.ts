import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LoggerModule } from '../common/logger/logger.module'
import { DatabaseModule } from '../common/database/database.module'
import { StaffService } from './staff.service'
import { StaffController } from './staff.controller'
import { StaffRepository } from './staff.repository'

@Module({
  imports: [ConfigModule, LoggerModule, DatabaseModule],
  controllers: [StaffController],
  providers: [StaffService, StaffRepository],
})
export class StaffModule {}
