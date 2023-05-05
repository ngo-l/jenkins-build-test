import { databaseConnection } from '../common/database/mysql.connector'
import { InternalServiceError } from '../common/errors/internalServiceError'
import { ICustomerCountQueryOutput, IQueryArguments } from '../common/interfaces/query.interfaces'
import logger from '../common/logger'
import { toTitleCase } from '../common/utils'


class CustomerRepository {
  constructor() {}

  public async findCustomerReturnCount(args: IQueryArguments) {
    const { staffId, startDate, endDate, customerType } = args
    const conn = await databaseConnection.getConnection()
    try {
      const cusTypes = customerType.map(d => toTitleCase(d))
      const q = conn
        .countDistinct('CUSTOMER_SALES.VIP_NO as customerCount')
        .from('CUSTOMER_SALES')
        .join('STAFF_CUSTOMERS', 'STAFF_CUSTOMERS.CUSTOMER_VIP_NO', 'CUSTOMER_SALES.VIP_NO')
        .join('ELLC_USERS', 'ELLC_USERS.staff_id', 'STAFF_CUSTOMERS.STAFF_ID')
        .join('ELLC_USER_PROFILES', 'ELLC_USER_PROFILES.user_id', 'ELLC_USERS.id')
        .where('CUSTOMER_SALES.ORDER_DATE', '>=', startDate)
        .where('CUSTOMER_SALES.ORDER_DATE', '<=', endDate)
        .where('ELLC_USERS.staff_id', staffId)
      const qWithCustomerTypes = cusTypes.includes('All') ? q : q.whereIn('STAFF_CUSTOMERS.CUSTOMER_TYPE', customerType.map(d => toTitleCase(d))) 
      const data: ICustomerCountQueryOutput[] = await qWithCustomerTypes.groupBy('ELLC_USERS.staff_id') 
      if (data.length === 0) {
        return null
      }
      if (typeof data[0].customerCount === 'string') {
        return null
      } 
      return data[0].customerCount
    } catch (err) {
      const msg = 'Failed to connect to database'
      logger.error(`findCustomerReturnCount: ${msg}, error=${err}`)
      throw new InternalServiceError(msg)
    }
  }

  public async findCustomerReturnCountBusinessUnitAvg(args: IQueryArguments) {
    const { startDate, endDate, customerType, businessUnit } = args
    const conn = await databaseConnection.getConnection()
    try {
      const cusTypes = customerType.map(d => toTitleCase(d))
      const subquery = conn
        .countDistinct('CUSTOMER_SALES.VIP_NO as customerCount')
        .from('CUSTOMER_SALES')
        .join('STAFF_CUSTOMERS', 'STAFF_CUSTOMERS.CUSTOMER_VIP_NO', 'CUSTOMER_SALES.VIP_NO')
        .join('ELLC_USERS', 'ELLC_USERS.staff_id', 'STAFF_CUSTOMERS.STAFF_ID')
        .join('ELLC_USER_PROFILES', 'ELLC_USER_PROFILES.user_id', 'ELLC_USERS.id')
        .where('CUSTOMER_SALES.ORDER_DATE', '>=', startDate)
        .where('CUSTOMER_SALES.ORDER_DATE', '<=', endDate)
        .where('ELLC_USER_PROFILES.business_unit', businessUnit)
      const subqueryWithCustomerTypes = cusTypes.includes('All') ? subquery : subquery.whereIn('STAFF_CUSTOMERS.CUSTOMER_TYPE', customerType.map(d => toTitleCase(d)))
      const sq = subqueryWithCustomerTypes.groupBy('ELLC_USERS.staff_id').as('t')
      const data = await conn.from(sq).avg('customerCount as businessUnitAvg')
      return parseFloat(data[0].businessUnitAvg)
    } catch (err) {
      const msg = 'Failed to connect to database'
      logger.error(`findCustomerReturnCountBusinessUnitAvg: ${msg}, error=${err}`)
      throw new InternalServiceError(msg)
    }
  }

