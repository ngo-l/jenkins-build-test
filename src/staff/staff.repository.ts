import { Injectable } from '@nestjs/common'
import { DatabaseConnector } from '../common/database/database.connector'
import { Logger } from '../common/logger/logger.service'
import { IStaffCustomer } from '../common/interfaces/database.columns.interfaces'
import { staffTableName } from './shared/staff.type'

@Injectable()
export class StaffRepository {
  constructor(private logger: Logger, private db: DatabaseConnector) {}

  // connect to database
  private async getDatabaseConn() {
    const conn = await this.db.getConnection()
    return conn
  }

  // truncates the table
  async truncate(tableName: staffTableName) {
    try {
      const conn = await this.getDatabaseConn()
      await conn(tableName).truncate()
      return true
    } catch (err) {
      const msg = `StaffRepository.truncate: ${err.message}, tableName: ${tableName}`
      this.logger.error(msg)
      throw new Error(msg)
    }
  }

  // replaces the data in the database
  async replaceInto(
    tableName: staffTableName,
    data: IStaffCustomer[],
    columnNames: string[],
  ) {
    try {
      const conn = await this.getDatabaseConn()
      await conn(tableName)
        .insert(data)
        .onConflict(columnNames)
        .merge(columnNames)
      return true
    } catch (err) {
      const msg = `StaffRepository.replaceInto: ${err.message}, tableName: ${tableName}`
      this.logger.error(msg)
      throw new Error(msg)
    }
  }
}
