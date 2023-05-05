import { createRandomCustomerCount } from '../../common/fixtures/customerCounts'
import { IResolverArgumentData } from '../../common/interfaces/query.interfaces'
import { userService } from '../../users/users.service'
import { checkIfStartEndDateTimeValid } from '../../common/validators/datetime.validators'

export const customerCountsResolver = async (parent, args: IResolverArgumentData, contextValue, info) => {
    const { data: { customerType } } = args
    // TODO: replace fakers with the service layer after the defintions have been confirmed
    // TODO: insert fake data into database for the staging
    const { data: { staffId, userId, startDate, endDate } } = args
    await userService.checkUserCountsByStaffId(staffId, parseInt(userId))
    checkIfStartEndDateTimeValid(startDate, endDate)
    const merticsOutput = createRandomCustomerCount(customerType)
    return merticsOutput
}