  public async findCustomerReachCount(args: IQueryArguments): Promise<number | null> {
    const { staffId, startDate, endDate, customerType } = args
    const conn = await databaseConnection.getConnection()
    try {
      const cusTypes = customerType.map(d => toTitleCase(d))
      const q = conn
        .countDistinct('STAFF_CUSTOMER_INTERACTIONS.CUSTOMER_VIP_NO as customer_count')
        .from('STAFF_CUSTOMER_INTERACTIONS')
        .join('STAFF_CUSTOMERS', 'STAFF_CUSTOMERS.CUSTOMER_VIP_NO', 'STAFF_CUSTOMER_INTERACTIONS.CUSTOMER_VIP_NO')
        .join('ELLC_USERS', 'ELLC_USERS.staff_id', 'STAFF_CUSTOMER_INTERACTIONS.STAFF_ID')
        .join('ELLC_USER_PROFILES', 'ELLC_USER_PROFILES.user_id', 'ELLC_USERS.id')
        .where('STAFF_CUSTOMER_INTERACTIONS.INTERACTED_AT', '>=', startDate)
        .where('STAFF_CUSTOMER_INTERACTIONS.INTERACTED_AT', '<=', endDate)
        .where('ELLC_USERS.staff_id', staffId)
      const qWithCustomerTypes = cusTypes.includes('All') ? q : q.whereIn('STAFF_CUSTOMERS.CUSTOMER_TYPE', customerType.map(d => toTitleCase(d))) 
      const data: any = await qWithCustomerTypes.groupBy('ELLC_USERS.staff_id') 
      if (data.length === 0) {
        return null
      }
      if (typeof data[0].customer_count === 'string') {
        return null
      } 
      return data[0].customer_count
    } catch (err) {
      const msg = 'Failed to connect to database'
      logger.error(`findCustomerReachCount: ${msg}, error=${err}`)
      throw new InternalServiceError(msg)
    }

  }

  public async findCustomerReachCountBusinessUnitAvg(args: IQueryArguments): Promise<number | null> {
    const { startDate, endDate, customerType, businessUnit } = args
    const conn = await databaseConnection.getConnection()
    try {
      const cusTypes = customerType.map(d => toTitleCase(d))
      const subquery = conn
        .countDistinct('STAFF_CUSTOMER_INTERACTIONS.CUSTOMER_VIP_NO as customer_count')
        .from('STAFF_CUSTOMER_INTERACTIONS')
        .join('STAFF_CUSTOMERS', 'STAFF_CUSTOMERS.CUSTOMER_VIP_NO', 'STAFF_CUSTOMER_INTERACTIONS.CUSTOMER_VIP_NO')
        .join('ELLC_USERS', 'ELLC_USERS.staff_id', 'STAFF_CUSTOMER_INTERACTIONS.STAFF_ID')
        .join('ELLC_USER_PROFILES', 'ELLC_USER_PROFILES.user_id', 'ELLC_USERS.id')
        .where('STAFF_CUSTOMER_INTERACTIONS.INTERACTED_AT', '>=', startDate)
        .where('STAFF_CUSTOMER_INTERACTIONS.INTERACTED_AT', '<=', endDate)
        .where('ELLC_USER_PROFILES.business_unit', businessUnit)
      const subqueryWithCustomerTypes = cusTypes.includes('All') ? subquery : subquery.whereIn('STAFF_CUSTOMERS.CUSTOMER_TYPE', customerType.map(d => toTitleCase(d)))
      const sq = subqueryWithCustomerTypes.groupBy('ELLC_USERS.staff_id').as('t')
      const data = await conn.from(sq).avg('customer_count as businessUnitAvg')
      return parseFloat(data[0].businessUnitAvg)
    } catch (err) {
      const msg = 'Failed to connect to database'
      logger.error(`findCustomerReturnCountBusinessUnitAvg: ${msg}, error=${err}`)
      throw new InternalServiceError(msg)
    }

  }

