import * as dotenv from 'dotenv'
import { globalConfig } from '../config/config'

dotenv.config({
  path: `./config/${ globalConfig.stage }/secrets.env`,
})

class DatabaseConfig {
  public host: string
  public port: number
  public user: string
  public password: string
  public database: string

  constructor() {
    this.host = process.env.DATABASE_HOST
    this.port = parseInt(process.env.DATABASE_PORT)
    this.user = process.env.DATABASE_USER
    this.password = process.env.DATABASE_PASSWORD
    this.database = process.env.DATABASE_NAME
  }
}

export const databaseConfig = new DatabaseConfig()
