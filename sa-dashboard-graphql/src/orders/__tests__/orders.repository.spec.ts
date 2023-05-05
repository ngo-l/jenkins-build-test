import { databaseConnection } from '../../common/database/mysql.connector'
import { IQueryArguments } from '../../common/interfaces/query.interfaces'
import { orderRepository } from '../orders.repository'
import { Knex as IKnex } from 'knex'

jest.mock('../../common/database/mysql.connector', () => {
    const querybuilder =  {
        avg: jest.fn().mockReturnThis(),
        as: jest.fn().mockReturnThis(),
        countDistinct: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockReturnThis(),
        count: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        join: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        raw: jest.fn().mockReturnThis()
        }
        return {
          databaseConnection: {
            getConnection: jest.fn(() => querybuilder)
        }
      }
})

describe('find customer order count', () => {
    
    it('should return the order count', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.groupBy.mockResolvedValueOnce([{'trans_type': '01', 'order_count': 5}, {'trans_type': '02', 'order_count': 3}])
        const args: IQueryArguments = { 
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'), 
      } 
        const output = await orderRepository.findOrderCount(args) 
        expect(output).toBe(2)
      })
  
      it('should return null', async () => {
          const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
          mockedDatabase.groupBy.mockResolvedValueOnce([])
          const args: IQueryArguments = { 
            staffId: '00787', 
            customerType: ['ALL'], 
            startDate: new Date('2019-10-25T08:10:00.000Z'),
            endDate: new Date('2019-11-25T08:10:00.000Z'), 
        } 
          const output = await orderRepository.findOrderCount(args) 
          expect(output).toBe(null)
        })
  })

  describe('find order count business unit avg', () => {
    
    it('should return null', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.raw.mockResolvedValueOnce([[]])
        const args: IQueryArguments = { 
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'), 
          businessUnit: 'MW'
      } 
        const output = await orderRepository.findOrderCountBusinessUnitAvg(args) 
        expect(output).toBe(null)
      })
  
      it('should return null', async () => {
          const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
          mockedDatabase.raw.mockResolvedValueOnce([])
          const args: IQueryArguments = { 
            staffId: '00787', 
            customerType: ['ALL'], 
            startDate: new Date('2019-10-25T08:10:00.000Z'),
            endDate: new Date('2019-11-25T08:10:00.000Z'), 
        } 
          const output = await orderRepository.findOrderCountBusinessUnitAvg(args) 
          expect(output).toBe(null)
      })

      it('should return null', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.raw.mockResolvedValueOnce([[{'heelo': 'world'}]])
        const args: IQueryArguments = { 
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'), 
      } 
        const output = await orderRepository.findOrderCountBusinessUnitAvg(args) 
        expect(output).toBe(null)
      })

      it('should return the business unit avg', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.raw.mockResolvedValueOnce([[{'businessUnitAvg': 55}]])
        const args: IQueryArguments = { 
          staffId: '00787', 
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
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.raw.mockResolvedValueOnce([[]])
        const args: IQueryArguments = { 
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'), 
          businessUnit: 'MW'
      } 
        const output = await orderRepository.findAvgBrandPerOrderCount(args) 
        expect(output).toBe(null)
      })
  
      it('should return null', async () => {
          const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
          mockedDatabase.raw.mockResolvedValueOnce([])
          const args: IQueryArguments = { 
            staffId: '00787', 
            customerType: ['ALL'], 
            startDate: new Date('2019-10-25T08:10:00.000Z'),
            endDate: new Date('2019-11-25T08:10:00.000Z'), 
        } 
          const output = await orderRepository.findAvgBrandPerOrderCount(args) 
          expect(output).toBe(null)
      })

      it('should return null', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.raw.mockResolvedValueOnce([[{'heelo': 'world'}]])
        const args: IQueryArguments = { 
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'), 
      } 
        const output = await orderRepository.findAvgBrandPerOrderCount(args) 
        expect(output).toBe(null)
      })

      it('should return the business unit avg', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.raw.mockResolvedValueOnce([[{'current': 55}]])
        const args: IQueryArguments = { 
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'), 
      } 
        const output = await orderRepository.findAvgBrandPerOrderCount(args) 
        expect(output).toBe(55)

      })
  })

  describe('find avg brand per order count business unit avg', () => {
    
    it('should return null', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.raw.mockResolvedValueOnce([[]])
        const args: IQueryArguments = { 
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'), 
          businessUnit: 'MW'
      } 
        const output = await orderRepository.findAvgBrandPerOrderCountBusinessUnitAvg(args) 
        expect(output).toBe(null)
      })
  
      it('should return null', async () => {
          const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
          mockedDatabase.raw.mockResolvedValueOnce([])
          const args: IQueryArguments = { 
            staffId: '00787', 
            customerType: ['ALL'], 
            startDate: new Date('2019-10-25T08:10:00.000Z'),
            endDate: new Date('2019-11-25T08:10:00.000Z'), 
        } 
          const output = await orderRepository.findAvgBrandPerOrderCountBusinessUnitAvg(args) 
          expect(output).toBe(null)
      })

      it('should return null', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.raw.mockResolvedValueOnce([[{'heelo': 'world'}]])
        const args: IQueryArguments = { 
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'), 
      } 
        const output = await orderRepository.findAvgBrandPerOrderCountBusinessUnitAvg(args) 
        expect(output).toBe(null)
      })

      it('should return the business unit avg', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.raw.mockResolvedValueOnce([[{'businessUnitAvg': 55}]])
        const args: IQueryArguments = { 
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'), 
      } 
        const output = await orderRepository.findAvgBrandPerOrderCountBusinessUnitAvg(args) 
        expect(output).toBe(55)

      })
  })

  describe('find avg basket size', () => {
    
    it('should return null', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.raw.mockResolvedValueOnce([[]])
        const args: IQueryArguments = { 
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'), 
          businessUnit: 'MW'
      } 
        const output = await orderRepository.findAvgBasketSize(args) 
        expect(output).toBe(null)
      })
  
      it('should return null', async () => {
          const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
          mockedDatabase.raw.mockResolvedValueOnce([])
          const args: IQueryArguments = { 
            staffId: '00787', 
            customerType: ['ALL'], 
            startDate: new Date('2019-10-25T08:10:00.000Z'),
            endDate: new Date('2019-11-25T08:10:00.000Z'), 
        } 
          const output = await orderRepository.findAvgBasketSize(args) 
          expect(output).toBe(null)
      })

      it('should return null', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.raw.mockResolvedValueOnce([[{'heelo': 'world'}]])
        const args: IQueryArguments = { 
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'), 
      } 
        const output = await orderRepository.findAvgBasketSize(args) 
        expect(output).toBe(null)
      })

      it('should return the business unit avg', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.raw.mockResolvedValueOnce([[{'avgBasketSize': 55}]])
        const args: IQueryArguments = { 
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'), 
      } 
        const output = await orderRepository.findAvgBasketSize(args) 
        expect(output).toBe(55)

      })
  })
  describe('find avg basket size business unit avg', () => {
    
    it('should return null', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.raw.mockResolvedValueOnce([[]])
        const args: IQueryArguments = { 
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'), 
          businessUnit: 'MW'
      } 
        const output = await orderRepository.findAvgBasketSizeBusinessUnitAvg(args) 
        expect(output).toBe(null)
      })
  
      it('should return null', async () => {
          const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
          mockedDatabase.raw.mockResolvedValueOnce([])
          const args: IQueryArguments = { 
            staffId: '00787', 
            customerType: ['ALL'], 
            startDate: new Date('2019-10-25T08:10:00.000Z'),
            endDate: new Date('2019-11-25T08:10:00.000Z'), 
            businessUnit: 'MW'
        } 
          const output = await orderRepository.findAvgBasketSizeBusinessUnitAvg(args) 
          expect(output).toBe(null)
      })

      it('should return null', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.raw.mockResolvedValueOnce([[{'heelo': 'world'}]])
        const args: IQueryArguments = { 
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'), 
          businessUnit: 'MW'
      } 
        const output = await orderRepository.findAvgBasketSizeBusinessUnitAvg(args) 
        expect(output).toBe(null)
      })

      it('should return the business unit avg', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.raw.mockResolvedValueOnce([[{'businessUnitAvg': 55}]])
        const args: IQueryArguments = { 
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'), 
          businessUnit: 'MW'
      } 
        const output = await orderRepository.findAvgBasketSizeBusinessUnitAvg(args) 
        expect(output).toBe(55)

      })
  })

  describe('find avg number of business unit per order', () => {
    
    it('should return null', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.raw.mockResolvedValueOnce([[]])
        const args: IQueryArguments = { 
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'), 
      } 
        const output = await orderRepository.findAvgBusinessUnitPerOrderCount(args) 
        expect(output).toBe(null)
      })
  
      it('should return null', async () => {
          const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
          mockedDatabase.raw.mockResolvedValueOnce([])
          const args: IQueryArguments = { 
            staffId: '00787', 
            customerType: ['ALL'], 
            startDate: new Date('2019-10-25T08:10:00.000Z'),
            endDate: new Date('2019-11-25T08:10:00.000Z'), 
        } 
          const output = await orderRepository.findAvgBusinessUnitPerOrderCount(args) 
          expect(output).toBe(null)
      })

      it('should return null', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.raw.mockResolvedValueOnce([[{'heelo': 'world'}]])
        const args: IQueryArguments = { 
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'), 
      } 
        const output = await orderRepository.findAvgBusinessUnitPerOrderCount(args) 
        expect(output).toBe(null)
      })

      it('should return the business unit avg', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.raw.mockResolvedValueOnce([[{'current': 55}]])
        const args: IQueryArguments = { 
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'), 
      } 
        const output = await orderRepository.findAvgBusinessUnitPerOrderCount(args) 
        expect(output).toBe(55)
      })
  })


  describe('find avg number of business unit per order within the business unit', () => {
    
    it('should return null', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.raw.mockResolvedValueOnce([[]])
        const args: IQueryArguments = { 
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'), 
          businessUnit: 'MW'
      } 
        const output = await orderRepository.findAvgBusinessUnitPerOrderCountBusinessUnitAvg(args) 
        expect(output).toBe(null)
      })
  
      it('should return null', async () => {
          const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
          mockedDatabase.raw.mockResolvedValueOnce([])
          const args: IQueryArguments = { 
            staffId: '00787', 
            customerType: ['ALL'], 
            startDate: new Date('2019-10-25T08:10:00.000Z'),
            endDate: new Date('2019-11-25T08:10:00.000Z'), 
            businessUnit: 'MW'
        } 
          const output = await orderRepository.findAvgBusinessUnitPerOrderCountBusinessUnitAvg(args) 
          expect(output).toBe(null)
      })

      it('should return null', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.raw.mockResolvedValueOnce([[{'heelo': 'world'}]])
        const args: IQueryArguments = { 
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'), 
          businessUnit: 'MW'
      } 
        const output = await orderRepository.findAvgBusinessUnitPerOrderCountBusinessUnitAvg(args) 
        expect(output).toBe(null)
      })

      it('should return the business unit avg', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.raw.mockResolvedValueOnce([[{'businessUnitAvg': 55}]])
        const args: IQueryArguments = { 
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'), 
          businessUnit: 'MW',
      } 
        const output = await orderRepository.findAvgBusinessUnitPerOrderCountBusinessUnitAvg(args) 
        expect(output).toBe(55)

      })
  })
