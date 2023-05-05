import { CustomerType } from "../../customers/customers.types"

export interface IQueryArguments {
    staffId?: string
    customerType: CustomerType[]
    startDate: Date
    endDate: Date
    businessUnit?: string
    metricsTypes?: string[]
} 

interface IResolversArguments {
    staffId: string
    userId: string
    customerType: CustomerType[]
    startDate: Date
    endDate: Date
}

export interface IResolverArgumentData {
    data: IResolversArguments
}

export interface ICustomerCountQueryOutput {
    customerCount: number
  }
