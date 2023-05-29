import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DatabaseConfig } from './database.config'
import { SSHTunnel } from '../ssh/ssh.tunnel'
import { InternalServiceError } from '../exceptions/errors'
import Knex, { Knex as IKnex } from 'knex'

@Injectable()
export class DatabaseConnector {
  dbConnection: IKnex | null
  deploymentEnvironment: string

  constructor(
    private databaseConfig: DatabaseConfig,
    private sshTunnel: SSHTunnel,
    private config: ConfigService,
  ) {
    this.dbConnection = null
    this.deploymentEnvironment = config.get<string>('STAGE')
  }

  async initConnection() {
    try {
      const port =
        this.deploymentEnvironment === 'production'
          ? (await this.sshTunnel.getSSHTunnel()).localPort
          : this.databaseConfig.port
      const knex = Knex({
        client: 'mysql2',
        connection: {
          host: this.databaseConfig.host,
          user: this.databaseConfig.user,
          password: this.databaseConfig.password,
          database: this.databaseConfig.database,
          port,
        },
      })
      this.dbConnection = knex
    } catch (err) {
      throw new InternalServiceError('Failed to connect to database')
    }
  }

  async getConnection(): Promise<IKnex> {
    if (this.dbConnection === null) {
      await this.initConnection()
    }
    return this.dbConnection
  }
}
