// FIXME:TypeError: SSH2Promise_1.default is not a constructor if replacing 'require' with 'from'
import SSH2Promise = require('ssh2-promise')
import { DatabaseConfig } from '../database/database.config'
import { ISSHTunnel } from './interfaces/ssh.interfaces'
import { SSHConfig } from '../ssh/ssh.config'
import { Injectable } from '@nestjs/common'
import { InternalServiceError } from '../exceptions/errors'

@Injectable()
export class SSHTunnel {
  tunnel: null | ISSHTunnel
  constructor(
    private databaseConfig: DatabaseConfig,
    private sshConfig: SSHConfig,
  ) {
    this.tunnel = null
  }

  async initSSHTunnel() {
    try {
      const ssh = new SSH2Promise({ ...this.sshConfig })
      const tunnel = await ssh.addTunnel({
        remoteAddr: this.databaseConfig.host,
        remotePort: this.databaseConfig.port,
      })
      this.tunnel = tunnel
    } catch (err) {
      throw new InternalServiceError('failed to connect to the ssh tunnel')
    }
  }

  async getSSHTunnel() {
    if (this.tunnel === null) {
      await this.initSSHTunnel()
    }
    return this.tunnel
  }
}
