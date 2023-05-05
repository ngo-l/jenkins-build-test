import { databaseConnection } from "../common/database/mysql.connector"
import { InternalServiceError } from "../common/errors/internalServiceError"
import { UnknownError } from "../common/errors/unknownError"
import { IQueryArguments } from "../common/interfaces/query.interfaces"
import logger from "../common/logger"


class OrderRepository {
  constructor() {}
  public async getSalesAmount(args: IQueryArguments): Promise<number | null> {
    try {
      // TODO: replace the error with Knex SQL query 
      logger.debug(`getSalesAmount: args=${args}`)
      throw new UnknownError('Not Implemented')
    } catch (err) {
      const msg = 'Failed to connect to database'
      logger.debug(`getSalesAmount: ${msg}, error=${err}`)
      throw new InternalServiceError(msg)
    }
  }

  public async getSalesAmountBusinessUnitAvg(args: IQueryArguments): Promise<number | null> {
    try {
      // TODO: replace the error with Knex SQL query 
      logger.debug(`getSalesAmountBusinessUnitAvg: args=${args}`)
      throw new UnknownError('Not Implemented')
    } catch (err) {
      const msg = 'Failed to connect to database'
      logger.debug(`getSalesAmountBusinessUnitAvg: ${msg}, error=${err}`)
      throw new InternalServiceError(msg)
    }
  }

  public async findOrderCount(args: IQueryArguments) {
    const { staffId, startDate, endDate } = args
    const conn = await databaseConnection.getConnection()
    try {

      const data = await conn
          .select('CUSTOMER_SALES.TRANS_TYPE as trans_type')
          .countDistinct('CUSTOMER_SALES.ORDER_NO as order_count')
          .from('CUSTOMER_SALES')
          .join('ELLC_USERS', 'ELLC_USERS.staff_id', 'CUSTOMER_SALES.STAFF_ID')
          .where('ELLC_USERS.staff_id', staffId)
          .where('CUSTOMER_SALES.ORDER_DATE', '>=', startDate)
          .where('CUSTOMER_SALES.ORDER_DATE', '<=', endDate)
          .groupBy('CUSTOMER_SALES.TRANS_TYPE')
      if (data.length === 0) {
        return null
      }
      const transType01 = parseInt(data.filter(x => x['trans_type'] === '01')[0].order_count)
      const transType02 = parseInt(data.filter(x => x['trans_type'] === '02')[0].order_count)
      return transType01 - transType02

    } catch (err) {
      const msg = 'Failed to connect to database'
      logger.error(`findOrderCount: ${msg}, error=${err}`)
      throw new InternalServiceError(msg)
    }
  }

  public async findOrderCountBusinessUnitAvg(args: IQueryArguments) {
    const { startDate, endDate, businessUnit } = args
    const conn = await databaseConnection.getConnection()
    try {

      const data = await conn.raw(`
          SELECT
            AVG(countByStaffId) as businessUnitAvg
          FROM (
            SELECT
              staff_id,
              SUM(order_count) as countByStaffId
            FROM (
              SELECT
                eu.staff_id as staff_id,
                cs.TRANS_TYPE as trans_type,
                CASE
                  WHEN cs.TRANS_TYPE = '01' THEN COUNT(DISTINCT cs.ORDER_NO)
                  WHEN cs.TRANS_TYPE = '02' THEN -COUNT(DISTINCT cs.ORDER_NO)
                END AS order_count
              FROM CUSTOMER_SALES cs 
              JOIN ELLC_USERS eu ON eu.staff_id = cs.STAFF_ID
              JOIN ELLC_USER_PROFILES eup ON eup.user_id = eu.ID
              AND eup.business_unit = ?
              AND cs.ORDER_DATE  >= ?
              AND cs.ORDER_DATE  <= ?
              GROUP BY eu.staff_id, cs.TRANS_TYPE
            ) AS T
            GROUP BY staff_id
          ) AS R
      `, [businessUnit, startDate, endDate])

      if (data.length === 0 || data[0].length === 0 || !data[0][0].hasOwnProperty('businessUnitAvg')) {
        return null
      }
      return data[0][0]['businessUnitAvg']

    } catch (err) {
      const msg = 'Failed to connect to database'
      logger.error(`findOrderCountBusinessUnitAvg: ${msg}, error=${err}`)
      throw new InternalServiceError(msg)
  }
}


