import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { HealthRepository } from './health.repository'
import { KnexOrmHealthIndicator } from './health.service'
import { DatabaseModule } from '../common/database/database.module'
import { LoggerModule } from '../common/logger/logger.module'
import { HealthController } from './health.controller'

@Module({
  imports: [
    TerminusModule.forRoot({
      errorLogStyle: 'pretty',
    }),
    DatabaseModule,
    LoggerModule,
  ],
  controllers: [HealthController],
  providers: [KnexOrmHealthIndicator, HealthRepository],
})
export class HealthModule { }
