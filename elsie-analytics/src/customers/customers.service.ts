import { Injectable } from '@nestjs/common'
import { IQueryArguments } from '../common/interfaces/query.interfaces'
import {
  ISalesPerformanceData,
  IReachCustomerDataOutput,
  IReturnCustomerDataOutput,
} from '../common/interfaces/sales.interfaces'
import { CustomerRepository } from './customers.repository'
import {
  IClienteleCustomerCountByBusinessUnitInput,
  IClienteleCustomerCountInput,
  IClienteleCustomerCountOutput,
  ITopBrands,
} from './interfaces/customers.interfaces'
import { CustomerTypeEnum } from './customers.enum'

@Injectable()
export class CustomerService {
  constructor(private customerRepository: CustomerRepository) {}

  public async getCustomerReturnCount(
    {
      staffId,
      customerType,
      startDate,
      endDate,
      businessUnit,
    }: IQueryArguments,
    metricsTypes: string[],
  ): Promise<IReturnCustomerDataOutput> {
    const current = metricsTypes.includes('current')
      ? await this.customerRepository.findCustomerReturnCount({
          staffId,
          customerType,
          startDate,
          endDate,
          businessUnit,
        })
      : undefined
    const businessUnitAvg = metricsTypes.includes('businessUnitAvg')
      ? await this.customerRepository.findCustomerReturnCountBusinessUnitAvg(
          {
            staffId,
            customerType,
            startDate,
            endDate,
          },
          businessUnit,
        )
      : undefined
    const businessUnitTotal = metricsTypes.includes('businessUnitTotal')
      ? await this.customerRepository.findBusinessUnitCustomerReturnCount({
          customerType,
          startDate,
          endDate,
          businessUnit,
        })
      : undefined
    return { current, businessUnitAvg, businessUnitTotal }
  }

  public async getCustomerReachCount(
    {
      staffId,
      customerType,
      startDate,
      endDate,
      businessUnit,
    }: IQueryArguments,
    metricsTypes: string[],
  ): Promise<IReachCustomerDataOutput> {
    const current = metricsTypes.includes('current')
      ? await this.customerRepository.findCustomerReachCount({
          staffId,
          customerType,
          startDate,
          endDate,
          businessUnit,
        })
      : undefined
    const businessUnitAvg = metricsTypes.includes('businessUnitAvg')
      ? await this.customerRepository.findCustomerReachCountBusinessUnitAvg({
          staffId,
          customerType,
          startDate,
          endDate,
          businessUnit,
        })
      : undefined
    const businessUnitTotal = metricsTypes.includes('businessUnitTotal')
      ? await this.customerRepository.findBusinessUnitCustomerReachCount({
          customerType,
          startDate,
          endDate,
          businessUnit,
        })
      : undefined
    return { current, businessUnitAvg, businessUnitTotal }
  }

  public async getCustomerAvgVisitCount(
    {
      staffId,
      customerType,
      startDate,
      endDate,
      businessUnit,
    }: IQueryArguments,
    metricsTypes: string[],
  ): Promise<ISalesPerformanceData> {
    const current = metricsTypes.includes('current')
      ? await this.customerRepository.findCustomerAvgVisitCount({
          staffId,
          customerType,
          startDate,
          endDate,
          businessUnit,
        })
      : undefined
    const businessUnitAvg = metricsTypes.includes('businessUnitAvg')
      ? await this.customerRepository.findCustomerAvgVisitCountBusinessUnitAvg({
          staffId,
          customerType,
          startDate,
          endDate,
          businessUnit,
        })
      : undefined

    return { current, businessUnitAvg }
  }

  public async getAvgDaysSinceLastPurchase(
    {
      staffId,
      customerType,
      startDate,
      endDate,
      businessUnit,
    }: IQueryArguments,
    metricsTypes: string[],
  ): Promise<ISalesPerformanceData> {
    // TODO: use handlers mentioned in this PR: https://github.com/LCJG-BetaLabs/elsie-serverless-functions/pull/140
    const current = metricsTypes.includes('current')
      ? await this.customerRepository.findAvgDaysSinceLastPurchase({
          staffId,
          customerType,
          startDate,
          endDate,
          businessUnit,
        })
      : undefined
    const businessUnitAvg = metricsTypes.includes('businessUnitAvg')
      ? await this.customerRepository.findAvgDaysSinceLastPurchaseBusinessUnitAvg(
          {
            staffId,
            customerType,
            startDate,
            endDate,
            businessUnit,
          },
        )
      : undefined

    return { current, businessUnitAvg }
  }