  public async findAvgBrandPerOrderCount(args: IQueryArguments): Promise<number | null> {
    const { startDate, endDate, staffId } = args
    const conn = await databaseConnection.getConnection()
    try {
      const data = await conn.raw(`
          SELECT
            AVG(c) as 'current'
          FROM (
            SELECT
              COUNT(pb.BRAND_CODE) as c,
              eu.staff_id as staff_id
            FROM
              CUSTOMER_SALES cs
            JOIN PB_INFO pi2 ON pi2.NEO_SKU_ID = cs.NEO_SKU_ID 
            JOIN PRODUCT_BIBLE pb ON pb.LC_STYLE_CODE = pi2.LC_STYLE_CODE 
            JOIN ELLC_USERS eu ON eu.staff_id = cs.STAFF_ID
            JOIN ELLC_USER_PROFILES eup ON eup.user_id = eu.ID
            AND cs.TRANS_TYPE = '01'
            AND cs.ORDER_DATE >= ?
            AND cs.ORDER_DATE <= ?
            AND eu.staff_id = ?
            AND cs.ID not in (SELECT ID FROM CUSTOMER_SALES cs2 WHERE cs2.TRANS_TYPE = '02')
            GROUP BY cs.ORDER_NO
        ) AS T
      `, [startDate, endDate, staffId])
      if (data.length === 0 || data[0].length === 0 || !data[0][0].hasOwnProperty('current')) {
        return null
      }
      return data[0][0]['current']

    } catch (err) {
      const msg = 'Failed to connect to database'
      logger.error(`findAvgBrandPerOrderCount: ${msg}, error=${err}`)
      throw new InternalServiceError(msg)
    }
  }

  public async findAvgBrandPerOrderCountBusinessUnitAvg(args: IQueryArguments): Promise<number | null> {
    const { startDate, endDate, businessUnit } = args
    const conn = await databaseConnection.getConnection()
    try {

      const data = await conn.raw(`
          SELECT
            AVG(number_of_brand_per_order) as businessUnitAverage
            FROM (
              SELECT
                staff_id,
                AVG(c) as number_of_brand_per_order
              FROM (
                SELECT
                  COUNT(pb.BRAND_CODE) as c,
                  eu.staff_id as staff_id
                FROM CUSTOMER_SALES cs
                JOIN PB_INFO pi2 ON pi2.NEO_SKU_ID = cs.NEO_SKU_ID
                JOIN PRODUCT_BIBLE pb ON pb.LC_STYLE_CODE = pi2.LC_STYLE_CODE
                JOIN ELLC_USERS eu ON eu.staff_id = cs.STAFF_ID
                JOIN ELLC_USER_PROFILES eup ON eup.user_id = eu.ID
                AND cs.TRANS_TYPE = '01'
                AND eup.business_unit  = ?
                AND cs.ORDER_DATE >= ?
                AND cs.ORDER_DATE <= ?
                AND cs.ID not in (SELECT ID FROM CUSTOMER_SALES cs2 WHERE cs2.TRANS_TYPE = '02')
                GROUP BY eu.staff_id, cs.ORDER_NO
              ) AS T
            GROUP BY staff_id
            ) AS R
      `, [businessUnit, startDate, endDate])
      if (data.length === 0 || data[0].length === 0 || !data[0][0].hasOwnProperty('businessUnitAvg')) {
        return null
      }
      return data[0][0]['businessUnitAvg']

    } catch (err) {
      const msg = 'Failed to connect to database'
      logger.error(`findAvgBrandPerOrderCountBusinessUnitAvg: ${msg}, error=${err}`)
      throw new InternalServiceError(msg)
    }
  }

