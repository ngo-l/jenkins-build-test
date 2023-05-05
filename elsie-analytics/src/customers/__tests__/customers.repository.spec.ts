import { Test, TestingModule } from '@nestjs/testing'
import { DatabaseConnector } from '../../common/database/database.connector'
import { DatabaseModule } from '../../common/database/database.module'
import { Logger } from '../../common/logger/logger.service'
import { CustomerModule } from '../customers.module'
import { CustomerRepository } from '../customers.repository'
import { IQueryArguments } from '../../common/interfaces/query.interfaces'
import { CustomerTypeEnum } from '../customers.enum'
import { mockDatabaseConnector } from '../../common/database/__mocks__/database.connector'
import {
  IClienteleCustomerCountByBusinessUnitInput,
  IClienteleCustomerCountInput,
} from '../interfaces/customers.interfaces'

describe('Customer Repository', () => {
  let customerRepository: CustomerRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CustomerModule, DatabaseModule],
      providers: [CustomerRepository, Logger, DatabaseConnector],
    })
      .overrideProvider(DatabaseConnector)
      .useValue(mockDatabaseConnector)
      .compile()

    customerRepository = module.get<CustomerRepository>(CustomerRepository)
  })

  describe('find customer return count', () => {
    it('should return customer return count', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      mockedDatabase.groupBy.mockResolvedValueOnce([{ customerCount: 5 }])
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
      }
      const output = await customerRepository.findCustomerReturnCount(args)
      expect(output).toBe(5)
    })

    it('should return null', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()

      const args: IQueryArguments = {
        staffId: '000787',
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
      }

      mockedDatabase.groupBy.mockResolvedValueOnce([])
      const output = await customerRepository.findCustomerReturnCount(args)
      expect(output).toBe(null)
    })
  })

  describe('find customer return count business avg', () => {
    it('should return customer return count business avg', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      mockedDatabase.avg.mockResolvedValueOnce([{ businessUnitAvg: 5 }])
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
      }
      const businessUnit = 'MW'
      const output =
        await customerRepository.findCustomerReturnCountBusinessUnitAvg(
          args,
          businessUnit,
        )
      expect(output).toBe(5)
    })
  })

  describe('find customer reach count', () => {
    it('should return customer reach count', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      mockedDatabase.groupBy.mockResolvedValueOnce([{ customerCount: 5 }])
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
      }
      const output = await customerRepository.findCustomerReachCount(args)
      expect(output).toBe(5)
    })

    it('should return null', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
      }
      mockedDatabase.groupBy.mockResolvedValueOnce([])
      const output = await customerRepository.findCustomerReachCount(args)
      expect(output).toBe(null)

      mockedDatabase.groupBy.mockResolvedValueOnce([{ customerCount: 'hello' }])
      const output1 = await customerRepository.findCustomerReachCount(args)
      expect(output1).toBe('hello')
    })
  })

  describe('find customer return count business avg', () => {
    it('should return customer return count business avg', async () => {
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
        businessUnit: 'MW',
      }

      const mockedDatabase = mockDatabaseConnector.getConnection()
      mockedDatabase.avg.mockResolvedValueOnce([{ businessUnitAvg: 5 }])

      const output =
        await customerRepository.findCustomerReachCountBusinessUnitAvg(args)
      expect(output).toBe(5)
    })
  })

  describe('find customer return count business unit total', () => {
    it('should return customer return count business unit total', async () => {
      const args: IQueryArguments = {
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
        businessUnit: 'MW',
      }

      const mockedDatabase = mockDatabaseConnector.getConnection()
      mockedDatabase.whereIn.mockResolvedValueOnce([{ customerCount: 5 }])

      const output =
        await customerRepository.findBusinessUnitCustomerReachCount(args)
      expect(output).toBe(5)
    })
  })

  describe('find customer avg visit count', () => {
    it('should return null', async () => {
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
        businessUnit: 'MW',
      }

      const mockedDatabase = mockDatabaseConnector.getConnection()

      mockedDatabase.raw.mockResolvedValueOnce([])
      const output = await customerRepository.findCustomerAvgVisitCount(args)
      expect(output).toBe(null)

      mockedDatabase.raw.mockResolvedValueOnce([[]])
      const output2 = await customerRepository.findCustomerAvgVisitCount(args)
      expect(output2).toBe(null)

      mockedDatabase.raw.mockResolvedValueOnce([[{ hello: 1 }]])
      const output3 = await customerRepository.findCustomerAvgVisitCount(args)
      expect(output3).toBe(null)
    })

    it('should return a number', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      const mockResult = 99999

      const args: IQueryArguments = {
        staffId: '000787',
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
        businessUnit: 'MW',
      }
      mockedDatabase.raw.mockResolvedValueOnce([[{ current: 99999 }]])
      const output = await customerRepository.findCustomerAvgVisitCount(args)
      expect(output).toBe(mockResult)
    })
  })

  describe('find customer avg visit count business avg', () => {
    it('should return null', async () => {
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
        businessUnit: 'MW',
      }

      const mockedDatabase = mockDatabaseConnector.getConnection()

      mockedDatabase.raw.mockResolvedValueOnce([])
      const output =
        await customerRepository.findCustomerAvgVisitCountBusinessUnitAvg(args)
      expect(output).toBe(null)

      mockedDatabase.raw.mockResolvedValueOnce([[]])
      const output2 =
        await customerRepository.findCustomerAvgVisitCountBusinessUnitAvg(args)
      expect(output2).toBe(null)

      mockedDatabase.raw.mockResolvedValueOnce([[{ hello: 1 }]])
      const output3 =
        await customerRepository.findCustomerAvgVisitCountBusinessUnitAvg(args)
      expect(output3).toBe(null)
    })

    it('should return a number', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      const mockResult = 99999

      const args: IQueryArguments = {
        staffId: '000787',
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
        businessUnit: 'MW',
      }
      mockedDatabase.raw.mockResolvedValueOnce([[{ businessUnitAvg: 99999 }]])
      const output =
        await customerRepository.findCustomerAvgVisitCountBusinessUnitAvg(args)
      expect(output).toBe(mockResult)
    })
  })

  describe('find avg days since last purchase', () => {
    it('should return null', async () => {
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
        businessUnit: 'MW',
      }

      const mockedDatabase = mockDatabaseConnector.getConnection()

      mockedDatabase.raw.mockResolvedValueOnce([])
      const output = await customerRepository.findAvgDaysSinceLastPurchase(args)
      expect(output).toBe(null)

      mockedDatabase.raw.mockResolvedValueOnce([[]])
      const output2 = await customerRepository.findAvgDaysSinceLastPurchase(
        args,
      )
      expect(output2).toBe(null)

      mockedDatabase.raw.mockResolvedValueOnce([[{ hello: 1 }]])
      const output3 = await customerRepository.findAvgDaysSinceLastPurchase(
        args,
      )
      expect(output3).toBe(null)
    })

    it('should return a number', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      const mockResult = 99999

      const args: IQueryArguments = {
        staffId: '000787',
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
        businessUnit: 'MW',
      }
      mockedDatabase.raw.mockResolvedValueOnce([[{ days: 99999 }]])
      const output = await customerRepository.findAvgDaysSinceLastPurchase(args)
      expect(output).toBe(mockResult)
    })
  })

  describe('find avg days since last purchase business unit avg', () => {
    it('should return null', async () => {
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
        businessUnit: 'MW',
      }

      const mockedDatabase = mockDatabaseConnector.getConnection()

      mockedDatabase.raw.mockResolvedValueOnce([])
      const output =
        await customerRepository.findAvgDaysSinceLastPurchaseBusinessUnitAvg(
          args,
        )
      expect(output).toBe(null)

      mockedDatabase.raw.mockResolvedValueOnce([[]])
      const output2 =
        await customerRepository.findAvgDaysSinceLastPurchaseBusinessUnitAvg(
          args,
        )
      expect(output2).toBe(null)

      mockedDatabase.raw.mockResolvedValueOnce([[{ hello: 1 }]])
      const output3 =
        await customerRepository.findAvgDaysSinceLastPurchaseBusinessUnitAvg(
          args,
        )
      expect(output3).toBe(null)
    })

    it('should return a number', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      const mockResult = 99999

      const args: IQueryArguments = {
        staffId: '000787',
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
        businessUnit: 'MW',
      }
      mockedDatabase.raw.mockResolvedValueOnce([[{ businessUnitAvg: 99999 }]])
      const output =
        await customerRepository.findAvgDaysSinceLastPurchaseBusinessUnitAvg(
          args,
        )
      expect(output).toBe(mockResult)
    })
  })

  describe('find top brands', () => {
    it('should return null', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      const mockResult = []
      mockedDatabase.limit.mockResolvedValueOnce(mockResult)
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: ['ALL'],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
      }
      const output = await customerRepository.findTopBrands(args)
      expect(output).toBe(mockResult)
    })

    it('should return an array of objects that each contain the brand name and its count', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      const mockResult = [{ brand: 'LCJG', count: 99999 }]
      mockedDatabase.limit.mockResolvedValueOnce(mockResult)
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: ['ALL'],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
      }
      const output = await customerRepository.findTopBrands(args)
      expect(output).toBe(mockResult)
    })
  })

  describe('find clientele customer count', () => {
    it('should return an array of objects only with the key of count if the customerType includes "ALL"', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      const args: IClienteleCustomerCountInput = {
        staffId: '000787',
        customerTypes: [CustomerTypeEnum.ALL],
      }
      const mockResult = [{ count: 99999, type: 'ALL' }]
      const mockResolvedValue = [{ count: 99999, type: 'ALL' }]
      mockedDatabase.where.mockResolvedValueOnce(mockResolvedValue)

      const output = await customerRepository.findAllClienteleCustomerCount(
        args,
      )
      expect(output).toEqual(mockResult)

      const args1: IClienteleCustomerCountInput = {
        staffId: '000787',
        customerTypes: [CustomerTypeEnum.ALL, CustomerTypeEnum.CORE],
      }
      mockedDatabase.where.mockResolvedValueOnce(mockResolvedValue)
      const output1 = await customerRepository.findAllClienteleCustomerCount(
        args1,
      )
      expect(output1).toEqual(mockResult)
    })

    it('should return an array of objects only with the key of count and type if the customerType DOES NOT include "ALL"', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      const mockResolvedValue = [
        { count: 99999, type: 'Potential' },
        { count: 44444, type: 'Core' },
      ]
      const mockResult = [
        { count: 99999, type: 'POTENTIAL' },
        { count: 44444, type: 'CORE' },
      ]
      mockedDatabase.groupBy.mockResolvedValueOnce(mockResolvedValue)

      const args: IClienteleCustomerCountInput = {
        staffId: '000787',
        customerTypes: [CustomerTypeEnum.CORE, CustomerTypeEnum.POTENTIAL],
      }
      const output =
        await customerRepository.findClienteleCustomerCountByCustomerTypes(args)
      expect(output).toEqual(mockResult)
    })
  })

  describe('find clientele customer business unit count', () => {
    it('should return an array of objects only with the key of count if the customerType includes "ALL"', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      const args: IClienteleCustomerCountByBusinessUnitInput = {
        businessUnit: 'MW',
        customerTypes: [CustomerTypeEnum.ALL],
      }
      const mockResult = [{ count: 99999, type: 'ALL' }]
      const mockResolvedValue = [{ count: 99999, type: 'ALL' }]
      mockedDatabase.where.mockResolvedValueOnce(mockResolvedValue)

      const output =
        await customerRepository.findAllClienteleCustomerCountByBusinessUnit(
          args,
        )
      expect(output).toEqual(mockResult)

      const args1: IClienteleCustomerCountByBusinessUnitInput = {
        businessUnit: 'MW',
        customerTypes: [CustomerTypeEnum.ALL, CustomerTypeEnum.CORE],
      }
      mockedDatabase.where.mockResolvedValueOnce(mockResolvedValue)
      const output1 =
        await customerRepository.findAllClienteleCustomerCountByBusinessUnit(
          args1,
        )
      expect(output1).toEqual(mockResult)
    })

    it('should return an array of objects only with the key of count and type if the customerType DOES NOT include "ALL"', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      const mockResolvedValue = [
        { count: 99999, type: 'Potential' },
        { count: 44444, type: 'Core' },
      ]
      const mockResult = [
        { count: 99999, type: 'POTENTIAL' },
        { count: 44444, type: 'CORE' },
      ]
      mockedDatabase.groupBy.mockResolvedValueOnce(mockResolvedValue)

      const args: IClienteleCustomerCountByBusinessUnitInput = {
        businessUnit: 'MW',
        customerTypes: [CustomerTypeEnum.CORE, CustomerTypeEnum.POTENTIAL],
      }
      const output =
        await customerRepository.findClienteleCustomerCountByBusinessUnitAndCustomerTypes(
          args,
        )
      expect(output).toEqual(mockResult)
    })
  })
})
