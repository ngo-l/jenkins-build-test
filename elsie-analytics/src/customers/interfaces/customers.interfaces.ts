import { ISalesPerformanceData } from 'src/common/interfaces/sales.interfaces'

export interface ICustomerReachCountOutput {
  customerCount: number
}

export interface ITopBrands {
  brand: string
  count: number
}

export interface IClienteleCustomerCountInput {
  staffId: string
  customerTypes: string[]
}

export interface IClienteleCustomerCountOutput {
  count: number
  type?: string
}

export interface IClienteleCustomerCountByBusinessUnitInput {
  businessUnit: string
  customerTypes: string[]
}

export interface IclientelingPerformanceMetricsDataOutput {
  return?: ISalesPerformanceData
  reach?: ISalesPerformanceData
  avgVisits?: ISalesPerformanceData
  avgDaysSinceLastPurchase?: ISalesPerformanceData
  topBrands?: ITopBrands[]
}
