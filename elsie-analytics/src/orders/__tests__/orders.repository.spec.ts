import { Test, TestingModule } from '@nestjs/testing'
import { DatabaseConnector } from '../../common/database/database.connector'
import { DatabaseModule } from '../../common/database/database.module'
import { Logger } from '../../common/logger/logger.service'
import { IQueryArguments } from '../../common/interfaces/query.interfaces'
import { OrderModule } from '../orders.module'
import { OrderRepository } from '../orders.repository'
import { CustomerTypeEnum } from '../../customers/customers.enum'
import { mockDatabaseConnector } from '../../common/database/__mocks__/database.connector'

describe('Order Repository', () => {
  let orderRepository: OrderRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [OrderModule, DatabaseModule],
      providers: [OrderRepository, Logger, DatabaseConnector],
    })
      .overrideProvider(DatabaseConnector)
      .useValue(mockDatabaseConnector)
      .compile()

    orderRepository = module.get<OrderRepository>(OrderRepository)
  })

  describe('find order count', () => {
    it('should return the order count', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      mockedDatabase.groupBy.mockResolvedValueOnce([
        { trans_type: '01', order_count: 5 },
        { trans_type: '02', order_count: 3 },
      ])
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
      }
      const output = await orderRepository.findOrderCount(args)
      expect(output).toBe(2)
    })

    it('should return null', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      mockedDatabase.groupBy.mockResolvedValueOnce([])
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
      }
      const output = await orderRepository.findOrderCount(args)
      expect(output).toBe(null)
    })
  })

  describe('find order count business unit avg', () => {
    it('should return null', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: ['ALL'],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
        businessUnit: 'MW',
      }
      mockedDatabase.raw.mockResolvedValueOnce([[]])
      const output1 = await orderRepository.findOrderCountBusinessUnitAvg(args)
      expect(output1).toBe(null)

      mockedDatabase.raw.mockResolvedValueOnce([[{ heelo: 'world' }]])
      const output2 = await orderRepository.findOrderCountBusinessUnitAvg(args)
      expect(output2).toBe(null)
    })

    it('should return the business unit avg', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      mockedDatabase.raw.mockResolvedValueOnce([[{ businessUnitAvg: 55 }]])
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: ['ALL'],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
      }
      const output = await orderRepository.findOrderCountBusinessUnitAvg(args)
      expect(output).toBe(55)
    })
  })

  describe('find avg brand per order count', () => {
    it('should return null', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
        businessUnit: 'MW',
      }
      mockedDatabase.raw.mockResolvedValueOnce([[]])
      const output = await orderRepository.findAvgBrandPerOrderCount(args)
      expect(output).toBe(null)

      const output1 = await orderRepository.findAvgBrandPerOrderCount(args)
      expect(output1).toBe(null)

      mockedDatabase.raw.mockResolvedValueOnce([[{ heelo: 'world' }]])
      const output2 = await orderRepository.findAvgBrandPerOrderCount(args)
      expect(output2).toBe(null)
    })

    it('should return the business unit avg', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      mockedDatabase.raw.mockResolvedValueOnce([[{ current: 55 }]])
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
      }
      const output = await orderRepository.findAvgBrandPerOrderCount(args)
      expect(output).toBe(55)
    })
  })

  describe('find avg brand per order count business unit avg', () => {
    it('should return null', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: ['ALL'],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
        businessUnit: 'MW',
      }
      mockedDatabase.raw.mockResolvedValueOnce([[]])
      const output =
        await orderRepository.findAvgBrandPerOrderCountBusinessUnitAvg(args)
      expect(output).toBe(null)

      mockedDatabase.raw.mockResolvedValueOnce([])
      const output2 =
        await orderRepository.findAvgBrandPerOrderCountBusinessUnitAvg(args)
      expect(output2).toBe(null)

      mockedDatabase.raw.mockResolvedValueOnce([[{ heelo: 'world' }]])
      const output3 =
        await orderRepository.findAvgBrandPerOrderCountBusinessUnitAvg(args)
      expect(output3).toBe(null)
    })

    it('should return the business unit avg', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      mockedDatabase.raw.mockResolvedValueOnce([[{ businessUnitAvg: 55 }]])
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: ['ALL'],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
      }
      const output =
        await orderRepository.findAvgBrandPerOrderCountBusinessUnitAvg(args)
      expect(output).toBe(55)
    })
  })

  describe('find avg basket size', () => {
    it('should return null', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: ['ALL'],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
        businessUnit: 'MW',
      }
      mockedDatabase.raw.mockResolvedValueOnce([[]])
      const output = await orderRepository.findAvgBasketSize(args)
      expect(output).toBe(null)

      mockedDatabase.raw.mockResolvedValueOnce([])
      const output2 = await orderRepository.findAvgBasketSize(args)
      expect(output2).toBe(null)

      mockedDatabase.raw.mockResolvedValueOnce([[{ heelo: 'world' }]])
      const output3 = await orderRepository.findAvgBasketSize(args)
      expect(output3).toBe(null)
    })

    it('should return the number', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      mockedDatabase.raw.mockResolvedValueOnce([[{ current: 55 }]])
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: ['ALL'],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
      }
      const output = await orderRepository.findAvgBasketSize(args)
      expect(output).toBe(55)
    })
  })

  describe('find avg basket size business unit average', () => {
    it('should return null', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: ['ALL'],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
        businessUnit: 'MW',
      }
      mockedDatabase.raw.mockResolvedValueOnce([[]])
      const output = await orderRepository.findAvgBasketSizeBusinessUnitAvg(
        args,
      )
      expect(output).toBe(null)

      mockedDatabase.raw.mockResolvedValueOnce([])
      const output2 = await orderRepository.findAvgBasketSizeBusinessUnitAvg(
        args,
      )
      expect(output2).toBe(null)

      mockedDatabase.raw.mockResolvedValueOnce([[{ heelo: 'world' }]])
      const output3 = await orderRepository.findAvgBasketSizeBusinessUnitAvg(
        args,
      )
      expect(output3).toBe(null)
    })

    it('should return the business unit avg', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      mockedDatabase.raw.mockResolvedValueOnce([[{ businessUnitAvg: 55 }]])
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: ['ALL'],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
      }
      const output = await orderRepository.findAvgBasketSizeBusinessUnitAvg(
        args,
      )
      expect(output).toBe(55)
    })
  })

  describe('find avg number of business unit per order', () => {
    it('should return null', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: ['ALL'],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
      }
      mockedDatabase.raw.mockResolvedValueOnce([[]])
      const output1 = await orderRepository.findAvgBusinessUnitPerOrderCount(
        args,
      )
      expect(output1).toBe(null)
      mockedDatabase.raw.mockResolvedValueOnce([])
      const output2 = await orderRepository.findAvgBusinessUnitPerOrderCount(
        args,
      )
      expect(output2).toBe(null)
      mockedDatabase.raw.mockResolvedValueOnce([[{ heelo: 'world' }]])
      const output3 = await orderRepository.findAvgBusinessUnitPerOrderCount(
        args,
      )
      expect(output3).toBe(null)
    })

    it('should return the number', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      mockedDatabase.raw.mockResolvedValueOnce([[{ current: 55 }]])
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: ['ALL'],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
      }
      const output = await orderRepository.findAvgBusinessUnitPerOrderCount(
        args,
      )
      expect(output).toBe(55)
    })
  })

  describe('find avg number of business unit per order within the business unit', () => {
    it('should return null', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: ['ALL'],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
        businessUnit: 'MW',
      }
      mockedDatabase.raw.mockResolvedValueOnce([[]])
      const output1 =
        await orderRepository.findAvgBusinessUnitPerOrderCountBusinessUnitAvg(
          args,
        )
      expect(output1).toBe(null)

      mockedDatabase.raw.mockResolvedValueOnce([])
      const output2 =
        await orderRepository.findAvgBusinessUnitPerOrderCountBusinessUnitAvg(
          args,
        )
      expect(output2).toBe(null)
      mockedDatabase.raw.mockResolvedValueOnce([[{ heelo: 'world' }]])
      const output3 =
        await orderRepository.findAvgBusinessUnitPerOrderCountBusinessUnitAvg(
          args,
        )
      expect(output3).toBe(null)
    })

    it('should return the business unit avg', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: ['ALL'],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
        businessUnit: 'MW',
      }
      mockedDatabase.raw.mockResolvedValueOnce([[{ businessUnitAvg: 55 }]])
      const output =
        await orderRepository.findAvgBusinessUnitPerOrderCountBusinessUnitAvg(
          args,
        )
      expect(output).toBe(55)
    })
  })

  describe('findSales', () => {
    it('should return null', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
      }
      mockedDatabase.whereIn.mockResolvedValueOnce([{ curren: 55 }])
      const output1 = await orderRepository.findSales(args)
      expect(output1).toBe(null)

      mockedDatabase.whereIn.mockResolvedValueOnce([[{ current: 55 }]])
      const output2 = await orderRepository.findSales(args)
      expect(output2).toBe(null)

      mockedDatabase.whereIn.mockResolvedValueOnce([])
      const output3 = await orderRepository.findSales(args)
      expect(output3).toBe(null)
    })

    it('should return the current sales', async () => {
      const mockResult = 55
      const mockedDatabase = mockDatabaseConnector.getConnection()
      mockedDatabase.whereIn.mockResolvedValueOnce([{ current: mockResult }])
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
      }
      const output = await orderRepository.findSales(args)
      expect(output).toBe(mockResult)
    })
  })

  describe('findSalesBusinessUnitAvg', () => {
    it('should return null', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
      }
      mockedDatabase.avg.mockResolvedValueOnce([{ businessUnit: 55 }])
      const output1 = await orderRepository.findSalesBusinessUnitAvg(args)
      expect(output1).toBe(null)

      mockedDatabase.avg.mockResolvedValueOnce([[{ businessUnitAvg: 55 }]])
      const output2 = await orderRepository.findSalesBusinessUnitAvg(args)
      expect(output2).toBe(null)

      mockedDatabase.avg.mockResolvedValueOnce([])
      const output3 = await orderRepository.findSalesBusinessUnitAvg(args)
      expect(output3).toBe(null)
    })

    it('should return the current sales business unit average', async () => {
      const mockResult = 55
      const mockedDatabase = mockDatabaseConnector.getConnection()
      mockedDatabase.avg.mockResolvedValueOnce([
        { businessUnitAvg: mockResult },
      ])
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
      }
      const output = await orderRepository.findSalesBusinessUnitAvg(args)
      expect(output).toBe(mockResult)
    })
  })

  describe('findAvgBasketValue', () => {
    it('should return the average basket value', async () => {
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
      }
      const mockResult = 55
      const mockedDatabase = mockDatabaseConnector.getConnection()
      mockedDatabase.raw.mockResolvedValueOnce([[{ current: mockResult }]])
      const output = await orderRepository.findAvgBasketValue(args)
      expect(output).toBe(mockResult)
    })

    it('should return null', async () => {
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
      }
      const mockResult = 55
      const mockedDatabase = mockDatabaseConnector.getConnection()
      mockedDatabase.raw.mockResolvedValueOnce([[{ curren: mockResult }]])
      const output = await orderRepository.findAvgBasketValue(args)
      expect(output).toBe(null)
    })
  })

  describe('findAvgBasketValueBusinessUnitAvg', () => {
    it('should return the average basket value', async () => {
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
      }
      const mockResult = 55
      const mockedDatabase = mockDatabaseConnector.getConnection()
      mockedDatabase.raw.mockResolvedValueOnce([
        [{ businessUnitAvg: mockResult }],
      ])
      const output = await orderRepository.findAvgBasketSizeBusinessUnitAvg(
        args,
      )
      expect(output).toBe(mockResult)
    })

    it('should return null', async () => {
      const args: IQueryArguments = {
        staffId: '000787',
        customerType: [CustomerTypeEnum.ALL],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
      }
      const mockResult = 55
      const mockedDatabase = mockDatabaseConnector.getConnection()
      mockedDatabase.raw.mockResolvedValueOnce([
        [{ businessUnitAv: mockResult }],
      ])
      const output = await orderRepository.findAvgBasketSizeBusinessUnitAvg(
        args,
      )
      expect(output).toBe(null)
    })
  })
})
