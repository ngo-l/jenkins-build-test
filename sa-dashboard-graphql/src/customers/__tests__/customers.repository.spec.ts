import { databaseConnection } from '../../common/database/mysql.connector'
import { IQueryArguments } from '../../common/interfaces/query.interfaces'
import { customerRepository } from '../customers.repository'
import { Knex as IKnex } from 'knex'

jest.mock('../../common/database/mysql.connector', () => {
  // TODO: move to the __mocks__
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

describe('find customer return count', () => {
    
  it('should return customer return count', async () => {
      const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
      mockedDatabase.groupBy.mockResolvedValueOnce([{ 'customerCount': 5 }])
      const args: IQueryArguments = { 
        staffId: '00787', 
        customerType: ['ALL'], 
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z'), 
    } 
      const output = await customerRepository.findCustomerReturnCount(args) 
      expect(output).toBe(5)
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
        const output = await customerRepository.findCustomerReturnCount(args) 
        expect(output).toBe(null)
      })

      it('should return null', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.groupBy.mockResolvedValueOnce([{ 'customerCount': 'hello' }])
        const args: IQueryArguments = { 
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'), 
      } 
        const output = await customerRepository.findCustomerReturnCount(args) 
        expect(output).toBe(null)
      })
})

describe('find customer return count business avg', () => {
    
    it('should return customer return count business avg', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.avg.mockResolvedValueOnce([{ 'businessUnitAvg': 5 }])
        const args: IQueryArguments = {
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'), 
          businessUnit: 'MW' 
      } 
        const output = await customerRepository.findCustomerReturnCountBusinessUnitAvg(args) 
        expect(output).toBe(5)
      })
  })

  describe('find customer reach count', () => {
    
    it('should return customer reach count', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.groupBy.mockResolvedValueOnce([{ 'customer_count': 5 }])
        const args: IQueryArguments = { 
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'), 
      } 
        const output = await customerRepository.findCustomerReachCount(args) 
        expect(output).toBe(5)
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
          const output = await customerRepository.findCustomerReachCount(args) 
          expect(output).toBe(null)
        })
  
        it('should return null', async () => {
          const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
          mockedDatabase.groupBy.mockResolvedValueOnce([{ 'customer_count': 'hello' }])
          const args: IQueryArguments = { 
            staffId: '00787', 
            customerType: ['ALL'], 
            startDate: new Date('2019-10-25T08:10:00.000Z'),
            endDate: new Date('2019-11-25T08:10:00.000Z'), 
        } 
          const output = await customerRepository.findCustomerReachCount(args) 
          expect(output).toBe(null)
        })
  })

  describe('find customer return count business avg', () => {
    
    it('should return customer return count business avg', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.avg.mockResolvedValueOnce([{ 'businessUnitAvg': 5 }])
        const args: IQueryArguments = {
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z'), 
          businessUnit: 'MW' 
      } 
        const output = await customerRepository.findCustomerReachCountBusinessUnitAvg(args) 
        expect(output).toBe(5)
      })
  })

  describe('find top brands', () => {
    
    it('should return null', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.limit.mockResolvedValueOnce([])
        const args: IQueryArguments = {
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z')
      } 
        const output = await customerRepository.findTopBrands(args) 
        expect(output).toBe(null)
    })

    it('should return an array of objects that each contain the brand name and its count', async () => {
      const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
      const mockResult = [{ brand: 'LCJG', count: 99999 }]
      mockedDatabase.limit.mockResolvedValueOnce(mockResult)
      const args: IQueryArguments = {
        staffId: '00787', 
        customerType: ['ALL'], 
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z')
    } 
      const output = await customerRepository.findTopBrands(args) 
      expect(output).toBe(mockResult)
    })
  })

  describe('find avg days since last purchase', () => {
    
    it('should return null', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        mockedDatabase.raw.mockResolvedValueOnce([])
        const args: IQueryArguments = {
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z')
      } 
        const output = await customerRepository.findAvgDaysSinceLastPurchase(args) 
        expect(output).toBe(null)

        mockedDatabase.raw.mockResolvedValueOnce([[]])
        const output2 = await customerRepository.findAvgDaysSinceLastPurchase(args) 
        expect(output2).toBe(null)

        mockedDatabase.raw.mockResolvedValueOnce([[{'day': 1}]])
        const output3 = await customerRepository.findAvgDaysSinceLastPurchase(args) 
        expect(output3).toBe(null)
    })

    it('should return a number', async () => {
      const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
      const mockResult = 99999
      mockedDatabase.raw.mockResolvedValueOnce([[{days: 99999}]])
      const args: IQueryArguments = {
        staffId: '00787', 
        customerType: ['ALL'], 
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z')
    } 
      const output = await customerRepository.findAvgDaysSinceLastPurchase(args) 
      expect(output).toBe(mockResult)
    })
  })

  describe('find avg visits', () => {
    
    it('should return null if no result found from repository', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        const args: IQueryArguments = {
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z')
      } 

        mockedDatabase.raw.mockResolvedValueOnce([])
        const output = await customerRepository.findCustomerAvgVisitCount(args) 
        expect(output).toBe(null)

        mockedDatabase.raw.mockResolvedValueOnce([[]])
        const output2 = await customerRepository.findCustomerAvgVisitCount(args) 
        expect(output2).toBe(null)

        mockedDatabase.raw.mockResolvedValueOnce([[{ 'hello': 1 }]])
        const output3 = await customerRepository.findCustomerAvgVisitCount(args) 
        expect(output3).toBe(null)
    })

    it('should return a number', async () => {
      const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
      const mockResult = 99999
      mockedDatabase.raw.mockResolvedValueOnce([[{ current: 99999 }]])
      const args: IQueryArguments = {
        staffId: '00787', 
        customerType: ['ALL'], 
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z')
    } 
      const output = await customerRepository.findCustomerAvgVisitCount(args) 
      expect(output).toBe(mockResult)
    })
  })

  describe('find avg visits business unit avg', () => {
    
    it('should return null if no result found from repository', async () => {
        const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
        const args: IQueryArguments = {
          staffId: '00787', 
          customerType: ['ALL'], 
          startDate: new Date('2019-10-25T08:10:00.000Z'),
          endDate: new Date('2019-11-25T08:10:00.000Z')
      } 
        mockedDatabase.raw.mockResolvedValueOnce([])
        const output = await customerRepository.findCustomerAvgVisitCountBusinessUnitAvg(args) 
        expect(output).toBe(null)

        mockedDatabase.raw.mockResolvedValueOnce([[]])
        const output2 = await customerRepository.findCustomerAvgVisitCountBusinessUnitAvg(args) 
        expect(output2).toBe(null)

        mockedDatabase.raw.mockResolvedValueOnce([[{ 'hello': 1 }]])
        const output3 = await customerRepository.findCustomerAvgVisitCountBusinessUnitAvg(args) 
        expect(output3).toBe(null)
    })

    it('should return a number', async () => {
      const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
      const mockResult = 99999

      const args: IQueryArguments = {
        staffId: '00787', 
        customerType: ['ALL'], 
        startDate: new Date('2019-10-25T08:10:00.000Z'),
        endDate: new Date('2019-11-25T08:10:00.000Z')
    } 
      mockedDatabase.raw.mockResolvedValueOnce([[{ businessUnitAvg: 99999 }]])
      const output = await customerRepository.findCustomerAvgVisitCountBusinessUnitAvg(args) 
      expect(output).toBe(mockResult)
    })
  })

  
