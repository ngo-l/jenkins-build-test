import { databaseConfig } from './database.config'
import { globalConfig } from '../config/config'
import { sshTunnel } from '../ssh/ssh.tunnel'
import Knex, { Knex as IKnex } from 'knex'
import MySQL2 from 'knex/lib/dialects/mysql2'

class DatabaseConnector {
  dbConnection: IKnex | null

  constructor() {
    this.dbConnection = null
  }
  async initConnection() {
    try {
      if (globalConfig.stage !== 'production') {
        const knex = Knex({
          client: MySQL2,
          connection: databaseConfig,
        })
        this.dbConnection = knex
      } else {
        const tunnel = await sshTunnel.getSSHTunnel()
        const knex = Knex({
          client: MySQL2,
          connection: { ...databaseConfig, port: tunnel.localPort },
        })
        this.dbConnection = knex
      }
    } catch (err) {
      throw new Error('cannot initialize the database connection')
    }
  }

  async getConnection(): Promise<IKnex> {
    if (this.dbConnection === null) {
      await this.initConnection()
    }
    return this.dbConnection
  }
}

export const databaseConnection = new DatabaseConnector()
