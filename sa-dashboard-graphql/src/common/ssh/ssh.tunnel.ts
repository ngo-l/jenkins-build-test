import SSH2Promise from 'ssh2-promise'
import { databaseConfig } from '../database/database.config'
import { InternalServiceError } from '../errors/internalServiceError'
import { ISSHTunnel } from '../interfaces/ssh.interfaces'
import logger from '../logger'
import { sshConfig } from '../ssh/ssh.config'

class SSHTunnel {
  tunnel: null | ISSHTunnel
  constructor() {
    this.tunnel = null
  }

  async initSSHTunnel() {
    try {
      const ssh = new SSH2Promise(sshConfig)
      const tunnel = await ssh.addTunnel({
        remoteAddr: databaseConfig.host,
        remotePort: databaseConfig.port,
      })
      this.tunnel = tunnel
    } catch (err) {
      throw new InternalServiceError('Ssh Error')
    }
  }

  async getSSHTunnel() {
    if (this.tunnel === null) {
      await this.initSSHTunnel()
    }
    logger.info('Connected to the SSH')
    return this.tunnel
  }
}

export const sshTunnel = new SSHTunnel()
