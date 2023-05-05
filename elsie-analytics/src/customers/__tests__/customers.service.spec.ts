import { CustomerService } from '../customers.service'
import { CustomerRepository } from '../customers.repository'
import { IQueryArguments } from '../../common/interfaces/query.interfaces'
import { CustomerTypeEnum } from '../customers.enum'
import { Test, TestingModule } from '@nestjs/testing'
import { CustomerModule } from '../customers.module'
import { Logger } from '../../common/logger/logger.service'
import { DatabaseConnector } from '../../common/database/database.connector'
import { metricsType } from '../../common/types/query.types'
import { DatabaseModule } from '../../common/database/database.module'
import { mockDatabaseConnector } from '../../common/database/__mocks__/database.connector'
import {
  IClienteleCustomerCountByBusinessUnitInput,
  IClienteleCustomerCountInput,
} from '../interfaces/customers.interfaces'

describe('Customer Service', () => {
  let customerService: CustomerService
  let customerRepository: CustomerRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CustomerModule, DatabaseModule],
      providers: [CustomerRepository, Logger],
    })
      .overrideProvider(DatabaseConnector)
      .useValue(mockDatabaseConnector)
      .compile()

    customerService = module.get<CustomerService>(CustomerService)
    customerRepository = module.get<CustomerRepository>(CustomerRepository)
  })

  describe('customerReturnCount', () => {
    it('should call each functions related to getCustomerReturnCount once with the given arguments', async () => {
      const args: IQueryArguments = {
        staffId: '123',
        customerType: [CustomerTypeEnum.POTENTIAL, CustomerTypeEnum.CORE],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
        businessUnit: 'MW',
      }
      const metricsTypes: metricsType[] = [
        'current',
        'businessUnitAvg',
        'businessUnitTotal',
      ]
      const mockResult = {
        businessUnitAvg: 150,
        current: 100,
        businessUnitTotal: 200,
      }

      jest
        .spyOn(customerRepository, 'findCustomerReturnCount')
        .mockResolvedValueOnce(100)
      jest
        .spyOn(customerRepository, 'findCustomerReturnCountBusinessUnitAvg')
        .mockResolvedValueOnce(150)
      jest
        .spyOn(customerRepository, 'findBusinessUnitCustomerReturnCount')
        .mockResolvedValueOnce(200)
      const result = await customerService.getCustomerReturnCount(
        args,
        metricsTypes,
      )
      expect(result).toEqual(mockResult)
    })
  })

  describe('customerReachCount', () => {
    it('should call each functions related to getCustomerReachCount once with the given arguments', async () => {
      const args: IQueryArguments = {
        staffId: '123',
        customerType: [CustomerTypeEnum.POTENTIAL, CustomerTypeEnum.CORE],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
        businessUnit: 'MW',
      }
      const metricsTypes: metricsType[] = [
        'current',
        'businessUnitAvg',
        'businessUnitTotal',
      ]

      const mockResult = {
        businessUnitAvg: 150,
        current: 100,
        businessUnitTotal: 200,
      }

      jest
        .spyOn(customerRepository, 'findCustomerReachCount')
        .mockResolvedValueOnce(100)
      jest
        .spyOn(customerRepository, 'findCustomerReachCountBusinessUnitAvg')
        .mockResolvedValueOnce(150)
      jest
        .spyOn(customerRepository, 'findBusinessUnitCustomerReachCount')
        .mockResolvedValueOnce(200)
      const result = await customerService.getCustomerReachCount(
        args,
        metricsTypes,
      )
      expect(result).toEqual(mockResult)
    })
  })

  describe('customerAvgVisitCount', () => {
    it('should call each functions related to getCustomerAvgVisitCount once with the given arguments', async () => {
      const args: IQueryArguments = {
        staffId: '123',
        customerType: [CustomerTypeEnum.POTENTIAL, CustomerTypeEnum.CORE],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
        businessUnit: 'MW',
      }
      const metricsTypes = ['current', 'businessUnitAvg']

      const mockResult = { businessUnitAvg: 150, current: 100 }

      jest
        .spyOn(customerRepository, 'findCustomerAvgVisitCount')
        .mockResolvedValueOnce(100)
      jest
        .spyOn(customerRepository, 'findCustomerAvgVisitCountBusinessUnitAvg')
        .mockResolvedValueOnce(150)
      const result = await customerService.getCustomerAvgVisitCount(
        args,
        metricsTypes,
      )
      expect(customerRepository.findCustomerAvgVisitCount).toBeCalledTimes(1)
      expect(customerRepository.findCustomerAvgVisitCount).toBeCalledWith(args)
      expect(
        customerRepository.findCustomerAvgVisitCountBusinessUnitAvg,
      ).toBeCalledTimes(1)
      expect(
        customerRepository.findCustomerAvgVisitCountBusinessUnitAvg,
      ).toBeCalledWith(args)
      expect(result).toEqual(mockResult)
    })
  })

  describe('avgDaysSinceLastPurchase', () => {
    it('should call each functions related to getAvgDaysSinceLastPurchase once with the given arguments', async () => {
      const args: IQueryArguments = {
        staffId: '123',
        customerType: [CustomerTypeEnum.POTENTIAL, CustomerTypeEnum.CORE],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
        businessUnit: 'MW',
      }
      const metricsTypes = ['current', 'businessUnitAvg']

      const mockResult = { businessUnitAvg: 150, current: 100 }

      jest
        .spyOn(customerRepository, 'findAvgDaysSinceLastPurchase')
        .mockResolvedValueOnce(100)
      jest
        .spyOn(
          customerRepository,
          'findAvgDaysSinceLastPurchaseBusinessUnitAvg',
        )
        .mockResolvedValueOnce(150)
      const result = await customerService.getAvgDaysSinceLastPurchase(
        args,
        metricsTypes,
      )
      expect(customerRepository.findAvgDaysSinceLastPurchase).toBeCalledTimes(1)
      expect(customerRepository.findAvgDaysSinceLastPurchase).toBeCalledWith(
        args,
      )
      expect(
        customerRepository.findAvgDaysSinceLastPurchaseBusinessUnitAvg,
      ).toBeCalledTimes(1)
      expect(
        customerRepository.findAvgDaysSinceLastPurchaseBusinessUnitAvg,
      ).toBeCalledWith(args)
      expect(result).toEqual(mockResult)
    })
  })

  describe('getTopBrands', () => {
    it('should call each functions related to getCustomerAvgVisitCount once with the given arguments', async () => {
      const args: IQueryArguments = {
        staffId: '123',
        customerType: ['POTENTIAL', 'CORE'],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'),
        businessUnit: 'MW',
      }
      const mockResult = [
        {
          brand: 'LCJG',
          count: 99999,
        },
      ]

      jest
        .spyOn(customerRepository, 'findTopBrands')
        .mockResolvedValueOnce(mockResult)
      const result = await customerService.getTopBrands(args)
      expect(customerRepository.findTopBrands).toBeCalledTimes(1)
      expect(customerRepository.findTopBrands).toBeCalledWith(args)
      expect(result).toEqual(mockResult)
    })
  })

  describe('getClienteleCustomerCount', () => {
    it('should return an array of objects with the key of count and type', async () => {
      const args: IClienteleCustomerCountInput = {
        staffId: '123',
        customerTypes: [CustomerTypeEnum.ALL],
      }
      const mockResult = [
        {
          count: 9999,
          type: 'ALL',
        },
      ]

      jest
        .spyOn(customerRepository, 'findAllClienteleCustomerCount')
        .mockResolvedValueOnce(mockResult)
      const result = await customerService.getClienteleCustomerCount(args)
      expect(result).toEqual(mockResult)

      const args1: IClienteleCustomerCountInput = {
        staffId: '123',
        customerTypes: [CustomerTypeEnum.CORE],
      }
      const mockResult1 = [
        {
          count: 9999,
          type: 'Core',
        },
      ]

      jest
        .spyOn(customerRepository, 'findClienteleCustomerCountByCustomerTypes')
        .mockResolvedValueOnce(mockResult1)
      const result1 = await customerService.getClienteleCustomerCount(args1)
      expect(result1).toEqual(mockResult1)
    })
  })

  describe('getClienteleCustomerCountByBusinessUnit', () => {
    it('should return an array of objects with the key of count and type', async () => {
      const args: IClienteleCustomerCountByBusinessUnitInput = {
        businessUnit: 'MW',
        customerTypes: [CustomerTypeEnum.ALL],
      }
      const mockResult = [
        {
          count: 9999,
          type: 'ALL',
        },
      ]

      jest
        .spyOn(
          customerRepository,
          'findAllClienteleCustomerCountByBusinessUnit',
        )
        .mockResolvedValueOnce(mockResult)
      const result =
        await customerService.getClienteleCustomerCountByBusinessUnit(args)
      expect(result).toEqual(mockResult)

      const args1: IClienteleCustomerCountByBusinessUnitInput = {
        businessUnit: 'MW',
        customerTypes: [CustomerTypeEnum.CORE],
      }
      const mockResult1 = [
        {
          count: 9999,
          type: 'Core',
        },
      ]

      jest
        .spyOn(
          customerRepository,
          'findClienteleCustomerCountByBusinessUnitAndCustomerTypes',
        )
        .mockResolvedValueOnce(mockResult1)
      const result1 =
        await customerService.getClienteleCustomerCountByBusinessUnit(args1)
      expect(result1).toEqual(mockResult1)
    })
  })
})
