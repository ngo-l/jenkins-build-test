import { Test, TestingModule } from '@nestjs/testing'
import { DatabaseConnector } from '../../common/database/database.connector'
import { UserRespository } from '../users.repository'
import { UserModule } from '../users.module'
import { DatabaseModule } from '../../common/database/database.module'
import { Logger } from '../../common/logger/logger.service'
import { mockDatabaseConnector } from '../../common/database/__mocks__/database.connector'
import { UserService } from '../users.service'
import { UnknownError } from '../../common/exceptions/errors'

describe('User Service', () => {
  let userService: UserService
  let userRepository: UserRespository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule, DatabaseModule],
      providers: [UserRespository, Logger],
    })
      .overrideProvider(DatabaseConnector)
      .useValue(mockDatabaseConnector)
      .compile()

    userService = module.get<UserService>(UserService)
    userRepository = module.get<UserRespository>(UserRespository)
  })

  describe('checkUserCountsByStaffId', () => {
    it('should return undefined due to no error raised', async () => {
      const args = {
        staffId: '123',
        userId: 123,
      }

      jest
        .spyOn(userRepository, 'findUserCountByStaffIdAndUserId')
        .mockResolvedValueOnce(1)
      const result = await userService.checkUserCountsByStaffId(args)
      expect(result).toBe(undefined)
    })

    it('should raise user not found error', async () => {
      const args = {
        staffId: '123',
        userId: 123,
      }

      jest
        .spyOn(userRepository, 'findUserCountByStaffIdAndUserId')
        .mockResolvedValueOnce(0)
      expect(userService.checkUserCountsByStaffId(args)).rejects.toThrow(
        UnknownError,
      )
    })
  })

  describe('findUserBusinessUnit', () => {
    it('should return undefined due to no error raised', async () => {
      const staffId = 'XYZ'
      const mockResult = 'MW'
      jest
        .spyOn(userRepository, 'findBusinessUnitByStaffId')
        .mockResolvedValueOnce(mockResult)
      const result = await userService.findUserBusinessUnit(staffId)
      expect(result).toBe(mockResult)
    })
  })

  describe('getNumberOfSAByBusinessUnit', () => {
    it('should return undefined due to no error raised', async () => {
      const businessUnit = 'MW'
      const mockResult = 100
      jest
        .spyOn(userRepository, 'findNumberOfSAByBusinessUnit')
        .mockResolvedValueOnce(mockResult)
      const result = await userService.getNumberOfSAByBusinessUnit(businessUnit)
      expect(result).toBe(mockResult)
    })
  })
})
