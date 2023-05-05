import { databaseConnection } from '../common/database/mysql.connector'
import { IStaffCustomer } from '../common/interfaces/database.columns.interfaces'
import logger from '../common/logger'
import { staffTableName } from './shared/staff.type'

class StaffRepository {

  constructor() { }

  private async getDatabaseConn() {
    const conn = await databaseConnection.getConnection()
    return conn
  }

  async truncate(tableName: staffTableName) {
    try {
      const conn = await this.getDatabaseConn()
      await conn(tableName).truncate()
      return true
    } catch (err) {
      const msg = `StaffRepository.truncate: ${err.message}, tableName: ${tableName}`
      logger.error(msg)
      throw new Error(msg)
    }
  }

  async replaceInto(tableName: staffTableName, data: IStaffCustomer[], columnNames: string[]) {
    try {
      const conn = await this.getDatabaseConn()
      await conn(tableName)
        .insert(data)
        .onConflict(columnNames)
        .merge(columnNames)
      return true
    } catch (err) {
      const msg = `StaffRepository.replaceInto: ${err.message}, tableName: ${tableName}`
      logger.error(msg)
      throw new Error(msg)
    }
  }
}

export const staffRepository = new StaffRepository()