  public async findAvgBasketSize(args: IQueryArguments): Promise<number | null> {
    const { startDate, endDate, staffId } = args
    const conn = await databaseConnection.getConnection()
    try {

      const data = await conn.raw(`
        SELECT SUM(transactedItemSum) / (
          SELECT 
            SUM(order_count)  
          FROM (
            SELECT
              eu.staff_id as staff_id,
                    cs.TRANS_TYPE as trans_type,
                    CASE
                      WHEN cs.TRANS_TYPE = '01' THEN COUNT(DISTINCT cs.ORDER_NO)
                      WHEN cs.TRANS_TYPE = '02' THEN -COUNT(DISTINCT cs.ORDER_NO)
                    END AS order_count
            FROM CUSTOMER_SALES cs 
            JOIN ELLC_USERS eu ON eu.staff_id = cs.STAFF_ID
            JOIN ELLC_USER_PROFILES eup ON eup.user_id = eu.ID
            AND eu.staff_id = ?
            AND cs.ORDER_DATE  >= ?
            AND cs.ORDER_DATE  <= ?
            GROUP BY eu.staff_id, cs.TRANS_TYPE
            ) AS T 
            ) as avgBasketSize
        FROM (
          SELECT
          eu.staff_id as staffID, 
            CASE
              WHEN cs.TRANS_TYPE = '01' THEN SUM(bop.PRODUCT_QTY)
              WHEN cs.TRANS_TYPE = '02' THEN -SUM(bop.PRODUCT_QTY)
            END as transactedItemSum
          FROM CUSTOMER_SALES cs
          JOIN BASKET_ORDER_PRODUCTS bop ON cs.NEO_SKU_ID = bop.PRODUCT_SKU
          JOIN ELLC_USERS eu on eu.staff_id = cs.STAFF_ID
          JOIN ELLC_USER_PROFILES eup on eup.user_id = eu.ID
          AND eu.staff_id = ?
          AND cs.ORDER_DATE  >= ?
          AND cs.ORDER_DATE  <= ?
          GROUP BY eu.staff_id, cs.TRANS_TYPE
        ) AS T
      `, [staffId, startDate, endDate, staffId, startDate, endDate])
      if (data.length === 0 || data[0].length === 0 || !data[0][0].hasOwnProperty('avgBasketSize')) {
        return null
      }
      return data[0][0]['avgBasketSize']

    } catch (err) {
      const msg = 'Failed to connect to database'
      logger.error(`findAvgBasketSize: ${msg}, error=${err}`)
      throw new InternalServiceError(msg)
    }
  }

  public async findAvgBasketSizeBusinessUnitAvg(args: IQueryArguments): Promise<number | null> {
    const { startDate, endDate, businessUnit } = args
    const conn = await databaseConnection.getConnection()
    try {
      const data = await conn.raw(`
      SELECT SUM(transactedItemSum) / (
      SELECT 
        SUM(order_count)  
      FROM (
        SELECT
          eu.staff_id as staff_id,
                cs.TRANS_TYPE as trans_type,
                CASE
                  WHEN cs.TRANS_TYPE = '01' THEN COUNT(DISTINCT cs.ORDER_NO)
                  WHEN cs.TRANS_TYPE = '02' THEN -COUNT(DISTINCT cs.ORDER_NO)
                END AS order_count
            FROM CUSTOMER_SALES cs 
            JOIN ELLC_USERS eu ON eu.staff_id = cs.STAFF_ID
            JOIN ELLC_USER_PROFILES eup ON eup.user_id = eu.ID
            AND eup.business_unit = ?
            AND cs.ORDER_DATE  >= ?
            AND cs.ORDER_DATE  <= ?
            GROUP BY eu.staff_id, cs.TRANS_TYPE
            ) AS T 
        ) as businessUnitAvg
      FROM (
        SELECT
        eu.staff_id as staffID, 
          CASE
            WHEN cs.TRANS_TYPE = '01' THEN SUM(bop.PRODUCT_QTY)
            WHEN cs.TRANS_TYPE = '02' THEN -SUM(bop.PRODUCT_QTY)
          END as transactedItemSum
        FROM CUSTOMER_SALES cs
        JOIN BASKET_ORDER_PRODUCTS bop ON cs.NEO_SKU_ID = bop.PRODUCT_SKU
        JOIN ELLC_USERS eu on eu.staff_id = cs.STAFF_ID
        JOIN ELLC_USER_PROFILES eup on eup.user_id = eu.ID
        WHERE eup.business_unit = ?
        AND cs.ORDER_DATE  >= ?
        AND cs.ORDER_DATE  <= ?
        GROUP BY eu.staff_id, cs.TRANS_TYPE
      ) AS T
      `, [businessUnit, startDate, endDate, businessUnit, startDate, endDate])
      if (data.length === 0 || data[0].length === 0 || !data[0][0].hasOwnProperty('businessUnitAvg')) {
        return null
      }
      return data[0][0]['businessUnitAvg']

    } catch (err) {
      const msg = 'Failed to connect to database'
      logger.error(`findAvgBasketSizeBusinessUnitAvg: ${msg}, error=${err}`)
      throw new InternalServiceError(msg)
    }
  }

