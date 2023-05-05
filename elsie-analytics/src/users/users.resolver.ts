import { ConfigService } from '@nestjs/config'
import { Query, Resolver, Args, Info } from '@nestjs/graphql'
import { UserService } from '../users/users.service'

@Resolver('BusinessUnit')
export class BusinessUnitSACountResolver {
  constructor(
    private userService: UserService,
    private config: ConfigService,
  ) {}

  @Query()
  async businessUnitSACounts(@Args('data') { staffId, userId }) {
    const staffIDs =
      this.config.get<string>('STAGE') !=='production'
        ? await this.userService.getTestUserStaffIDs()
        : []

    if (staffIDs.includes(staffId)) {
      const saCount = await this.userService.getTestNumberOfSAByBusinessUnit()
      return saCount
    }
    await this.userService.checkUserCountsByStaffId({ staffId, userId })
    const businessUnit = await this.userService.findUserBusinessUnit(staffId)

    if (businessUnit === null || businessUnit === undefined) {
      return null
    }

    const data = await this.userService.getNumberOfSAByBusinessUnit(
      businessUnit,
    )
    return data
  }
}
