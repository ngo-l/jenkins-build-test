import { InternalServiceError } from "../common/errors/internalServiceError"
import { UnknownError } from "../common/errors/unknownError"
import logger from "../common/logger"
import { userRepository } from "./users.repository"

class UserService {
    
    constructor() {}

    public async checkUserCountsByStaffId(staffId: string, userId: number): Promise<void> {
        const data = await userRepository.findUserCountByStaffIdAndUserId(staffId, userId)
        if (data?.length !== 1 || !('count' in data[0])) {
            logger.error(`checkUserCountsByStaffId: data=${data}`)
            const msg = 'Failed to connect to database'
            throw new InternalServiceError(msg)
        }
        if (data[0].count < 1 ) {
            const msg = 'User Not Found'
            logger.error(`checkUserCountsByStaffId: count=${data[0].count}, staffId=${staffId}, msg=${msg}`)
            throw new UnknownError('User Not Found')
        }
    }

    public async findUserBusinessUnit(staffId: string): Promise<string> {
        const data = await userRepository.findBusinessUnitByStaffId(staffId)
        if (data?.length !== 1) {
            return null
        }
        return data[0].businessUnit
    }
}

export const userService = new UserService()
