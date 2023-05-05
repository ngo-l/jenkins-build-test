import { IQueryArguments } from '../common/interfaces/query.interfaces'
import { ISalesPerformanceData } from '../common/interfaces/sales.interfaces'
import { orderRepository } from './orders.repository'

class OrderService {
  
  constructor() {}
  
  public async getSalesAmount(args: IQueryArguments): Promise<ISalesPerformanceData> {
    const current = await orderRepository.getSalesAmount(args)
    const businessUnitAvg = await orderRepository.getSalesAmountBusinessUnitAvg(args)
    return { current, businessUnitAvg }
  }

  public async getOrderCount(args: IQueryArguments): Promise<ISalesPerformanceData> {
    const { metricsTypes, businessUnit } = args
    const output: ISalesPerformanceData = { current: null, businessUnitAvg: null }
    if (metricsTypes.includes('current')) {
      const currentData = await orderRepository.findOrderCount(args)
      output['current'] = currentData
    }
    if (metricsTypes.includes('businessUnitAvg') && businessUnit !== null && businessUnit !== undefined) {
      const businessUnitAvgData = await orderRepository.findOrderCountBusinessUnitAvg(args)
      output['businessUnitAvg'] = businessUnitAvgData
    }
    return output
  }

  public async getAvgBrandPerOrderCount(args: IQueryArguments): Promise<ISalesPerformanceData> {
    const { metricsTypes, businessUnit } = args
    const output: ISalesPerformanceData = { current: null, businessUnitAvg: null }
    if (metricsTypes.includes('current')) {
      const currentData = await orderRepository.findAvgBrandPerOrderCount(args)
      output['current'] = currentData
    }
    if (metricsTypes.includes('businessUnitAvg') && businessUnit !== null && businessUnit !== undefined) {
      const businessUnitAvgData = await orderRepository.findAvgBrandPerOrderCountBusinessUnitAvg(args)
      output['businessUnitAvg'] = businessUnitAvgData
    }
    return output
  }

  public async getAvgBasketSize(args: IQueryArguments): Promise<ISalesPerformanceData> {
    const { metricsTypes, businessUnit } = args
    const output: ISalesPerformanceData = { current: null, businessUnitAvg: null }
    if (metricsTypes.includes('current')) {
      const currentData = await orderRepository.findAvgBasketSize(args)
      output['current'] = currentData
    }
    if (metricsTypes.includes('businessUnitAvg') && businessUnit !== null && businessUnit !== undefined) {
      const businessUnitAvgData = await orderRepository.findAvgBasketSizeBusinessUnitAvg(args)
      output['businessUnitAvg'] = businessUnitAvgData
    }
    return output
  }

  public async getAvgBasketValue(args: IQueryArguments): Promise<ISalesPerformanceData> {
    const current = await orderRepository.getAvgBasketValue(args)
    const businessUnitAvg = await orderRepository.getAvgBasketValueBusinessUnitAvg(args)
    return { current, businessUnitAvg }
  }

  public async getAvgBusinessUnitPerOrderCount(args: IQueryArguments): Promise<ISalesPerformanceData> {
    const { metricsTypes, businessUnit } = args
    const output: ISalesPerformanceData = { current: null, businessUnitAvg: null }
    if (metricsTypes.includes('current')) {
      const currentData = await orderRepository.findAvgBusinessUnitPerOrderCount(args)
      output['current'] = currentData
    }
    if (metricsTypes.includes('businessUnitAvg') && businessUnit !== null && businessUnit !== undefined) {
      const businessUnitAvgData = await orderRepository.findAvgBusinessUnitPerOrderCountBusinessUnitAvg(args)
      output['businessUnitAvg'] = businessUnitAvgData
    }
    return output
  }
}

export const orderService = new OrderService()
