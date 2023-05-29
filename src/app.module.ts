import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { HealthModule } from './health/health.module'
import { StaffModule } from './staff/staff.module'

const deploymentEnvironment =
  process.env.DEPLOYMENT_ENVIRONMENT || 'development'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `config/${deploymentEnvironment}/secrets-elsie-backend.env`,
      ],
    }),
    HealthModule,
    StaffModule,
  ],
})
export class AppModule {}
