import SSH2Promise from 'ssh2-promise'
import { databaseConfig } from '../database/database.config'
import { ISSHTunnel } from '../interfaces/ssh.interfaces'
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
      throw new Error('cannot add the SSH Tunnel')
    }
  }

  async getSSHTunnel() {
    if (this.tunnel === null) {
      await this.initSSHTunnel()
    }
    return this.tunnel
  }
}

export const sshTunnel = new SSHTunnel()