  public async getTopBrands({
    staffId,
    customerType,
    startDate,
    endDate,
    businessUnit,
  }: IQueryArguments): Promise<ITopBrands[] | null> {
    const data = await this.customerRepository.findTopBrands({
      staffId,
      customerType,
      startDate,
      endDate,
      businessUnit,
    })
    return data
  }

  public async getClienteleCustomerCount({
    staffId,
    customerTypes,
  }: IClienteleCustomerCountInput): Promise<IClienteleCustomerCountOutput[]> {
    const data = customerTypes.includes(CustomerTypeEnum.ALL)
      ? await this.customerRepository.findAllClienteleCustomerCount({
          staffId,
          customerTypes,
        })
      : this.customerRepository.findClienteleCustomerCountByCustomerTypes({
          staffId,
          customerTypes,
        })
    return data
  }

  public async getClienteleCustomerCountByBusinessUnit({
    businessUnit,
    customerTypes,
  }: IClienteleCustomerCountByBusinessUnitInput): Promise<
    IClienteleCustomerCountOutput[]
  > {
    const data = customerTypes.includes(CustomerTypeEnum.ALL)
      ? await this.customerRepository.findAllClienteleCustomerCountByBusinessUnit(
          {
            businessUnit,
            customerTypes,
          },
        )
      : this.customerRepository.findClienteleCustomerCountByBusinessUnitAndCustomerTypes(
          {
            businessUnit,
            customerTypes,
          },
        )
    return data
  }

  public async getClienteleTestMetrics(
    staffID: string,
    startDate: string,
    endDate: string,
  ) {
    const data = await this.customerRepository.findClienteleTestDataByStaffId(
      staffID,
      startDate,
      endDate,
    )

    const topBrands = data
      .map(({ brand, count, name }) => {
        return name === 'topBrands' ? { brand, count } : undefined
      })
      .filter((d) => d != undefined)

    const returnCustomer = data
      .map(({ current, businessUnitAvg, businessUnitTotal, name }) => {
        return name === 'return'
          ? { current, businessUnitAvg, businessUnitTotal }
          : undefined
      })
      .filter((d) => d != undefined)[0]

    const reach = data
      .map(({ current, businessUnitAvg, businessUnitTotal, name }) => {
        return name === 'reach'
          ? { current, businessUnitAvg, businessUnitTotal }
          : undefined
      })
      .filter((d) => d != undefined)[0]

    const avgVisits = data
      .map(({ current, businessUnitAvg, name }) => {
        return name === 'avgVisits' ? { current, businessUnitAvg } : undefined
      })
      .filter((d) => d != undefined)[0]

    const avgDaysSinceLastPurchase = data
      .map(({ current, businessUnitAvg, name }) => {
        return name === 'avgDaysSinceLastPurchase'
          ? { current, businessUnitAvg }
          : undefined
      })
      .filter((d) => d != undefined)[0]

    return {
      topBrands,
      return: returnCustomer,
      reach,
      avgVisits,
      avgDaysSinceLastPurchase,
    }
  }

  public async getTestCustomerCounts(
    staffID: string
  ) {
    const data = await this.customerRepository.findTestCustomerCountsByStaffId(
      staffID
    )
    return data.map(({ count, customerType }) => {
      return {
        count,
        type: customerType,
      }
    })
  }

  public async getTestBusinessUnitCustomerCounts(
    staffID: string
  ) {
    const data =
      await this.customerRepository.findTestBusinessUnitCustomerCountsByStaffId(
        staffID
      )
    return data.map(({ count, customerType }) => {
      return {
        count,
        type: customerType,
      }
    })
  }
}
