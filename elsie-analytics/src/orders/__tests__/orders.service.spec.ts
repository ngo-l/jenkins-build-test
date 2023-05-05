import { IQueryArguments } from '../../common/interfaces/query.interfaces'
import { Test, TestingModule } from '@nestjs/testing'
import { Logger } from '../../common/logger/logger.service'
import { DatabaseConnector } from '../../common/database/database.connector'
import { DatabaseModule } from '../../common/database/database.module'
import { OrderService } from '../orders.service'
import { OrderRepository } from '../orders.repository'
import { OrderModule } from '../orders.module'
import { mockDatabaseConnector } from '../../common/database/__mocks__/database.connector'

describe('Order Service', () => {
  let orderService: OrderService
  let orderRepository: OrderRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [OrderModule, DatabaseModule],
      providers: [OrderRepository, Logger],
    })
      .overrideProvider(DatabaseConnector)
      .useValue(mockDatabaseConnector)
      .compile()

    orderService = module.get<OrderService>(OrderService)
    orderRepository = module.get<OrderRepository>(OrderRepository)
  })

  describe('Order Count', () => {
    it('should return the order count (current and business unit average) given the args', async () => {
      const args: IQueryArguments = {
        staffId: '123',
        customerType: ['ALL'],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
        businessUnit: 'MW',
      }
      const businessUnitAvg = 150
      const current = 100
      const metricsTypes = ['current', 'businessUnitAvg']
      jest
        .spyOn(orderRepository, 'findOrderCount')
        .mockResolvedValueOnce(current)
      jest
        .spyOn(orderRepository, 'findOrderCountBusinessUnitAvg')
        .mockResolvedValueOnce(businessUnitAvg)

      const result = await orderService.getOrderCount(args, metricsTypes)
      expect(result).toEqual({ businessUnitAvg, current })
    })
  })

  describe('Avg Brand Per Order Count', () => {
    it('should return the average brand per order count (current and business unit average) given the args', async () => {
      const args: IQueryArguments = {
        staffId: '123',
        customerType: ['POTENTIAL', 'CORE'],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
        businessUnit: 'MW',
      }
      const businessUnitAvg = 150
      const current = 100
      const metricsTypes = ['current', 'businessUnitAvg']

      jest
        .spyOn(orderRepository, 'findAvgBrandPerOrderCount')
        .mockResolvedValueOnce(current)
      jest
        .spyOn(orderRepository, 'findAvgBrandPerOrderCountBusinessUnitAvg')
        .mockResolvedValueOnce(businessUnitAvg)

      const result = await orderService.getAvgBrandPerOrderCount(
        args,
        metricsTypes,
      )
      expect(result).toEqual({ businessUnitAvg, current })
    })
  })

  describe('Avg Basket Size', () => {
    it('should return the average basket size (current and business unit average) given the args', async () => {
      const args: IQueryArguments = {
        staffId: '123',
        customerType: ['POTENTIAL', 'CORE'],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
        businessUnit: 'MW',
      }
      const businessUnitAvg = 150
      const current = 100
      const metricsType = ['current', 'businessUnitAvg']

      jest
        .spyOn(orderRepository, 'findAvgBasketSize')
        .mockResolvedValueOnce(current)
      jest
        .spyOn(orderRepository, 'findAvgBasketSizeBusinessUnitAvg')
        .mockResolvedValueOnce(businessUnitAvg)

      const result = await orderService.getAvgBasketSize(args, metricsType)
      expect(result).toEqual({ businessUnitAvg, current })
    })
  })

  describe('Avg Business Unit Per Order Count', () => {
    it('should return the average number of busienss unit per order (current and business unit average) given the args', async () => {
      const args: IQueryArguments = {
        staffId: '123',
        customerType: ['POTENTIAL', 'CORE'],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
        businessUnit: 'MW',
      }
      const businessUnitAvg = 150
      const current = 100
      const metricsTypes = ['current', 'businessUnitAvg']

      jest
        .spyOn(orderRepository, 'findAvgBusinessUnitPerOrderCount')
        .mockResolvedValueOnce(current)
      jest
        .spyOn(
          orderRepository,
          'findAvgBusinessUnitPerOrderCountBusinessUnitAvg',
        )
        .mockResolvedValueOnce(businessUnitAvg)

      const result = await orderService.getAvgBusinessUnitPerOrderCount(
        args,
        metricsTypes,
      )
      expect(result).toEqual({ businessUnitAvg, current })
    })
  })
})
