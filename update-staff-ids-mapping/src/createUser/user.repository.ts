import { databaseConnection } from '../common/database/mysql.connector'
import { IUserProfiles } from '../common/interfaces/user.interfaces'
import logger from '../common/logger'

class UserRepository {

  constructor() { }

  private async getDatabaseConn() {
    const conn = await databaseConnection.getConnection()
    return conn
  }

  async findOneUserById(id: string) {
    try {
      if (!id) {
        return true
      }

      const conn = await this.getDatabaseConn()

      return await conn('USER_INFO')
        .where('YAMMER_ID', id)
        .then((data) => {
          if (data.length === 0) {
            return false
          }
          const msg = `User YAMMER_ID's ${id} is already existed`
          logger.info(msg)
          return true
        })

    } catch (err) {
      const msg = `UserRepository.findOneUserById: ${err.message}, tableName: USER_INFO`
      logger.error(msg)
      throw new Error(msg)
    }
  }

  async createOneUser(data: IUserProfiles[]) {
    try {
      const conn = await this.getDatabaseConn()
      await conn('USER_INFO').insert(data)
      return true
    } catch (err) {
      const msg = `UserRepository.createOneUser: ${err.message}, tableName: USER_INFO`
      logger.error(msg)
      throw new Error(msg)
    }
  }
}

export const userRepository = new UserRepository()
