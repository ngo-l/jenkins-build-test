import { Injectable } from '@nestjs/common'
import {
  IQueryArguments,
  ITestDataFields,
} from '../common/interfaces/query.interfaces'
import { DatabaseConnector } from '../common/database/database.connector'
import * as R from 'ramda'
import { CustomerTypeEnum } from '../customers/customers.enum'

@Injectable()
export class OrderRepository {
  constructor(private db: DatabaseConnector) {}

  public async findOrderCount({
    staffId,
    startDate,
    endDate,
  }: IQueryArguments): Promise<number | null> {
    const conn = await this.db.getConnection()

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

    const transType01 = parseInt(
      data.filter((x) => x['trans_type'] === '01')[0].order_count,
    )
    const transType02 =
      data.filter((x) => x['trans_type'] === '02').length > 0
        ? parseInt(data.filter((x) => x['trans_type'] === '02')[0].order_count)
        : 0
    return transType01 - transType02
  }

  public async findOrderCountBusinessUnitAvg({
    startDate,
    endDate,
    businessUnit,
  }: IQueryArguments): Promise<number | null> {
    const conn = await this.db.getConnection()
    // TODO: replace raw with ORM
    const data = await conn.raw(
      `
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
              AND eup.business_unit = :businessUnit
              AND cs.ORDER_DATE  >= :startDate
              AND cs.ORDER_DATE  <= :endDate
              GROUP BY eu.staff_id, cs.TRANS_TYPE
            ) AS T
            GROUP BY staff_id
          ) AS R
      `,
      { businessUnit, startDate, endDate },
    )
    const dataPath = ['0', '0', 'businessUnitAvg']
    return R.hasPath(dataPath, data) ? R.path(dataPath, data) : null
  }

  public async findAvgBrandPerOrderCount({
    startDate,
    endDate,
    staffId,
  }: IQueryArguments): Promise<number | null> {
    const conn = await this.db.getConnection()
    // TODO: replace raw with ORM
    const data = await conn.raw(
      `
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
            AND cs.ID NOT IN (SELECT ID FROM CUSTOMER_SALES cs2 WHERE cs2.TRANS_TYPE = '02')
            GROUP BY cs.ORDER_NO
        ) AS T
      `,
      [startDate, endDate, staffId],
    )
    const dataPath = ['0', '0', 'current']
    return R.hasPath(dataPath, data) ? R.path(dataPath, data) : null
  }

  public async findAvgBrandPerOrderCountBusinessUnitAvg({
    startDate,
    endDate,
    businessUnit,
  }: IQueryArguments): Promise<number | null> {
    const conn = await this.db.getConnection()
    // TODO: replace raw with ORM
    const data = await conn.raw(
      `
          SELECT
            AVG(number_of_brand_per_order) as businessUnitAvg
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
                AND eup.business_unit  = :businessUnit
                AND cs.ORDER_DATE >= :startDate
                AND cs.ORDER_DATE <= :endDate
                AND cs.ID NOT IN (SELECT ID FROM CUSTOMER_SALES cs2 WHERE cs2.TRANS_TYPE = '02')
                GROUP BY eu.staff_id, cs.ORDER_NO
              ) AS T
            GROUP BY staff_id
            ) AS R
      `,
      { businessUnit, startDate, endDate },
    )

    const dataPath = ['0', '0', 'businessUnitAvg']
    return R.hasPath(dataPath, data) ? R.path(dataPath, data) : null
  }

  public async findAvgBasketSize({
    startDate,
    endDate,
    staffId,
  }: IQueryArguments): Promise<number | null> {
    const conn = await this.db.getConnection()
    // TODO: replace raw with ORM
    const data = await conn.raw(
      `
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
            AND eu.staff_id = :staffId
            AND cs.ORDER_DATE  >= :startDate
            AND cs.ORDER_DATE  <= :endDate
            GROUP BY eu.staff_id, cs.TRANS_TYPE
            ) AS T 
            ) as current
        FROM (
          SELECT
          eu.staff_id as staffID, 
            CASE
              WHEN cs.TRANS_TYPE = '01' THEN SUM(cs.DTL_QTY)
              WHEN cs.TRANS_TYPE = '02' THEN -SUM(cs.DTL_QTY)
            END as transactedItemSum
          FROM CUSTOMER_SALES cs
          JOIN ELLC_USERS eu on eu.staff_id = cs.STAFF_ID
          JOIN ELLC_USER_PROFILES eup on eup.user_id = eu.ID
          AND eu.staff_id = :staffId
          AND cs.ORDER_DATE  >= :startDate
          AND cs.ORDER_DATE  <= :endDate
          GROUP BY eu.staff_id, cs.TRANS_TYPE
        ) AS T
      `,
      { staffId, startDate, endDate },
    )
    const dataPath = ['0', '0', 'current']
    return R.hasPath(dataPath, data)
      ? R.path(dataPath, data) === null
        ? 0
        : R.path(dataPath, data)
      : null
  }

