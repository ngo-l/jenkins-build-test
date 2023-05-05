import * as graphqlFields from 'graphql-fields'
import { IResolverArgumentData } from '../../common/interfaces/query.interfaces'
import { checkIfStartEndDateTimeValid } from '../../common/validators/datetime.validators'
import { userService } from '../../users/users.service'
import { orderService } from '../../orders/orders.service'

export const salesPerformanceMetricsDataResolver = async (parent, args: IResolverArgumentData, contextValue, info) => {
    const fields = graphqlFields(info)
    const { data: { staffId, userId, startDate, endDate, customerType } } = args
    await userService.checkUserCountsByStaffId(staffId, parseInt(userId))
    checkIfStartEndDateTimeValid(startDate, endDate)
    const businessUnit = await userService.findUserBusinessUnit(staffId)
    const output = {}
    if (fields.hasOwnProperty('orderCount')) {
        output['orderCount'] =  await orderService.getOrderCount({ 
            staffId, 
            startDate, 
            endDate, 
            customerType, 
            businessUnit, 
            metricsTypes: Object.keys(fields['orderCount'])
        })
    }
    if (fields.hasOwnProperty('avgBrandPerOrderCount')) {
        output['avgBrandPerOrderCount'] =  await orderService.getOrderCount({ 
            staffId, 
            startDate, 
            endDate, 
            customerType, 
            businessUnit, 
            metricsTypes: Object.keys(fields['avgBrandPerOrderCount'])
        })
    }
    if (fields.hasOwnProperty('avgBasketSize')) {
        output['avgBasketSize'] =  await orderService.getAvgBasketSize({ 
            staffId, 
            startDate, 
            endDate, 
            customerType, 
            businessUnit, 
            metricsTypes: Object.keys(fields['avgBasketSize'])
        })
    }
    if (fields.hasOwnProperty('avgBusinessUnitPerOrderCount')) {
        output['avgBusinessUnitPerOrderCount'] =  await orderService.getAvgBusinessUnitPerOrderCount({ 
            staffId, 
            startDate, 
            endDate, 
            customerType, 
            businessUnit, 
            metricsTypes: Object.keys(fields['avgBusinessUnitPerOrderCount'])
        })
    }
    return output
}
