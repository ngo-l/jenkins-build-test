import { Injectable } from '@nestjs/common'
import { DatabaseConnector } from '../common/database/database.connector'
import { InternalServiceError } from '../common/exceptions/errors'

@Injectable()
export class HealthRepository {
  constructor(private db: DatabaseConnector) { }

  public async selectOne(): Promise<number> {
    const conn = await this.db.getConnection()
    const data = await conn.raw('SELECT 1')
    if (data[0][0]['1'] !== 1) {
      throw new InternalServiceError('failed to connection to the database')
    }
    return data[0][0]['1']
  }
}
