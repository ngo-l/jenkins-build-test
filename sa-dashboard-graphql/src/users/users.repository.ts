import { databaseConnection } from '../common/database/mysql.connector'
import { InternalServiceError } from '../common/errors/internalServiceError'
import logger from '../common/logger'

class UserRespository {
  constructor() {}

  public async findBusinessUnitByStaffId(staffId: string) {
    const conn = await databaseConnection.getConnection()
    try {
      const data = await conn
        .select('ELLC_USER_PROFILES.business_unit as businessUnit')
        .from('ELLC_USERS')
        .join('ELLC_USER_PROFILES', 'ELLC_USERS.ID', 'ELLC_USER_PROFILES.user_id')
        .where('ELLC_USERS.staff_id', staffId)
      return data
    } catch (err) {
      const msg = 'Failed to connect to database'
      logger.error(`findBusinessUnitByStaffId: ${msg}, error=${err}`)
      throw new InternalServiceError(msg)
    }
  }

  public async findUserCountByStaffIdAndUserId(staffId: string, userId: number) {
    const conn = await databaseConnection.getConnection()
    try {
      const data = await conn
        .count('STAFF_ID as count')
        .from('USER_INFO')
        .where('STAFF_ID', staffId)
        .andWhere('ID', userId)
      return data
    } catch (err) {
      const msg = 'Failed to connect to database'
      logger.error(`findUserCountByStaffIdAndUserId: ${msg}, error=${err}`)
      throw new InternalServiceError(msg)
    }
  }
}

export const userRepository = new UserRespository()
