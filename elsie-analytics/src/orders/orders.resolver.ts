import { Query, Resolver, Args, Info } from '@nestjs/graphql'
import * as graphqlFields from 'graphql-fields'
import { UserService } from '../users/users.service'
import { CustomerTypeEnum } from '../customers/customers.enum'
import { OrderService } from './orders.service'
import { ConfigService } from '@nestjs/config'

@Resolver('Order')
export class OrderResolver {
  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private config: ConfigService,
  ) {}

  @Query()
  async salesPerformanceMetricsData(
    @Args('data')
    { staffId, userId, startDate, endDate, customerType, currencyType },
    @Info() info,
  ) {
    const fields = graphqlFields(info)

    const staffIDs =
      this.config.get<string>('STAGE') !== 'production'
        ? await this.userService.getTestUserStaffIDs()
        : []

    if (staffIDs.includes(staffId)) {
      const data = await this.orderService.getSalesPerformanceTestData(
        staffId,
        startDate,
        endDate,
      )
      return data
    }

    await this.userService.checkUserCountsByStaffId({ staffId, userId })
    const businessUnit = await this.userService.findUserBusinessUnit(staffId)
    const custType = customerType.map((t: string) => CustomerTypeEnum[t])
    const currency = currencyType || 'HKD'

    const sales = fields.hasOwnProperty('sales')
      ? await this.orderService.getSalesAmount(
          {
            staffId,
            startDate,
            endDate,
            customerType: custType,
            businessUnit,
            currencyType: currency,
          },
          Object.keys(fields['sales']),
        )
      : undefined

    const orderCount = fields.hasOwnProperty('orderCount')
      ? await this.orderService.getOrderCount(
          {
            staffId,
            startDate,
            endDate,
            customerType: custType,
            businessUnit,
          },
          Object.keys(fields['orderCount']),
        )
      : undefined

    const avgBrandPerOrderCount = fields.hasOwnProperty('avgBrandPerOrderCount')
      ? await this.orderService.getAvgBrandPerOrderCount(
          {
            staffId,
            startDate,
            endDate,
            customerType: custType,
            businessUnit,
          },
          Object.keys(fields['avgBrandPerOrderCount']),
        )
      : undefined

    const avgBasketSize = fields.hasOwnProperty('avgBasketSize')
      ? await this.orderService.getAvgBasketSize(
          {
            staffId,
            startDate,
            endDate,
            customerType: custType,
            businessUnit,
          },
          Object.keys(fields['avgBasketSize']),
        )
      : undefined

    const avgBusinessUnitPerOrderCount = fields.hasOwnProperty(
      'avgBusinessUnitPerOrderCount',
    )
      ? await this.orderService.getAvgBusinessUnitPerOrderCount(
          {
            staffId,
            startDate,
            endDate,
            customerType: custType,
            businessUnit,
          },
          Object.keys(fields['avgBusinessUnitPerOrderCount']),
        )
      : undefined

    const avgBasketAmount = fields.hasOwnProperty('avgBasketAmount')
      ? await this.orderService.getAvgBasketValue(
          {
            staffId,
            startDate,
            endDate,
            customerType: custType,
            businessUnit,
            currencyType: currency,
          },
          Object.keys(fields['avgBasketAmount']),
        )
      : undefined

    return {
      sales,
      orderCount,
      avgBrandPerOrderCount,
      avgBasketSize,
      avgBasketAmount,
      avgBusinessUnitPerOrderCount,
    }
  }
}
