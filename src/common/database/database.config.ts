import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class DatabaseConfig {
  public host: string
  public port: number
  public user: string
  public password: string
  public database: string

  constructor(private config: ConfigService) {
    this.host = config.get<string>('DATABASE_HOST')
    this.port = parseInt(config.get<string>('DATABASE_PORT'))
    this.user = config.get<string>('DATABASE_USER')
    this.password = config.get<string>('DATABASE_PASSWORD')
    this.database = config.get<string>('DATABASE_NAME')
  }
}
