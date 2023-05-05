import { userRepository } from "../users.repository"
import { userService } from "../users.service"

describe('checkUserCountsByStaffId', () => {
    
    it('should throw Failed to connect to database', async () => {
        const staffId = '99092'
        const userId = 1
        jest.spyOn(userRepository, 'findUserCountByStaffIdAndUserId').mockResolvedValueOnce([])
        expect(userService.checkUserCountsByStaffId(staffId, userId)).rejects.toThrow('Failed to connect to database')

        jest.spyOn(userRepository, 'findUserCountByStaffIdAndUserId').mockResolvedValueOnce([{}])
        expect(userService.checkUserCountsByStaffId(staffId, userId)).rejects.toThrow('Failed to connect to database')
    })

    it('should throw User Not Found', async () => {
        const staffId = '99092'
        const userId = 1
        jest.spyOn(userRepository, 'findUserCountByStaffIdAndUserId').mockResolvedValueOnce([{ count: 0 }])
        expect(userService.checkUserCountsByStaffId(staffId, userId)).rejects.toThrow('User Not Found')
    })

})

describe('findUserBusinessUnit', () => {
    
    it('should throw Business Unit Not Found', async () => {
        const staffId = '99092'
        jest.spyOn(userRepository, 'findBusinessUnitByStaffId').mockResolvedValueOnce([])
        expect(userService.findUserBusinessUnit(staffId)).rejects.toThrow('Business Unit Not Found')
    })

    it('should return the business unit', async () => {
        const staffId = '99092'
        const mockResult = 'MW'
        jest.spyOn(userRepository, 'findBusinessUnitByStaffId').mockResolvedValueOnce([{ businessUnit: 'MW'}])
        const result = await userService.findUserBusinessUnit(staffId)
        expect(result).toBe(mockResult)
    })

})
