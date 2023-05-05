import { Injectable } from '@nestjs/common'
import { DatabaseConnector } from '../common/database/database.connector'
import { Logger } from '../common/logger/logger.service'
import { IUserCountByStaffIdAndUserIdInput } from './users.interfaces'
import * as R from 'ramda'

@Injectable()
export class UserRespository {
  constructor(private logger: Logger, private db: DatabaseConnector) {}

  public async findBusinessUnitByStaffId(
    staffId: string,
  ): Promise<string | null> {
    const conn = await this.db.getConnection()
    const data = await conn
      .select('ELLC_USER_PROFILES.business_unit as businessUnit')
      .from('ELLC_USERS')
      .join('ELLC_USER_PROFILES', 'ELLC_USERS.ID', 'ELLC_USER_PROFILES.user_id')
      .where('ELLC_USERS.staff_id', staffId)
    const dataPath = ['0', 'businessUnit']
    return R.hasPath(dataPath, data) ? R.path(dataPath, data) : null
  }

  public async findUserCountByStaffIdAndUserId({
    userId,
    staffId,
  }: IUserCountByStaffIdAndUserIdInput): Promise<number | null> {
    const conn = await this.db.getConnection()
    const data = await conn
      .count('STAFF_ID as count')
      .from('USER_INFO')
      .where('STAFF_ID', staffId)
      .andWhere('ID', userId)
    const dataPath = ['0', 'count']
    return R.hasPath(dataPath, data) ? R.path(dataPath, data) : null
  }

  public async findNumberOfSAByBusinessUnit(
    businessUnit: string,
  ): Promise<number | null> {
    const conn = await this.db.getConnection()
    const data = await conn
      .countDistinct('user_id as count')
      .from('ELLC_USER_PROFILES')
      .where('business_unit', businessUnit)
      .whereIn('job_title', ['Style Advisor', 'Senior Style Advisor'])
    const dataPath = ['0', 'count']
    return R.hasPath(dataPath, data) ? R.path(dataPath, data) : null
  }

  public async findTestUserStaffIDs() {
    const conn = await this.db.getConnection()
    const data = await conn.distinct('staffID').from('test_metrics')
    return data
  }

  public async findTestNumberOfSAByBusinessUnit() {
    const conn = await this.db.getConnection()
    const data = await conn.select('*').from('test_metrics').where('test_metrics.queryName', 'businessUnitSACounts')
    return data[0]
  }
}
