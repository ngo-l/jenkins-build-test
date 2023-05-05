import { databaseConnection } from '../common/database/mysql.connector'

class HealthCheckRespository {
  constructor() {}

  private async getDatabaseConn() {
    const conn = await databaseConnection.getConnection()
    return conn
  }

  public async getDataBaseVersion(): Promise<string> {
    const conn = await this.getDatabaseConn()
    const data = await conn.raw('SELECT VERSION()')
    return data
  }
}

export const healthCheckRepository = new HealthCheckRespository()