  public async findCustomerAvgVisitCount(args: IQueryArguments): Promise<number | null> {
    const {startDate, endDate, staffId } = args
    const conn = await databaseConnection.getConnection()
    try {
      // TODO: replace raw with ORM
      const data = await conn.raw(`
          SELECT
            AVG(distinctLocCount) as 'current'
          FROM (
            SELECT
              cs.STAFF_ID as staffID,
              COUNT(DISTINCT cs.LOC_CODE) as distinctLocCount
            FROM CUSTOMER_SALES cs
            JOIN ELLC_USERS eu ON eu.staff_id = cs.STAFF_ID
            JOIN ELLC_USER_PROFILES eup ON eup.user_id = eu.ID
            AND cs.STAFF_ID = ?
            AND cs.ORDER_DATE  >= ?
            AND cs.ORDER_DATE  <= ?
            AND cs.STAFF_ID IN (SELECT sc.STAFF_ID FROM STAFF_CUSTOMERS sc)
            GROUP BY DAY(cs.ORDER_DATE)
          ) AS T`, 
      [staffId, startDate, endDate]
      )
       // TODO: use ramda instead
      if (data.length === 0 || data[0].length === 0 || !data[0][0].hasOwnProperty('current')) {
        return null
      }
      return data[0][0].current
    } catch (err) {
      const msg = 'Failed to connect to database'
      logger.error(`findCustomerAvgVisitCount: ${msg}, error=${err}`)
      throw new InternalServiceError(msg)
    }
  }

  public async findCustomerAvgVisitCountBusinessUnitAvg(args: IQueryArguments): Promise<number | null> {
    const {startDate, endDate, businessUnit } = args
    const conn = await databaseConnection.getConnection()
    try {
       // TODO: replace raw with ORM
      const data = await conn.raw(`
          SELECT
            AVG(distinctLocCountAvg) as businessUnitAvg
          FROM (
            SELECT
              AVG(distinctLocCount) as distinctLocCountAvg
            FROM (
              SELECT
                cs.STAFF_ID as staffID,
                COUNT(DISTINCT cs.LOC_CODE) as distinctLocCount
              FROM CUSTOMER_SALES cs
              JOIN ELLC_USERS eu ON eu.staff_id = cs.STAFF_ID
              JOIN ELLC_USER_PROFILES eup ON eup.user_id = eu.ID
              AND eup.business_unit = ?
              AND cs.ORDER_DATE  >= ?
              AND cs.ORDER_DATE  <= ?
              AND cs.STAFF_ID IN (SELECT sc.STAFF_ID FROM STAFF_CUSTOMERS sc)
              GROUP BY cs.STAFF_ID, DAY(cs.ORDER_DATE)
            ) AS T
            GROUP BY staffID
          ) AS R`, 
          [businessUnit, startDate, endDate]
      )
      // TODO: use ramda instead
      if (data.length === 0 || data[0].length === 0 || !data[0][0].hasOwnProperty('businessUnitAvg')) {
        return null
      }
      return data[0][0]['businessUnitAvg']
    } catch (err) {
      const msg = 'Failed to connect to database'
      logger.error(`findCustomerAvgVisitCountBusinessUnitAvg: ${msg}, error=${err}`)
      throw new InternalServiceError(msg)
    }
  }

  public async findAvgDaysSinceLastPurchase(args: IQueryArguments) {
    const { staffId, startDate, endDate } = args
    const conn = await databaseConnection.getConnection()
    try {
      const data = await conn.raw(`
          SELECT 
            AVG(diff) as days
          FROM (
              SELECT
                cs.VIP_NO as vip_no,
                DATEDIFF(CURDATE(), MAX(cs.ORDER_DATE)) as diff
              FROM CUSTOMER_SALES cs
              JOIN STAFF_CUSTOMERS sc ON cs.VIP_NO = sc.CUSTOMER_VIP_NO
              JOIN ELLC_USERS eu ON eu.staff_id = cs.STAFF_ID
              AND eu.staff_id = ?
              AND cs.ORDER_DATE  >= ?
              AND cs.ORDER_DATE  <= ?
              GROUP BY eu.staff_id, cs.VIP_NO
          ) as R`,
        [staffId, startDate, endDate]
      )
      if (data.length === 0 || data[0].length === 0 || !data[0][0].hasOwnProperty('days')) {
        return null
      }
      return data[0][0]['days']
    } catch (err) {
      const msg = 'Failed to connect to database'
      logger.error(`findAvgDaysSinceLastPurchase: ${msg}, error=${err}`)
      throw new InternalServiceError(msg)
    }
  }

