export interface ISalesPerformanceData {
  current: number
  businessUnitAvg?: number
  currencyType?: string
}

export interface IReachCustomerDataOutput extends ISalesPerformanceData {
  businessUnitTotal?: number
}

export interface IReturnCustomerDataOutput extends ISalesPerformanceData {
  businessUnitTotal?: number
}
