import * as dotenv from 'dotenv'
import { globalConfig } from '../config/config'

dotenv.config({
    path: `./config/${globalConfig.stage}/secrets.env`
})

class SSHConfig {
    public host: string
    public port: number
    public username: string
    public password: string

    constructor() {
        this.host = process.env.SSH_HOST
        this.port = parseInt(process.env.SSH_PORT)
        this.username = process.env.SSH_USERNAME
        this.password = process.env.SSH_PASSWORD
    }
}

export const sshConfig = new SSHConfig()