  public async findAvgBasketSizeBusinessUnitAvg({
    startDate,
    endDate,
    businessUnit,
  }: IQueryArguments): Promise<number | null> {
    const conn = await this.db.getConnection()
    // TODO: replace raw with ORM
    const data = await conn.raw(
      `
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
            AND eup.business_unit = :businessUnit
            AND cs.ORDER_DATE  >= :startDate
            AND cs.ORDER_DATE  <= :endDate
            GROUP BY eu.staff_id, cs.TRANS_TYPE
            ) AS T 
        ) as businessUnitAvg
      FROM (
        SELECT
        eu.staff_id as staffID, 
          CASE
            WHEN cs.TRANS_TYPE = '01' THEN SUM(cs.DTL_QTY)
            WHEN cs.TRANS_TYPE = '02' THEN -SUM(cs.DTL_QTY)
          END as transactedItemSum
        FROM CUSTOMER_SALES cs
        JOIN ELLC_USERS eu on eu.staff_id = cs.STAFF_ID
        JOIN ELLC_USER_PROFILES eup on eup.user_id = eu.ID
        WHERE eup.business_unit = :businessUnit
        AND cs.ORDER_DATE  >= :startDate
        AND cs.ORDER_DATE  <= :endDate
        GROUP BY eu.staff_id, cs.TRANS_TYPE
      ) AS T
      `,
      { businessUnit, startDate, endDate },
    )
    const dataPath = ['0', '0', 'businessUnitAvg']
    return R.hasPath(dataPath, data)
      ? R.path(dataPath, data) === null
        ? 0
        : R.path(dataPath, data)
      : null
  }

  public async findAvgBusinessUnitPerOrderCount({
    startDate,
    endDate,
    staffId,
  }: IQueryArguments): Promise<number | null> {
    const conn = await this.db.getConnection()
    const data = await conn.raw(
      `
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
              AND cs.STAFF_ID = :staffId
              AND cs.ORDER_DATE >= :startDate
              AND cs.ORDER_DATE <= :endDate
              GROUP BY cs.ORDER_NO
            ) as R     
      `,
      { staffId, startDate, endDate },
    )
    const dataPath = ['0', '0', 'current']
    return R.hasPath(dataPath, data) ? R.path(dataPath, data) : null
  }

  public async findAvgBusinessUnitPerOrderCountBusinessUnitAvg({
    startDate,
    endDate,
    businessUnit,
  }: IQueryArguments): Promise<number | null> {
    const conn = await this.db.getConnection()
    const data = await conn.raw(
      `
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
              AND eup.business_unit  = :businessUnit
              AND cs.ORDER_DATE >= :startDate
              AND cs.ORDER_DATE <= :endDate
              AND cs.STAFF_ID in (SELECT DISTINCT sc.STAFF_ID FROM STAFF_CUSTOMERS sc)
              GROUP BY cs.STAFF_ID, cs.ORDER_NO
            ) AS T
          GROUP BY staffId
        ) AS R 
      `,
      { businessUnit, startDate, endDate },
    )
    const dataPath = ['0', '0', 'businessUnitAvg']
    return R.hasPath(dataPath, data) ? R.path(dataPath, data) : null
  }

  public async findSales({
    staffId,
    customerType,
    startDate,
    endDate,
    currencyType,
  }: IQueryArguments): Promise<number | null> {
    const conn = await this.db.getConnection()
    const q = conn
      .sum(`CUSTOMER_SALES.AMT_${currencyType} as current`)
      .from('CUSTOMER_SALES')
      .join('ELLC_USERS', 'ELLC_USERS.staff_id', 'CUSTOMER_SALES.STAFF_ID')
      .join('ELLC_USER_PROFILES', 'ELLC_USER_PROFILES.user_id', 'ELLC_USERS.ID')
    const extQ = customerType.includes(CustomerTypeEnum.ALL)
      ? q
      : q
          .join(
            'STAFF_CUSTOMERS',
            'STAFF_CUSTOMERS.STAFF_ID',
            'CUSTOMER_SALES.STAFF_ID',
          )
          .whereIn('STAFF_CUSTOMERS.CUSTOMER_TYPE', customerType)
    const data = await extQ
      .where('CUSTOMER_SALES.ORDER_DATE', '>=', startDate)
      .where('CUSTOMER_SALES.ORDER_DATE', '<=', endDate)
      .whereNotIn(
        'CUSTOMER_SALES.NEO_SKU_ID',
        conn.select('ITEM').from('TEMP_EGC_ITEMS'),
      )
      .whereIn('ELLC_USERS.staff_id', [staffId])

    const dataPath = ['0', 'current']
    return R.hasPath(dataPath, data) ? R.path(dataPath, data) : null
  }

