import { databaseConnection } from '../common/database/mysql.connector'
import { IManager, IManagerSupervisor } from '../common/interfaces/database.columns.interfaces'
import logger from '../common/logger'
import { ManagerTableName } from './shared/manager.types'

class ManagerRepository {

  constructor() {}

  private async getDatabaseConn() {
    const conn = await databaseConnection.getConnection()
    return conn
  }

  async truncate(tableName: ManagerTableName) {
    try {
      const conn = await this.getDatabaseConn()
      await conn(tableName).truncate()
      return true
    } catch (err) {
      const msg = `ManagerRepository.truncate: ${err.message}, tableName: ${tableName}`
      logger.error(msg)
      throw new Error(msg)
    }
  }

  async replaceInto(tableName: ManagerTableName, data: IManager[] | IManagerSupervisor[], columnNames: string[]) {
    try {
      const conn = await this.getDatabaseConn()
      await conn(tableName).insert(data).onConflict(columnNames).merge(columnNames)
      return true
    } catch (err) {
      const msg = `ManagerRepository.replaceInto:  ${err.message}, tableName: ${tableName}`
      logger.error(msg)
      throw new Error(msg)
    }
  }
}

export const managerRepository = new ManagerRepository()