  public async findAvgDaysSinceLastPurchaseBusinessUnitAvg(args: IQueryArguments): Promise<number | null> {
    const { startDate, endDate, businessUnit } = args
    const conn = await databaseConnection.getConnection()
    try {
      const data = await conn.raw(`
          SELECT
            AVG(days) as businessUnitAvg
          FROM (
            SELECT
              staff_id,
              AVG(diff) as days
            FROM (
                SELECT
                  eu.staff_id as staff_id,
                  cs.VIP_NO as vip_no,
                  DATEDIFF(CURDATE(), MAX(cs.ORDER_DATE)) as diff
                FROM CUSTOMER_SALES cs
                JOIN STAFF_CUSTOMERS sc ON cs.VIP_NO = sc.CUSTOMER_VIP_NO
                JOIN ELLC_USERS eu ON eu.staff_id = cs.STAFF_ID
                JOIN ELLC_USER_PROFILES eup ON eup.user_id = eu.ID
                AND eup.business_unit = ?
                AND cs.ORDER_DATE  >= ?
                AND cs.ORDER_DATE  <= ?
                GROUP BY eu.staff_id, cs.VIP_NO
            ) as R
          GROUP BY staff_id
          ) as T`,
        [businessUnit, startDate, endDate]
      )
      if (data.length === 0 || data[0].length === 0 || !data[0][0].hasOwnProperty('businessUnitAvg')) {
        return null
      }
      return data[0][0]['businessUnitAvg']
    } catch (err) {
      const msg = 'Failed to connect to database'
      logger.error(`findAvgDaysSinceLastPurchaseBusinessUnitAvg: ${msg}, error=${err}`)
      throw new InternalServiceError(msg)
    }
  }

  public async findTopBrands(args: IQueryArguments, num: number = 3) {
    const { staffId, startDate, endDate, customerType } = args
    const conn = await databaseConnection.getConnection()
    try {
      const cusTypes = customerType.map(d => toTitleCase(d))
      const q = conn
        .select('PRODUCT_BIBLE.BRAND as brand')
        .count('PRODUCT_BIBLE.BRAND as count')
        .from('CUSTOMER_SALES')
        .join('PB_INFO', 'PB_INFO.NEO_SKU_ID', 'CUSTOMER_SALES.NEO_SKU_ID')
        .join('PRODUCT_BIBLE', 'PRODUCT_BIBLE.LC_STYLE_CODE', 'PB_INFO.LC_STYLE_CODE')
        .join('STAFF_CUSTOMERS', 'STAFF_CUSTOMERS.STAFF_ID', 'CUSTOMER_SALES.STAFF_ID')
        .where('CUSTOMER_SALES.TRANS_TYPE', '01')
        .where('CUSTOMER_SALES.ORDER_DATE', '>=', String(startDate))
        .where('CUSTOMER_SALES.ORDER_DATE', '<=', String(endDate))
        .where('CUSTOMER_SALES.STAFF_ID', staffId)
    const qWithCustomerTypes = cusTypes.includes('All') ? q : q.whereIn('STAFF_CUSTOMERS.CUSTOMER_TYPE', cusTypes) 
    const data = await qWithCustomerTypes.groupBy('PRODUCT_BIBLE.BRAND').orderBy('count', 'desc').limit(num)
    if (data.length === 0) {
      return null
    }
    return data

    } catch (err) {
      const msg = 'Failed to connect to database'
      logger.error(`findTopBrands: ${msg}, error=${err}`)
      throw new InternalServiceError(msg)
    }
  }
 
}



export const customerRepository = new CustomerRepository()
