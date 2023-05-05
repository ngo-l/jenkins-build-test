import { databaseConnection } from '../common/database/mysql.connector'
import { ISupervisor, ISupervisorStaff } from '../common/interfaces/database.columns.interfaces'
import logger from '../common/logger'
import { supervisorTableName } from './shared/supervisor.type'

class SupervisorRepository {
  tableName: string

  constructor() {}

  async truncate(tableName: supervisorTableName) {
    try {
      const conn = await databaseConnection.getConnection()
      await conn(tableName).truncate()
      return true
    } catch (err) {
      const msg = `SupervisorRepository.truncate: ${err.message}, tableName: ${tableName}`
      logger.error(msg)
      throw new Error(msg)
    }
  }

  async replaceInto(tableName: supervisorTableName, data: ISupervisor[] | ISupervisorStaff[], columnNames: string[]) {
    try {
      const conn = await databaseConnection.getConnection()
      await conn(tableName)
        .insert(data)
        .onConflict(columnNames)
        .merge(columnNames)
      return true
    } catch (err) {
      const msg = `SupervisorRepository.replaceInto: ${err.message}, tableName: ${tableName}`
      logger.error(msg)
      throw new Error(msg)
    }
  }
}

export const supervisorRepository = new SupervisorRepository()
