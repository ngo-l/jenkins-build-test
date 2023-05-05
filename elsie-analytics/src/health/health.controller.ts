import { Controller, Get, Inject } from '@nestjs/common'
import { HealthCheckService, HealthCheck } from '@nestjs/terminus'
import { KnexOrmHealthIndicator } from './health.service'

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    @Inject(KnexOrmHealthIndicator)
    private db: KnexOrmHealthIndicator,
  ) { }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ])
  }
}
