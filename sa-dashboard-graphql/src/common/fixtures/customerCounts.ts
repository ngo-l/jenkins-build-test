import { fakerClient as faker } from "./client"
import { CustomerType } from '../../customers/customers.types'

export const createRandomCustomerCount = (customerTypes: CustomerType[]) => {
  const res = customerTypes.map((item) => ({
    type: item,
    count: faker.datatype.number({ min: 10, max: 100 }),
  })
)
  return res
}
