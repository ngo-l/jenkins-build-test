import { CustomerTypeEnum } from '../../customers/customers.enum'
import { CurrencyType } from '../types/query.types'

export interface IQueryArguments {
  staffId?: string
  customerType: string[]
  startDate: Date
  endDate: Date
  businessUnit?: string
  currencyType?: CurrencyType
}

interface IResolversArguments {
  staffId: string
  userId: string
  customerType: CustomerTypeEnum[]
  startDate: Date
  endDate: Date
}

export interface IResolverArgumentData {
  data: IResolversArguments
}

export interface ICustomerCountQueryOutput {
  customerCount: number
}

export interface ITestDataFields {
  queryName: string
  name: string
  current: number
  businessUnitAvg: number
  businessUnitTotal: number
  currencyType: string
  brand: string
  count: number
  customerType: string

}
