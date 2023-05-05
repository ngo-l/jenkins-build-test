import * as graphqlFields from 'graphql-fields'
import { IResolverArgumentData } from '../../common/interfaces/query.interfaces'
import { userService } from '../../users/users.service'
import { checkIfStartEndDateTimeValid } from '../../common/validators/datetime.validators'
import { customerService } from '../../customers/customers.service'

export const clientelingPerformanceMetricsDataResolver = async (parent, args: IResolverArgumentData, contextValue, info) => {
    const fields = graphqlFields(info)
    const { data: { staffId, userId, startDate, endDate, customerType } } = args
    await userService.checkUserCountsByStaffId(staffId, parseInt(userId))
    checkIfStartEndDateTimeValid(startDate, endDate)
    const businessUnit = await userService.findUserBusinessUnit(staffId)
    
    const customeReturn = fields.hasOwnProperty('return') ? await customerService.getCustomerReturnCount({
        staffId, 
        startDate, 
        endDate, 
        customerType, 
        businessUnit, 
        metricsTypes: Object.keys(fields.return)
    }) : undefined

    const reach = fields.hasOwnProperty('reach') ? await customerService.getCustomerReachCount({
        staffId, 
        startDate, 
        endDate, 
        customerType, 
        businessUnit, 
        metricsTypes: Object.keys(fields.reach)
    }) : undefined

    const topBrands = fields.hasOwnProperty('topBrands') ? await customerService.getTopBrands({
        staffId, 
        startDate, 
        endDate, 
        customerType, 
        businessUnit, 
        metricsTypes: Object.keys(fields.topBrands)
    }) : undefined

    const avgDaysSinceLastPurchase = fields.hasOwnProperty('avgDaysSinceLastPurchase') ? await customerService.getAvgDaysSinceLastPurchase({
        staffId, 
        startDate, 
        endDate, 
        customerType, 
        businessUnit, 
        metricsTypes: Object.keys(fields.avgDaysSinceLastPurchase)
    }) : undefined

    const avgVisits = fields.hasOwnProperty('avgVisits') ? await customerService.getCustomerAvgVisitCount({
        staffId, 
        startDate, 
        endDate, 
        customerType, 
        businessUnit, 
        metricsTypes: Object.keys(fields.avgVisits)
    }) : undefined

    return {
        reach, 
        avgVisits,
        avgDaysSinceLastPurchase,
        topBrands,
        return: customeReturn
    }
}
