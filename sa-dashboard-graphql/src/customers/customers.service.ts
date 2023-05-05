import { IQueryArguments } from '../common/interfaces/query.interfaces'
import { ISalesPerformanceData, ITopBrands } from '../common/interfaces/sales.interfaces'
import { customerRepository } from './customers.repository'

class CustomerService {
  
  constructor() {}

  public async getCustomerReturnCount(args: IQueryArguments): Promise<ISalesPerformanceData> {
    const { metricsTypes, businessUnit } = args
    const output: ISalesPerformanceData = { current: null, businessUnitAvg: null }
    if (metricsTypes.includes('current')) {
      const currentData = await customerRepository.findCustomerReturnCount(args)
      output['current'] = currentData
    }
    if (metricsTypes.includes('businessUnitAvg') && businessUnit !== null && businessUnit !== undefined) {
      const businessUnitAvgData = await customerRepository.findCustomerReturnCountBusinessUnitAvg(args)
      output['businessUnitAvg'] = businessUnitAvgData
    }
    return output
  }

  public async getCustomerReachCount (args: IQueryArguments) : Promise<ISalesPerformanceData> {
    const { metricsTypes, businessUnit } = args
    const output: ISalesPerformanceData = { current: null, businessUnitAvg: null }
    if (metricsTypes.includes('current')) {
      const currentData = await customerRepository.findCustomerReachCount(args)
      output['current'] = currentData
    }
    if (metricsTypes.includes('businessUnitAvg') && businessUnit !== null && businessUnit !== undefined) {
      const businessUnitAvgData = await customerRepository.findCustomerReachCountBusinessUnitAvg(args)
      output['businessUnitAvg'] = businessUnitAvgData
    }
    return output
  }

  public async getCustomerAvgVisitCount(args: IQueryArguments): Promise<ISalesPerformanceData> {
    const { metricsTypes, businessUnit } = args
    const current = metricsTypes.includes('current') ? await customerRepository.findCustomerAvgVisitCount(args) : null
    const businessUnitAvg = metricsTypes.includes('businessUnitAvg' ) && businessUnit !== null && businessUnit !== undefined ? await customerRepository.findCustomerAvgVisitCountBusinessUnitAvg(args) : null
    return { current, businessUnitAvg }
  }

  public async getAvgDaysSinceLastPurchase(args: IQueryArguments): Promise<ISalesPerformanceData> {
    const { metricsTypes, businessUnit } = args
    const output: ISalesPerformanceData = { current: null, businessUnitAvg: null }
    if (metricsTypes.includes('current')) {
      const currentData = await customerRepository.findAvgDaysSinceLastPurchase(args)
      output['current'] = currentData
    }
    if (metricsTypes.includes('businessUnitAvg') && businessUnit !== null && businessUnit !== undefined) {
      const businessUnitAvgData = await customerRepository.findAvgDaysSinceLastPurchaseBusinessUnitAvg(args)
      output['businessUnitAvg'] = businessUnitAvgData
    }
    return output
  }

  public async getTopBrands(args: IQueryArguments): Promise<ITopBrands[] | null> {
    const data = await customerRepository.findTopBrands(args)
    return data
  }
}

export const customerService = new CustomerService()
