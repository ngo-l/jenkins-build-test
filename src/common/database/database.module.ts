import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SSHConfig } from '../ssh/ssh.config'
import { SSHTunnel } from '../ssh/ssh.tunnel'
import { DatabaseConfig } from './database.config'
import { DatabaseConnector } from './database.connector'

@Module({
  imports: [ConfigModule],
  providers: [DatabaseConfig, DatabaseConnector, SSHConfig, SSHTunnel],
  exports: [DatabaseConnector],
})
export class DatabaseModule {}
