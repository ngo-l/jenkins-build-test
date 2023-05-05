import { Injectable } from '@nestjs/common'
import { IQueryArguments } from 'src/common/interfaces/query.interfaces'
import { ISalesPerformanceData } from 'src/common/interfaces/sales.interfaces'
import { OrderRepository } from './orders.repository'

@Injectable()
export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  public async getOrderCount(
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
      ? await this.orderRepository.findOrderCount({
          staffId,
          customerType,
          startDate,
          endDate,
          businessUnit,
        })
      : undefined
    const businessUnitAvg = metricsTypes.includes('businessUnitAvg')
      ? await this.orderRepository.findOrderCountBusinessUnitAvg({
          customerType,
          startDate,
          endDate,
          businessUnit,
        })
      : undefined
    return { current, businessUnitAvg }
  }

  public async getAvgBrandPerOrderCount(
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
      ? await this.orderRepository.findAvgBrandPerOrderCount({
          staffId,
          customerType,
          startDate,
          endDate,
          businessUnit,
        })
      : undefined
    const businessUnitAvg = metricsTypes.includes('businessUnitAvg')
      ? await this.orderRepository.findAvgBrandPerOrderCountBusinessUnitAvg({
          customerType,
          startDate,
          endDate,
          businessUnit,
        })
      : undefined
    return { current, businessUnitAvg }
  }

  public async getAvgBasketSize(
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
      ? await this.orderRepository.findAvgBasketSize({
          staffId,
          customerType,
          startDate,
          endDate,
          businessUnit,
        })
      : undefined
    const businessUnitAvg = metricsTypes.includes('businessUnitAvg')
      ? await this.orderRepository.findAvgBasketSizeBusinessUnitAvg({
          customerType,
          startDate,
          endDate,
          businessUnit,
        })
      : undefined
    return { current, businessUnitAvg }
  }

  public async getAvgBusinessUnitPerOrderCount(
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
      ? await this.orderRepository.findAvgBusinessUnitPerOrderCount({
          staffId,
          customerType,
          startDate,
          endDate,
          businessUnit,
        })
      : undefined
    const businessUnitAvg = metricsTypes.includes('businessUnitAvg')
      ? await this.orderRepository.findAvgBusinessUnitPerOrderCountBusinessUnitAvg(
          {
            customerType,
            startDate,
            endDate,
            businessUnit,
          },
        )
      : undefined
    return { current, businessUnitAvg }
  }

  public async getSalesAmount(
    {
      staffId,
      customerType,
      startDate,
      endDate,
      businessUnit,
      currencyType,
    }: IQueryArguments,
    metricsTypes: string[],
  ): Promise<ISalesPerformanceData> {
    const current = metricsTypes.includes('current')
      ? await this.orderRepository.findSales({
          staffId,
          customerType,
          startDate,
          endDate,
          businessUnit,
          currencyType,
        })
      : undefined
    const businessUnitAvg = metricsTypes.includes('businessUnitAvg')
      ? await this.orderRepository.findSalesBusinessUnitAvg({
          customerType,
          startDate,
          endDate,
          businessUnit,
          currencyType,
        })
      : undefined
    return { current, businessUnitAvg, currencyType }
  }

  public async getAvgBasketValue(
    {
      staffId,
      customerType,
      startDate,
      endDate,
      businessUnit,
      currencyType,
    }: IQueryArguments,
    metricsTypes: string[],
  ): Promise<ISalesPerformanceData> {
    const current = metricsTypes.includes('current')
      ? await this.orderRepository.findAvgBasketValue({
          staffId,
          customerType,
          startDate,
          endDate,
          businessUnit,
          currencyType,
        })
      : undefined
    const businessUnitAvg = metricsTypes.includes('businessUnitAvg')
      ? await this.orderRepository.findAvgBasketValueBusinessUnitAvg({
          customerType,
          startDate,
          endDate,
          businessUnit,
          currencyType,
        })
      : undefined
    return { current, businessUnitAvg, currencyType }
  }

  public async getSalesPerformanceTestData(
    staffId: string,
    startDate: string,
    endDate: string,
  ) {
    const data = await this.orderRepository.findSalesPerformanceTestData(
      staffId,
      startDate,
      endDate,
    )

    const sales = data
      .map(({ current, businessUnitAvg, name }) => {
        return name === 'sales' ? { current, businessUnitAvg } : undefined
      })
      .filter((d) => d != undefined)[0]

    const orderCount = data
      .map(({ current, businessUnitAvg, name }) => {
        return name === 'orderCount' ? { current, businessUnitAvg } : undefined
      })
      .filter((d) => d != undefined)[0]

    const avgBusinessUnitPerOrderCount = data
      .map(({ current, businessUnitAvg, name }) => {
        return name === 'avgBusinessUnitPerOrderCount'
          ? { current, businessUnitAvg }
          : undefined
      })
      .filter((d) => d != undefined)[0]

    const avgBrandPerOrderCount = data
      .map(({ current, businessUnitAvg, name }) => {
        return name === 'avgBrandPerOrderCount'
          ? { current, businessUnitAvg }
          : undefined
      })
      .filter((d) => d != undefined)[0]

    const avgBasketSize = data
      .map(({ current, businessUnitAvg, name }) => {
        return name === 'avgBasketSize'
          ? { current, businessUnitAvg }
          : undefined
      })
      .filter((d) => d != undefined)[0]

    const avgBasketAmount = data
      .map(({ current, businessUnitAvg, name }) => {
        return name === 'avgBasketAmount'
          ? { current, businessUnitAvg }
          : undefined
      })
      .filter((d) => d != undefined)[0]

    return {
      sales,
      orderCount,
      avgBusinessUnitPerOrderCount,
      avgBrandPerOrderCount,
      avgBasketSize,
      avgBasketAmount,
    }
  }
}
