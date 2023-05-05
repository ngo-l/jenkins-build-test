import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class SSHConfig {
  public host: string
  public port: number
  public username: string
  public password: string

  constructor(private config: ConfigService) {
    this.host = config.get<string>('SSH_HOST')
    this.port = parseInt(config.get<string>('SSH_PORT'))
    this.username = config.get<string>('SSH_USERNAME')
    this.password = config.get<string>('SSH_PASSWORD')
  }
}
