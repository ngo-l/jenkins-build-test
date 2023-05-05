import { IQueryArguments } from '../../common/interfaces/query.interfaces'
import { orderRepository } from '../orders.repository'
import { orderService } from '../orders.service'

describe('Sales', () => {
    
  it('should return the sales amount (current and business unit average) given the args', async () => {
    const args: IQueryArguments = {
        staffId: '123',
        customerType:  ['POTENTIAL', 'CORE'],
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z')
    }
    const businessUnitAvg = 150
    const current = 100
    
    jest.spyOn(orderRepository, 'getSalesAmount').mockResolvedValueOnce(current)
    jest.spyOn(orderRepository, 'getSalesAmountBusinessUnitAvg').mockResolvedValueOnce(businessUnitAvg)
    
    const result = await orderService.getSalesAmount(args)
    expect(orderRepository.getSalesAmount).toBeCalledWith(args)
    expect(orderRepository.getSalesAmountBusinessUnitAvg).toBeCalledWith(args)
    expect(result).toEqual({ businessUnitAvg, current })
    })
})

describe('Order Count', () => {
    
    it('should return the order count (current and business unit average) given the args', async () => {
      const args: IQueryArguments = {
          staffId: '123',
          customerType:  ['ALL'],
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'),
          metricsTypes: ['current', 'businessUnitAvg'],
          businessUnit: 'MW'

      }
      const businessUnitAvg = 150
      const current = 100
      jest.spyOn(orderRepository, 'findOrderCount').mockResolvedValueOnce(current)
      jest.spyOn(orderRepository, 'findOrderCountBusinessUnitAvg').mockResolvedValueOnce(businessUnitAvg)
  
      const result = await orderService.getOrderCount(args)
      expect(orderRepository.findOrderCount).toBeCalledWith(args)
      expect(orderRepository.findOrderCountBusinessUnitAvg).toBeCalledWith(args)
      expect(result).toEqual({ businessUnitAvg, current })
      })
  })


describe('Avg Brand Per Order Count', () => {
    
    it('should return the average brand per order count (current and business unit average) given the args', async () => {
      const args: IQueryArguments = {
          staffId: '123',
          customerType:  ['POTENTIAL', 'CORE'],
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'),
          metricsTypes: ['current', 'businessUnitAvg'],
          businessUnit: 'MW'
      }
      const businessUnitAvg = 150
      const current = 100
      
      jest.spyOn(orderRepository, 'findAvgBrandPerOrderCount').mockResolvedValueOnce(current)
      jest.spyOn(orderRepository, 'findAvgBrandPerOrderCountBusinessUnitAvg').mockResolvedValueOnce(businessUnitAvg)
      
      const result = await orderService.getAvgBrandPerOrderCount(args)
      expect(orderRepository.findAvgBrandPerOrderCount).toBeCalledWith(args)
      expect(orderRepository.findAvgBrandPerOrderCountBusinessUnitAvg).toBeCalledWith(args)
      expect(result).toEqual({ businessUnitAvg, current })
      })
  })

  describe('Avg Basket Size', () => {
    
    it('should return the average basket size (current and business unit average) given the args', async () => {
      const args: IQueryArguments = {
          staffId: '123',
          customerType:  ['POTENTIAL', 'CORE'],
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'),
          metricsTypes: ['current', 'businessUnitAvg'],
          businessUnit: 'MW'
      }
      const businessUnitAvg = 150
      const current = 100
      
      jest.spyOn(orderRepository, 'findAvgBasketSize').mockResolvedValueOnce(current)
      jest.spyOn(orderRepository, 'findAvgBasketSizeBusinessUnitAvg').mockResolvedValueOnce(businessUnitAvg)
      
      const result = await orderService.getAvgBasketSize(args)
      expect(orderRepository.findAvgBasketSize).toBeCalledWith(args)
      expect(orderRepository.findAvgBasketSizeBusinessUnitAvg).toBeCalledWith(args)
      expect(result).toEqual({ businessUnitAvg, current })
      })
  })

  describe('Avg Basket Amount', () => {
    
    it('should return the average basket amount (current and business unit average) given the args', async () => {
      const args: IQueryArguments = {
          staffId: '123',
          customerType:  ['POTENTIAL', 'CORE'],
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z')
      }
      const businessUnitAvg = 150
      const current = 100
      
      jest.spyOn(orderRepository, 'getAvgBasketValue').mockResolvedValueOnce(current)
      jest.spyOn(orderRepository, 'getAvgBasketValueBusinessUnitAvg').mockResolvedValueOnce(businessUnitAvg)
      
      const result = await orderService.getAvgBasketValue(args)
      expect(orderRepository.getAvgBasketValue).toBeCalledWith(args)
      expect(orderRepository.getAvgBasketValueBusinessUnitAvg).toBeCalledWith(args)
      expect(result).toEqual({ businessUnitAvg, current })
      })
  })

  describe('Avg Business Unit Per Order Count', () => {
    
    it('should return the average number of busienss unit per order (current and business unit average) given the args', async () => {
      const args: IQueryArguments = {
          staffId: '123',
          customerType:  ['POTENTIAL', 'CORE'],
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'),
          metricsTypes: ['current', 'businessUnitAvg'],
          businessUnit: 'MW'
      }
      const businessUnitAvg = 150
      const current = 100
      
      jest.spyOn(orderRepository, 'findAvgBusinessUnitPerOrderCount').mockResolvedValueOnce(current)
      jest.spyOn(orderRepository, 'findAvgBusinessUnitPerOrderCountBusinessUnitAvg').mockResolvedValueOnce(businessUnitAvg)
      
      const result = await orderService.getAvgBusinessUnitPerOrderCount(args)
      expect(orderRepository.findAvgBusinessUnitPerOrderCount).toBeCalledWith(args)
      expect(orderRepository.findAvgBusinessUnitPerOrderCountBusinessUnitAvg).toBeCalledWith(args)
      expect(result).toEqual({ businessUnitAvg, current })
      })
  })