  public async getAvgBasketValue(args: IQueryArguments): Promise<number | null> {
    try {
      // TODO: replace the error with Knex SQL query 
      logger.debug(`getAvgBasketValue: args=${args}`)
      throw new UnknownError('Not Implemented')
    } catch (err) {
      const msg = 'Failed to connect to database'
      logger.error(`getAvgBasketValue: ${msg}, error=${err}`)
      throw new InternalServiceError(msg)
    }
  } 

  public async getAvgBasketValueBusinessUnitAvg(args: IQueryArguments): Promise<number | null> {
    try {
      // TODO: replace the error with Knex SQL query 
      logger.debug(`getAvgBasketValueBusinessUnitAvg: args=${args}`)
      throw new UnknownError('Not Implemented')
    } catch (err) {
      const msg = 'Failed to connect to database'
      logger.error(`getAvgBasketValueBusinessUnitAvg: ${msg}, error=${err}`)
      throw new InternalServiceError(msg)
    }
  }

  public async findAvgBusinessUnitPerOrderCount(args: IQueryArguments): Promise<number | null> {
    const { startDate, endDate, staffId } = args
    const conn = await databaseConnection.getConnection()
    try {
      const data = await conn.raw(`
            SELECT
              AVG(avgBUCount) as 'current'
            FROM (
              SELECT
                cs.ORDER_NO,
                COUNT(DISTINCT pb.DEPT) as avgBUCount
              FROM CUSTOMER_SALES cs 
              JOIN PB_INFO pi2 on cs.NEO_SKU_ID = pi2.NEO_SKU_ID
              JOIN PRODUCT_BIBLE pb on pb.LC_STYLE_CODE = pi2.LC_STYLE_CODE
              JOIN STAFF_CUSTOMERS sc on sc.STAFF_ID = cs.STAFF_ID
              AND cs.STAFF_ID = ?
              AND cs.ORDER_DATE >= ?
              AND cs.ORDER_DATE <= ?
              GROUP BY cs.ORDER_NO
            ) as R     
      `, [staffId, startDate, endDate])
      if (data.length === 0 || data[0].length === 0 || !data[0][0].hasOwnProperty('current')) {
        return null
      }
      return data[0][0]['current']
    } catch (err) {
      const msg = 'Failed to connect to database'
      logger.error(`findavgBusinessUnitPerOrderCount: ${msg}, error=${err}`)
      throw new InternalServiceError(msg)
    }
  } 

  public async findAvgBusinessUnitPerOrderCountBusinessUnitAvg(args: IQueryArguments): Promise<number | null> {
    const { startDate, endDate, businessUnit } = args
    const conn = await databaseConnection.getConnection()
    try {
      const data = await conn.raw(`
          SELECT 
            AVG(avgBUCountWithinBU) as businessUnitAvg
          FROM (
            SELECT
              AVG(avgBUCount) avgBUCountWithinBU
            FROM (
              SELECT
                cs.STAFF_ID as staffId,
                cs.ORDER_NO,
                COUNT(DISTINCT pb.DEPT) as avgBUCount
              FROM CUSTOMER_SALES cs 
              JOIN PB_INFO pi2 on cs.NEO_SKU_ID = pi2.NEO_SKU_ID
              JOIN PRODUCT_BIBLE pb on pb.LC_STYLE_CODE = pi2.LC_STYLE_CODE
              JOIN ELLC_USERS eu on eu.staff_id = cs.STAFF_ID
              JOIN ELLC_USER_PROFILES eup on eu.ID = eup.user_id
              AND eup.business_unit  = ?
              AND cs.ORDER_DATE >= ?
              AND cs.ORDER_DATE <= ?
              AND cs.STAFF_ID in (SELECT DISTINCT sc.STAFF_ID FROM STAFF_CUSTOMERS sc)
              GROUP BY cs.STAFF_ID, cs.ORDER_NO
            ) AS T
          GROUP BY staffId
        ) AS R 
      `, [businessUnit, startDate, endDate])
      if (data.length === 0 || data[0].length === 0 || !data[0][0].hasOwnProperty('businessUnitAvg')) {
        return null
      }
      return data[0][0]['businessUnitAvg']

    } catch (err) {
      const msg = 'Failed to connect to database'
      logger.error(`findavgBusinessUnitPerOrderCountBusinessUnitAvg: ${msg}, error=${err}`)
      throw new InternalServiceError(msg)
    }
  }
}

export const orderRepository = new OrderRepository()
