import { Query, Resolver, Args, Info } from '@nestjs/graphql'
import { CustomerService } from './customers.service'
import * as graphqlFields from 'graphql-fields'
import { CustomerTypeEnum } from './customers.enum'
import { UserService } from '../users/users.service'
import { IclientelingPerformanceMetricsDataOutput } from './interfaces/customers.interfaces'
import { ConfigService } from '@nestjs/config'

@Resolver('Customer')
export class CustomerResolver {
  constructor(
    private customerService: CustomerService,
    private userService: UserService,
    private config: ConfigService,
  ) {}

  @Query()
  async clientelingPerformanceMetricsData(
    @Args('data') { staffId, userId, startDate, endDate, customerType },
    @Info() info,
  ): Promise<IclientelingPerformanceMetricsDataOutput> {
    const fields = graphqlFields(info)

    const staffIDs =
      this.config.get<string>('STAGE') !=='production'
        ? await this.userService.getTestUserStaffIDs()
        : []
    
    if (staffIDs.includes(staffId)) {
      const data = await this.customerService.getClienteleTestMetrics(staffId, startDate, endDate)
      return data
    }

    await this.userService.checkUserCountsByStaffId({ staffId, userId })
    const businessUnit = await this.userService.findUserBusinessUnit(staffId)
    const custType = customerType.map(
      (customerTypeName: string) => CustomerTypeEnum[customerTypeName],
    )

    // TODO: restructure the codes to avoid repeating hasSomething ? a: b for massaging the undefined

    const customerReturn = fields.hasOwnProperty('return')
      ? await this.customerService.getCustomerReturnCount(
          {
            staffId,
            startDate,
            endDate,
            customerType: custType,
            businessUnit,
          },
          Object.keys(fields.return),
        )
      : undefined

    const reach = fields.hasOwnProperty('reach')
      ? await this.customerService.getCustomerReachCount(
          {
            staffId,
            startDate,
            endDate,
            customerType: custType,
            businessUnit,
          },
          Object.keys(fields.reach),
        )
      : undefined

    const avgVisits = fields.hasOwnProperty('avgVisits')
      ? await this.customerService.getCustomerAvgVisitCount(
          {
            staffId,
            startDate,
            endDate,
            customerType: custType,
            businessUnit,
          },
          Object.keys(fields.avgVisits),
        )
      : undefined

    const avgDaysSinceLastPurchase = fields.hasOwnProperty(
      'avgDaysSinceLastPurchase',
    )
      ? await this.customerService.getAvgDaysSinceLastPurchase(
          {
            staffId,
            startDate,
            endDate,
            customerType: custType,
            businessUnit,
          },
          Object.keys(fields.avgDaysSinceLastPurchase),
        )
      : undefined

    const topBrands = fields.hasOwnProperty('topBrands')
      ? await this.customerService.getTopBrands({
          staffId,
          startDate,
          endDate,
          customerType: custType,
          businessUnit,
        })
      : undefined

    return {
      return: customerReturn,
      reach,
      avgVisits,
      avgDaysSinceLastPurchase,
      topBrands,
    }
  }
}

@Resolver('CustomerCount')
export class CustomerCountResolver {
  constructor(
    private customerService: CustomerService,
    private userService: UserService,
    private config: ConfigService,
  ) {}

  @Query()
  async customerCounts(@Args('data') { staffId, userId, customerType }) {
    const staffIDs =
      this.config.get<string>('STAGE') !=='production'
        ? await this.userService.getTestUserStaffIDs()
        : []

    if (staffIDs.includes(staffId)) {
      const customerCount = await this.customerService.getTestCustomerCounts(staffId)
      return customerCount
    }


    await this.userService.checkUserCountsByStaffId({ staffId, userId })
    const customerTypes = customerType.map((t: string) => CustomerTypeEnum[t])
    const data = await this.customerService.getClienteleCustomerCount({
      staffId,
      customerTypes,
    })
    return data
  }
}

@Resolver('BusinessUnitCustomerCount')
export class BsinessUnitCustomerCountResolver {
  constructor(
    private customerService: CustomerService,
    private userService: UserService,
    private config: ConfigService,
  ) {}

  @Query()
  async businessUnitCustomerCounts(
    @Args('data') { staffId, userId, customerType },
  ) {
    const staffIDs =
      this.config.get<string>('STAGE') !=='production'
        ? await this.userService.getTestUserStaffIDs()
        : []
        
    if (staffIDs.includes(staffId)) {
      const customerCount =
        await this.customerService.getTestBusinessUnitCustomerCounts(staffId)
      return customerCount
    }

    await this.userService.checkUserCountsByStaffId({ staffId, userId })
    const customerTypes = customerType.map((t: string) => CustomerTypeEnum[t])
    const businessUnit = await this.userService.findUserBusinessUnit(staffId)

    if (businessUnit === null || businessUnit === undefined) {
      return null
    }

    const data =
      await this.customerService.getClienteleCustomerCountByBusinessUnit({
        businessUnit,
        customerTypes,
      })

    return data
  }
}