  public async findSalesBusinessUnitAvg({
    customerType,
    startDate,
    endDate,
    businessUnit,
    currencyType,
  }: IQueryArguments): Promise<number | null> {
    const conn = await this.db.getConnection()
    const subquery = conn
      .sum(`CUSTOMER_SALES.AMT_${currencyType} as salesCount`)
      .from('CUSTOMER_SALES')
      .join('ELLC_USERS', 'ELLC_USERS.staff_id', 'CUSTOMER_SALES.STAFF_ID')
      .join('ELLC_USER_PROFILES', 'ELLC_USER_PROFILES.user_id', 'ELLC_USERS.ID')

    const extSubquery = customerType.includes(CustomerTypeEnum.ALL)
      ? subquery
      : subquery
          .join(
            'STAFF_CUSTOMERS',
            'STAFF_CUSTOMERS.STAFF_ID',
            'CUSTOMER_SALES.STAFF_ID',
          )
          .whereIn('STAFF_CUSTOMERS.CUSTOMER_TYPE', customerType)
    const q = extSubquery
      .where('CUSTOMER_SALES.ORDER_DATE', '>=', startDate)
      .where('CUSTOMER_SALES.ORDER_DATE', '<=', endDate)
      .whereIn('ELLC_USER_PROFILES.business_unit', [businessUnit])
      .whereNotIn(
        'CUSTOMER_SALES.NEO_SKU_ID',
        conn.select('ITEM').from('TEMP_EGC_ITEMS'),
      )
      .groupBy('ELLC_USERS.staff_id')
      .as('t')
    const data = await conn.from(q).avg('salesCount as businessUnitAvg')
    const dataPath = ['0', 'businessUnitAvg']
    return R.hasPath(dataPath, data) ? R.path(dataPath, data) : null
  }

  public async findAvgBasketValue({
    staffId,
    startDate,
    endDate,
    currencyType,
  }: IQueryArguments): Promise<number | null> {
    const conn = await this.db.getConnection()
    const data = await conn.raw(
      `
        SELECT
        SUM(amount) / SUM(orderCount) as current
        FROM (
        SELECT
          cs.STAFF_ID as staffID,	
          SUM(cs.AMT_${currencyType}) as amount,
          CASE
            WHEN cs.TRANS_TYPE = '01' THEN COUNT(DISTINCT(cs.ORDER_NO))
            ELSE -COUNT(DISTINCT(cs.ORDER_NO))
          END as orderCount,
          cs.TRANS_TYPE as transType
        FROM CUSTOMER_SALES cs
        JOIN ELLC_USERS eu ON eu.staff_id = cs.STAFF_ID
        JOIN ELLC_USER_PROFILES eup ON eup.user_id = eu.ID
        AND eu.staff_id = :staffId
        AND cs.ORDER_DATE  >= :startDate
        AND cs.ORDER_DATE  <= :endDate
        AND cs.NEO_SKU_ID NOT IN (SELECT ITEM FROM TEMP_EGC_ITEMS)
        GROUP BY cs.TRANS_TYPE
        ) AS T
    `,
      { staffId, startDate, endDate },
    )
    const dataPath = ['0', '0', 'current']
    return R.hasPath(dataPath, data) ? R.path(dataPath, data) : null
  }

  public async findAvgBasketValueBusinessUnitAvg({
    businessUnit,
    startDate,
    endDate,
    currencyType,
  }: IQueryArguments): Promise<number | null> {
    const conn = await this.db.getConnection()
    const data = await conn.raw(
      `
      SELECT 
        AVG(AvgBasketValue) as businessUnitAvg
      FROM (
        SELECT
          staffID,
          SUM(amount) / SUM(orderCount) as AvgBasketValue
        FROM (
          SELECT
            cs.STAFF_ID as staffID,	
            SUM(cs.AMT_${currencyType}) as amount,
            CASE
              WHEN cs.TRANS_TYPE = '01' THEN COUNT(DISTINCT(cs.ORDER_NO))
              ELSE -COUNT(DISTINCT(cs.ORDER_NO))
            END as orderCount,
            cs.TRANS_TYPE as transType
          FROM CUSTOMER_SALES cs
          JOIN ELLC_USERS eu ON eu.staff_id = cs.STAFF_ID
          JOIN ELLC_USER_PROFILES eup ON eup.user_id = eu.ID
          AND eup.business_unit = :businessUnit
          AND cs.ORDER_DATE  >= :startDate
          AND cs.ORDER_DATE  <= :endDate
          AND cs.NEO_SKU_ID NOT IN (SELECT ITEM FROM TEMP_EGC_ITEMS)
          GROUP BY cs.STAFF_ID, cs.TRANS_TYPE
        ) as T
        GROUP BY staffID
      ) AS K    
  `,
      { businessUnit, startDate, endDate },
    )
    const dataPath = ['0', '0', 'businessUnitAvg']
    return R.hasPath(dataPath, data) ? R.path(dataPath, data) : null
  }

  public async findSalesPerformanceTestData(
    staffId: string,
    startDate: string,
    endDate: string,
  ): Promise<ITestDataFields[]> {
    const conn = await this.db.getConnection()
    const data = await conn.raw(
      `
      SELECT 
        * 
      FROM test_metrics tm 
      WHERE tm.queryName = 'salesPerformanceMetricsData'
      AND tm.staffID = :staffId
      AND startDate >= :startDate
      AND endDate >= :endDate
    `,
      {
        staffId,
        startDate,
        endDate,
      },
    )
    const dataPath = ['0']
    return R.hasPath(dataPath, data) ? R.path(dataPath, data) : null
  }
}
