import { Knex as IKnex } from 'knex'
import { databaseConnection } from '../../common/database/mysql.connector'
import { userRepository } from '../users.repository'

jest.mock('../../common/database/mysql.connector', () => {
    const querybuilder = {
          select: jest.fn().mockReturnThis(),
          from: jest.fn().mockReturnThis(),
          join: jest.fn().mockReturnThis(),
          where: jest.fn()
        } 
        return {
          databaseConnection: {
            getConnection: jest.fn(() => querybuilder)
        }
      }
})

describe('Business Unit By StaffId', () => {
    
  it('should return the business unit given the staffId', async () => {
      const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
      mockedDatabase.where.mockResolvedValueOnce([{'business_unit': 'MW'}])
      const staffId = 'XYZ'
      const output = await userRepository.findBusinessUnitByStaffId(staffId) 
      expect(JSON.stringify(output)).toBe(JSON.stringify([{'business_unit': 'MW'}]))
    })

    it('should throw an error if cannot connect to the database', async () => {
      const mockedDatabase = await databaseConnection.getConnection() as jest.Mocked<IKnex>
      mockedDatabase.where.mockRejectedValueOnce([])
      const staffId = 'XYZ'
      expect(userRepository.findBusinessUnitByStaffId(staffId)).rejects.toThrow('Failed to connect to database')
    })

})
