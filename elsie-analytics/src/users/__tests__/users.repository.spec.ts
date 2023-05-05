import { Test, TestingModule } from '@nestjs/testing'
import { DatabaseConnector } from '../../common/database/database.connector'
import { UserRespository } from '../users.repository'
import { UserModule } from '../users.module'
import { DatabaseModule } from '../../common/database/database.module'
import { Logger } from '../../common/logger/logger.service'
import { mockDatabaseConnector } from '../../common/database/__mocks__/database.connector'

describe('User Repository', () => {
  let userRepository: UserRespository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule, DatabaseModule],
      providers: [UserRespository, Logger, DatabaseConnector],
    })
      .overrideProvider(DatabaseConnector)
      .useValue(mockDatabaseConnector)
      .compile()

    userRepository = module.get<UserRespository>(UserRespository)
  })

  describe('findBusinessUnitByStaffId', () => {
    it('should return the business unit given the staffId', async () => {
      const mockResult = 'MW'
      const mockedDatabase = mockDatabaseConnector.getConnection()
      mockedDatabase.where.mockResolvedValueOnce([{ businessUnit: mockResult }])
      const staffId = 'XYZ'
      const output = await userRepository.findBusinessUnitByStaffId(staffId)
      expect(output).toBe(mockResult)
    })
  })

  describe('findUserCountByStaffIdAndUserId', () => {
    it('should throw an error if User Not Foud', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      const staffId = 'XYZ'
      const userId = 9
      const mockResult = 1
      mockedDatabase.andWhere.mockResolvedValueOnce([{ count: mockResult }])
      const output = await userRepository.findUserCountByStaffIdAndUserId({
        staffId,
        userId,
      })
      expect(output).toBe(mockResult)
    })
  })

  describe('findNumberOfSAByBusinessUnit', () => {
    it('should return null', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      const bu = 'MW'
      const mockResult = null
      mockedDatabase.whereIn.mockResolvedValueOnce([{ cou: 1 }])
      const output = await userRepository.findNumberOfSAByBusinessUnit(bu)
      expect(output).toBe(mockResult)
    })

    it('should return the count of SA', async () => {
      const mockedDatabase = mockDatabaseConnector.getConnection()
      const bu = 'MW'
      const mockResult = 999
      mockedDatabase.whereIn.mockResolvedValueOnce([{ count: mockResult }])
      const output = await userRepository.findNumberOfSAByBusinessUnit(bu)
      expect(output).toBe(mockResult)
    })
  })
})
