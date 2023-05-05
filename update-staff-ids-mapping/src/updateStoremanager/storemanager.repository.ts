import { databaseConnection } from '../common/database/mysql.connector'
import { IStoreManager, IStoreManagerManager } from '../common/interfaces/database.columns.interfaces'
import logger from '../common/logger'
import { storemanagerTableName } from './shared/storemanager.type'

class StoremanagerRepository {

  constructor() {}

  async truncate(tableName: storemanagerTableName) {
    try {
      const conn = await databaseConnection.getConnection()
      await conn(tableName).truncate()
      return true
    } catch (err) {
      const msg = `StoremanagerRepository.truncate: ${err.message}, tableName: ${tableName}`
      logger.error(msg)
      throw new Error(msg)
    }
  }

  async replaceInto(tableName: storemanagerTableName, data: IStoreManager[] | IStoreManagerManager[], columnNames: string[]) {
    try {
      const conn = await databaseConnection.getConnection()
      await conn(tableName)
        .insert(data)
        .onConflict(columnNames)
        .merge(columnNames)
      return true
    } catch (err) {
      const msg = `StoremanagerRepository.replaceInto: ${err.message}, tableName: ${tableName}`
      logger.error(msg)
      throw new Error(msg)
    }
  }
}

export const storemanagerRepository = new StoremanagerRepository()
