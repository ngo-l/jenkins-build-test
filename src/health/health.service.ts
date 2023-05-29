import { Injectable } from '@nestjs/common'
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus'
import { HealthRepository } from './health.repository'
import { InternalServiceError } from '../common/exceptions/errors'

@Injectable()
export class KnexOrmHealthIndicator extends HealthIndicator {
  constructor(private knexRepository: HealthRepository) {
    super()
  }

  async pingCheck(databaseName: string): Promise<HealthIndicatorResult> {
    try {
      await this.knexRepository.selectOne()
      return this.getStatus(databaseName, true, {
        message: 'successfully connected to the database',
      })
    } catch (e) {
      throw new InternalServiceError(e)
    }
  }
}
