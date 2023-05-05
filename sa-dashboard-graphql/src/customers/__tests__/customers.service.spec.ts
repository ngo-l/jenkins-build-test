import { customerService } from '../customers.service'
import { customerRepository } from '../customers.repository'
import { IQueryArguments } from '../../common/interfaces/query.interfaces'

describe('customerReturnCount', () => {

    it('should call each functions related to getCustomerReturnCount once with the given arguments', async () => {
        const args: IQueryArguments = {
            staffId: '123',
            customerType:  ['POTENTIAL', 'CORE'],
            startDate: new Date('2019-10-25T08:10:00.000Z'),
            endDate: new Date('2019-11-25T08:10:00.000Z'),
            businessUnit: 'MW',
            metricsTypes: ['current', 'businessUnitAvg']
        }
        const mockResult =  { businessUnitAvg: 150, current: 100 }

        jest.spyOn(customerRepository, 'findCustomerReturnCount').mockResolvedValueOnce(100)
        jest.spyOn(customerRepository, 'findCustomerReturnCountBusinessUnitAvg').mockResolvedValueOnce(150)
        const result = await customerService.getCustomerReturnCount(args)
        expect(customerRepository.findCustomerReturnCount).toBeCalledTimes(1)
        expect(customerRepository.findCustomerReturnCount).toBeCalledWith(args)
        expect(customerRepository.findCustomerReturnCountBusinessUnitAvg).toBeCalledTimes(1)
        expect(customerRepository.findCustomerReturnCountBusinessUnitAvg).toBeCalledWith(args)
        expect(result).toEqual(mockResult)
    })
})

describe('customerReachCount', () => {

    it('should call each functions related to getCustomerReachCount once with the given arguments', async () => {
        const args: IQueryArguments = {
            staffId: '123',
            customerType:  ['POTENTIAL', 'CORE'],
            startDate: new Date('2019-10-25T08:10:00.000Z'),
            endDate: new Date('2019-11-25T08:10:00.000Z'),
            businessUnit: 'MW',
            metricsTypes: ['current', 'businessUnitAvg']
        }

        const mockResult =  { businessUnitAvg: 150, current: 100 }

        jest.spyOn(customerRepository, 'findCustomerReachCount').mockResolvedValueOnce(100)
        jest.spyOn(customerRepository, 'findCustomerReachCountBusinessUnitAvg').mockResolvedValueOnce(150)
        const result = await customerService.getCustomerReachCount(args)
        expect(customerRepository.findCustomerReachCount).toBeCalledTimes(1)
        expect(customerRepository.findCustomerReachCount).toBeCalledWith(args)
        expect(customerRepository.findCustomerReachCountBusinessUnitAvg).toBeCalledTimes(1)
        expect(customerRepository.findCustomerReachCountBusinessUnitAvg).toBeCalledWith(args)
        expect(result).toEqual(mockResult)
    })
})

describe('customerAvgVisitCount', () => {

    it('should call each functions related to getCustomerAvgVisitCount once with the given arguments', async () => {
        const args: IQueryArguments = {
            staffId: '123',
            customerType:  ['POTENTIAL', 'CORE'],
            startDate: new Date('2019-10-25T08:10:00.000Z'),
            endDate: new Date('2019-11-25T08:10:00.000Z'),
            businessUnit: 'MW',
            metricsTypes: ['current', 'businessUnitAvg'],
        }
        const mockResult =  { businessUnitAvg: 150, current: 100 }

        jest.spyOn(customerRepository, 'findCustomerAvgVisitCount').mockResolvedValueOnce(100)
        jest.spyOn(customerRepository, 'findCustomerAvgVisitCountBusinessUnitAvg').mockResolvedValueOnce(150)
        const result = await customerService.getCustomerAvgVisitCount(args)
        expect(customerRepository.findCustomerAvgVisitCount).toBeCalledTimes(1)
        expect(customerRepository.findCustomerAvgVisitCount).toBeCalledWith(args)
        expect(customerRepository.findCustomerAvgVisitCountBusinessUnitAvg).toBeCalledTimes(1)
        expect(customerRepository.findCustomerAvgVisitCountBusinessUnitAvg).toBeCalledWith(args)
        expect(result).toEqual(mockResult)
    })
})

describe('avgDaysSinceLastPurchase', () => {

    it('should call each functions related to getCustomerAvgVisitCount once with the given arguments', async () => {
        const args: IQueryArguments = {
            staffId: '123',
            customerType:  ['POTENTIAL', 'CORE'],
            startDate: new Date('2019-10-25T08:10:00.000Z'),
            endDate: new Date('2019-11-25T08:10:00.000Z'),
            businessUnit: 'MW',
            metricsTypes: ['current', 'businessUnitAvg']
        }
        const mockResult =  { businessUnitAvg: 150, current: 100 }

        jest.spyOn(customerRepository, 'findAvgDaysSinceLastPurchase').mockResolvedValueOnce(100)
        jest.spyOn(customerRepository, 'findAvgDaysSinceLastPurchaseBusinessUnitAvg').mockResolvedValueOnce(150)
        const result = await customerService.getAvgDaysSinceLastPurchase(args)
        expect(customerRepository.findAvgDaysSinceLastPurchase).toBeCalledTimes(1)
        expect(customerRepository.findAvgDaysSinceLastPurchase).toBeCalledWith(args)
        expect(customerRepository.findAvgDaysSinceLastPurchaseBusinessUnitAvg).toBeCalledTimes(1)
        expect(customerRepository.findAvgDaysSinceLastPurchaseBusinessUnitAvg).toBeCalledWith(args)
        expect(result).toEqual(mockResult)
    })
})

describe('getTopBrands', () => {

    it('should call each functions related to getCustomerAvgVisitCount once with the given arguments', async () => {
        const args: IQueryArguments = {
            staffId: '123',
            customerType:  ['POTENTIAL', 'CORE'],
            startDate: new Date('2019-10-25T08:10:00.000Z'),
            endDate: new Date('2019-11-25T08:10:00.000Z'),
            businessUnit: 'MW',
            metricsTypes: []
        }
        const mockResult =  [{
            brand: 'LCJG',
            count: 99999
        }]

        jest.spyOn(customerRepository, 'findTopBrands').mockResolvedValueOnce(mockResult)
        const result = await customerService.getTopBrands(args)
        expect(customerRepository.findTopBrands).toBeCalledTimes(1)
        expect(customerRepository.findTopBrands).toBeCalledWith(args)
        expect(result).toEqual(mockResult)
    })
})
