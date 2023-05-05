import { UserRespository } from './users.repository'
import { Injectable } from '@nestjs/common'
import { IUserCountByStaffIdAndUserIdInput } from './users.interfaces'
import { UnknownError } from '../common/exceptions/errors'

@Injectable()
export class UserService {
  constructor(private userRepository: UserRespository) {}

  public async checkUserCountsByStaffId({
    staffId,
    userId,
  }: IUserCountByStaffIdAndUserIdInput): Promise<void> {
    const data = await this.userRepository.findUserCountByStaffIdAndUserId({
      staffId,
      userId,
    })
    if (data !== 1) {
      throw new UnknownError('User Not Found')
    }
  }

  public async findUserBusinessUnit(staffId: string): Promise<string | null> {
    const data = await this.userRepository.findBusinessUnitByStaffId(staffId)
    return data
  }
  public async getNumberOfSAByBusinessUnit(
    businessUnit: string,
  ): Promise<number | null> {
    const data = await this.userRepository.findNumberOfSAByBusinessUnit(
      businessUnit,
    )
    return data
  }

  public async getTestUserStaffIDs() {
    const data = await this.userRepository.findTestUserStaffIDs()
    return data.map(staff => staff.staffID)
  }

  public async getTestNumberOfSAByBusinessUnit() {
    const { count } = await this.userRepository.findTestNumberOfSAByBusinessUnit()
    return count
  }
}
