import { databaseConfig } from './database.config'
import { globalConfig } from '../config/config'
import { sshTunnel } from '../ssh/ssh.tunnel'
import Knex, { Knex as IKnex } from 'knex'
import MySQL2 from 'knex/lib/dialects/mysql2'
import logger from '../logger'
import { InternalServiceError } from '../errors/internalServiceError'

class DatabaseConnector {
  
  dbConnection: IKnex | null

  constructor(){
    this.dbConnection = null
  }

  async initConnection() {
    try {
      if (globalConfig.stage === 'development') {
          const knex = Knex({
            client: MySQL2,
            connection: databaseConfig
          })
          this.dbConnection = knex
      } else {
        const tunnel = await sshTunnel.getSSHTunnel()
        const knex = Knex({
          client: MySQL2,
          connection: { ...databaseConfig, port: tunnel.localPort }
        })
        this.dbConnection = knex
      }
    } catch (err) {
      const msg = 'Failed to connect to database'
      logger.error(`initConnection: ${msg}, error=${err}`)
      throw new InternalServiceError(msg)
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
