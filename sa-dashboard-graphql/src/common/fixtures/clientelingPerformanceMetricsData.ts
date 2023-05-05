import { fakerClient as faker } from "./client"

export const createRandomClientelingPerformanceMetricsData = () => {
  return {
    sales: {
      current: faker.datatype.number({ min: 100000, max: 999999, }),
      target: faker.datatype.number({ min: 100000, max: 999999, }),
      businessUnitAvg: faker.datatype.number({ min: 100000, max: 999999, }),
      currencyType: 'HKD'
    },
    reach: {
      current: faker.datatype.number({ min: 10, max: 100, }),
      target: faker.datatype.number({ min: 10, max: 100, }),
      businessUnitAvg: faker.datatype.number({ min: 10, max: 100, })
    },
    return: {
      current: faker.datatype.number({ min: 10, max: 100, }),
      target: faker.datatype.number({ min: 10, max: 100, }),
      businessUnitAvg: faker.datatype.number({ min: 10, max: 100, })
    },
    avgVisits: {
      current: faker.datatype.number({ min: 1, max: 10, }),
      target: faker.datatype.number({ min: 1, max: 10, }),
      businessUnitAvg: faker.datatype.number({ min: 1, max: 10, })
    },
    avgBasketSize: {
      current: faker.datatype.float({ min: 1, max: 5, precision: 0.1 }),
      target: faker.datatype.float({ min: 1, max: 5, precision: 0.1 }),
      businessUnitAvg: faker.datatype.float({ min: 1, max: 5, precision: 0.1 })
    },
    avgBasketAmount: {
      current: faker.datatype.number({ min: 1000, max: 9999, }),
      target: faker.datatype.number({ min: 1000, max: 9999, }),
      businessUnitAvg: faker.datatype.number({ min: 1000, max: 9999, }),
      currencyType: 'HKD'
    },
    avgDaysSinceLastPurchase: {
      current: faker.datatype.number({ min: 1, max: 31, }),
      target: faker.datatype.number({ min: 1, max: 31, }),
      businessUnitAvg: faker.datatype.number({ min: 1, max: 31, })
    }
  }
}
