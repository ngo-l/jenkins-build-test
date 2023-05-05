import { Injectable } from '@nestjs/common'
import { DatabaseConnector } from '../common/database/database.connector'
import {
  ICustomerCountQueryOutput,
  IQueryArguments,
  ITestDataFields,
} from '../common/interfaces/query.interfaces'
import { CustomerTypeEnum } from './customers.enum'
import {
  IClienteleCustomerCountByBusinessUnitInput,
  IClienteleCustomerCountInput,
  IClienteleCustomerCountOutput,
  ICustomerReachCountOutput,
} from './interfaces/customers.interfaces'
import * as R from 'ramda'

@Injectable()
export class CustomerRepository {
  constructor(private db: DatabaseConnector) {}

  public async findCustomerReturnCount({
    staffId,
    startDate,
    endDate,
    customerType,
  }: IQueryArguments): Promise<number | null> {
    const conn = await this.db.getConnection()
    const q = conn
      .countDistinct('CUSTOMER_SALES.VIP_NO as customerCount')
      .from('CUSTOMER_SALES')
      .join(
        'STAFF_CUSTOMERS',
        'STAFF_CUSTOMERS.CUSTOMER_VIP_NO',
        'CUSTOMER_SALES.VIP_NO',
      )
      .join('ELLC_USERS', 'ELLC_USERS.staff_id', 'STAFF_CUSTOMERS.STAFF_ID')
      .join('ELLC_USER_PROFILES', 'ELLC_USER_PROFILES.user_id', 'ELLC_USERS.id')
      .where('CUSTOMER_SALES.ORDER_DATE', '>=', startDate)
      .where('CUSTOMER_SALES.ORDER_DATE', '<=', endDate)
      .where('ELLC_USERS.staff_id', staffId)
    const qWithCustomerTypes = customerType.includes(CustomerTypeEnum.ALL)
      ? q
      : q.whereIn('STAFF_CUSTOMERS.CUSTOMER_TYPE', customerType)
    const data: ICustomerCountQueryOutput[] = await qWithCustomerTypes.groupBy(
      'ELLC_USERS.staff_id',
    )
    const dataPath = ['0', 'customerCount']
    return R.hasPath(dataPath, data) ? R.path(dataPath, data) : null
  }

  public async findCustomerReturnCountBusinessUnitAvg(
    args: IQueryArguments,
    businessUnit: string,
  ): Promise<number | null> {
    if (businessUnit === null || businessUnit === undefined) {
      return undefined
    }
    const { startDate, endDate, customerType } = args
    const conn = await this.db.getConnection()
    const subquery = conn
      .countDistinct('CUSTOMER_SALES.VIP_NO as customerCount')
      .from('CUSTOMER_SALES')
      .join(
        'STAFF_CUSTOMERS',
        'STAFF_CUSTOMERS.CUSTOMER_VIP_NO',
        'CUSTOMER_SALES.VIP_NO',
      )
      .join('ELLC_USERS', 'ELLC_USERS.staff_id', 'STAFF_CUSTOMERS.STAFF_ID')
      .join('ELLC_USER_PROFILES', 'ELLC_USER_PROFILES.user_id', 'ELLC_USERS.id')
      .where('CUSTOMER_SALES.ORDER_DATE', '>=', startDate)
      .where('CUSTOMER_SALES.ORDER_DATE', '<=', endDate)
      .where('ELLC_USER_PROFILES.business_unit', businessUnit)
    const subqueryWithCustomerTypes = customerType.includes(
      CustomerTypeEnum.ALL,
    )
      ? subquery
      : subquery.whereIn('STAFF_CUSTOMERS.CUSTOMER_TYPE', customerType)
    const sq = subqueryWithCustomerTypes.groupBy('ELLC_USERS.staff_id').as('t')
    const data = await conn.from(sq).avg('customerCount as businessUnitAvg')
    const dataPath = ['0', 'businessUnitAvg']
    return R.hasPath(dataPath, data) ? R.path(dataPath, data) : null
  }

  public async findCustomerReachCount({
    staffId,
    startDate,
    endDate,
    customerType,
  }: IQueryArguments): Promise<number | null> {
    const conn = await this.db.getConnection()
    const q = conn
      .countDistinct(
        'STAFF_CUSTOMER_INTERACTIONS.CUSTOMER_VIP_NO as customerCount',
      )
      .from('STAFF_CUSTOMER_INTERACTIONS')
      .join(
        'STAFF_CUSTOMERS',
        'STAFF_CUSTOMERS.CUSTOMER_VIP_NO',
        'STAFF_CUSTOMER_INTERACTIONS.CUSTOMER_VIP_NO',
      )
      .join(
        'ELLC_USERS',
        'ELLC_USERS.staff_id',
        'STAFF_CUSTOMER_INTERACTIONS.STAFF_ID',
      )
      .join('ELLC_USER_PROFILES', 'ELLC_USER_PROFILES.user_id', 'ELLC_USERS.id')
      .where('STAFF_CUSTOMER_INTERACTIONS.INTERACTED_AT', '>=', startDate)
      .where('STAFF_CUSTOMER_INTERACTIONS.INTERACTED_AT', '<=', endDate)
      .where('ELLC_USERS.staff_id', staffId)
    const qWithCustomerTypes = customerType.includes(CustomerTypeEnum.ALL)
      ? q
      : q.whereIn('STAFF_CUSTOMERS.CUSTOMER_TYPE', customerType)
    const data: ICustomerReachCountOutput[] = await qWithCustomerTypes.groupBy(
      'ELLC_USERS.staff_id',
    )
    const dataPath = ['0', 'customerCount']
    return R.hasPath(dataPath, data) ? R.path(dataPath, data) : null
  }

  public async findCustomerReachCountBusinessUnitAvg(
    args: IQueryArguments,
  ): Promise<number | null> {
    const { startDate, endDate, customerType, businessUnit } = args
    if (businessUnit === null || businessUnit === undefined) {
      return undefined
    }
    const conn = await this.db.getConnection()
    const subquery = conn
      .countDistinct(
        'STAFF_CUSTOMER_INTERACTIONS.CUSTOMER_VIP_NO as customerCount',
      )
      .from('STAFF_CUSTOMER_INTERACTIONS')
      .join(
        'STAFF_CUSTOMERS',
        'STAFF_CUSTOMERS.CUSTOMER_VIP_NO',
        'STAFF_CUSTOMER_INTERACTIONS.CUSTOMER_VIP_NO',
      )
      .join(
        'ELLC_USERS',
        'ELLC_USERS.staff_id',
        'STAFF_CUSTOMER_INTERACTIONS.STAFF_ID',
      )
      .join('ELLC_USER_PROFILES', 'ELLC_USER_PROFILES.user_id', 'ELLC_USERS.id')
      .where('STAFF_CUSTOMER_INTERACTIONS.INTERACTED_AT', '>=', startDate)
      .where('STAFF_CUSTOMER_INTERACTIONS.INTERACTED_AT', '<=', endDate)
      .where('ELLC_USER_PROFILES.business_unit', businessUnit)
    const subqueryWithCustomerTypes = customerType.includes(
      CustomerTypeEnum.ALL,
    )
      ? subquery
      : subquery.whereIn('STAFF_CUSTOMERS.CUSTOMER_TYPE', customerType)
    const sq = subqueryWithCustomerTypes.groupBy('ELLC_USERS.staff_id')
    const [{ businessUnitAvg }] = await conn
      .from(sq.as('t'))
      .avg('customerCount as businessUnitAvg')
    return businessUnitAvg
  }

  public async findCustomerAvgVisitCount({
    startDate,
    endDate,
    staffId,
  }: IQueryArguments): Promise<number | null> {
    const conn = await this.db.getConnection()
    // TODO: replace raw with ORM
    const data = await conn.raw(
      `
    SELECT 
      (SUM(numberOfDistinctCustomer) / (SELECT COUNT(DISTINCT (sc.CUSTOMER_VIP_NO)) FROM STAFF_CUSTOMERS sc WHERE sc.STAFF_ID  = :staffId) ) as current
    FROM (
      SELECT
          COUNT(DISTINCT(cs.VIP_NO)) as numberOfDistinctCustomer
      FROM CUSTOMER_SALES cs
      JOIN ELLC_USERS eu ON eu.staff_id = cs.STAFF_ID
      JOIN ELLC_USER_PROFILES eup ON eup.user_id = eu.ID
      AND cs.STAFF_ID = :staffId
      AND cs.ORDER_DATE  >= :startDate
      AND cs.ORDER_DATE  <= :endDate
      AND cs.STAFF_ID IN (SELECT sc.STAFF_ID FROM STAFF_CUSTOMERS sc)
      GROUP BY DAY(cs.ORDER_DATE), cs.LOC_CODE
    ) AS T
`,
      { staffId, startDate, endDate },
    )
    const dataPath = ['0', '0', 'current']
    return R.hasPath(dataPath, data) ? R.path(dataPath, data) : null
  }

  public async findCustomerAvgVisitCountBusinessUnitAvg({
    startDate,
    endDate,
    businessUnit,
  }: IQueryArguments): Promise<number | null> {
    const conn = await this.db.getConnection()
    // TODO: replace raw with ORM
    const data = await conn.raw(
      `
      SELECT 
        (SUM(numberOfDistinctCustomer) / (
          SELECT 
            COUNT(DISTINCT sc.CUSTOMER_VIP_NO)
          FROM STAFF_CUSTOMERS sc
          JOIN ELLC_USERS eu ON eu.staff_id = sc.STAFF_ID
          JOIN ELLC_USER_PROFILES eup ON eup.user_id = eu.ID
          AND eup.business_unit = :businessUnit
          )
        ) AS businessUnitAvg
      FROM (
        SELECT
            COUNT(DISTINCT(cs.VIP_NO)) as numberOfDistinctCustomer
        FROM CUSTOMER_SALES cs
        JOIN ELLC_USERS eu ON eu.staff_id = cs.STAFF_ID
        JOIN ELLC_USER_PROFILES eup ON eup.user_id = eu.ID
        AND eup.business_unit = :businessUnit
        AND cs.ORDER_DATE  >= :startDate
        AND cs.ORDER_DATE  <= :endDate
        AND cs.STAFF_ID IN (SELECT sc.STAFF_ID FROM STAFF_CUSTOMERS sc)
        GROUP BY DAY(cs.ORDER_DATE), cs.LOC_CODE
      ) AS T`,
      { businessUnit, startDate, endDate },
    )
    const dataPath = ['0', '0', 'businessUnitAvg']
    return R.hasPath(dataPath, data) ? R.path(dataPath, data) : null
  }

  public async findAvgDaysSinceLastPurchase({
    startDate,
    endDate,
    staffId,
  }: IQueryArguments): Promise<number | null> {
    const conn = await this.db.getConnection()
    // TODO: replace raw with ORM
    const data = await conn.raw(
      `
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
      [staffId, startDate, endDate],
    )
    const dataPath = ['0', '0', 'days']
    return R.hasPath(dataPath, data) ? R.path(dataPath, data) : null
  }

  public async findAvgDaysSinceLastPurchaseBusinessUnitAvg({
    startDate,
    endDate,
    businessUnit,
  }: IQueryArguments): Promise<number | null> {
    const conn = await this.db.getConnection()
    // TODO: replace raw with ORM
    const data = await conn.raw(
      `
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
      [businessUnit, startDate, endDate],
    )
    const dataPath = ['0', '0', 'businessUnitAvg']
    return R.hasPath(dataPath, data) ? R.path(dataPath, data) : null
  }

  public async findTopBrands(
    { staffId, startDate, endDate, customerType }: IQueryArguments,
    limit: number = 3,
  ) {
    const conn = await this.db.getConnection()
    const q = conn
      .select('PRODUCT_BIBLE.BRAND as brand')
      .count('PRODUCT_BIBLE.BRAND as count')
      .from('CUSTOMER_SALES')
      .join('PB_INFO', 'PB_INFO.NEO_SKU_ID', 'CUSTOMER_SALES.NEO_SKU_ID')
      .join(
        'PRODUCT_BIBLE',
        'PRODUCT_BIBLE.LC_STYLE_CODE',
        'PB_INFO.LC_STYLE_CODE',
      )
      .join(
        'STAFF_CUSTOMERS',
        'STAFF_CUSTOMERS.STAFF_ID',
        'CUSTOMER_SALES.STAFF_ID',
      )
      .where('CUSTOMER_SALES.TRANS_TYPE', '01')
      .where('CUSTOMER_SALES.ORDER_DATE', '>=', String(startDate))
      .where('CUSTOMER_SALES.ORDER_DATE', '<=', String(endDate))
      .where('CUSTOMER_SALES.STAFF_ID', staffId)
    const qWithCustomerTypes = customerType.includes(CustomerTypeEnum.ALL)
      ? q
      : q.whereIn('STAFF_CUSTOMERS.CUSTOMER_TYPE', customerType)
    const data = await qWithCustomerTypes
      .groupBy('PRODUCT_BIBLE.BRAND')
      .orderBy('count', 'desc')
      .limit(limit)
    return data
  }

  public async findAllClienteleCustomerCount({
    staffId,
  }: IClienteleCustomerCountInput): Promise<IClienteleCustomerCountOutput[]> {
    const conn = await this.db.getConnection()
    const data = await conn
      .count('STAFF_CUSTOMERS.CUSTOMER_VIP_NO as count')
      .from('STAFF_CUSTOMERS')
      .where('STAFF_CUSTOMERS.STAFF_ID', staffId)
    return [
      { count: data[0]['count'], type: CustomerTypeEnum.ALL.toUpperCase() },
    ]
  }

  public async findClienteleCustomerCountByCustomerTypes({
    staffId,
    customerTypes,
  }: IClienteleCustomerCountInput): Promise<IClienteleCustomerCountOutput[]> {
    const conn = await this.db.getConnection()
    const data = await conn
      .count('STAFF_CUSTOMERS.CUSTOMER_VIP_NO as count')
      .select('STAFF_CUSTOMERS.CUSTOMER_TYPE as type')
      .from('STAFF_CUSTOMERS')
      .where('STAFF_CUSTOMERS.STAFF_ID', staffId)
      .groupBy('STAFF_CUSTOMERS.CUSTOMER_TYPE')
    return Array.from(data, (d) => {
      return customerTypes.includes(d.type)
        ? {
            type: d.type.toUpperCase(),
            count: d.count,
          }
        : undefined
    }).filter((d) => d !== undefined)
  }

  public async findAllClienteleCustomerCountByBusinessUnit({
    businessUnit,
  }: IClienteleCustomerCountByBusinessUnitInput): Promise<
    IClienteleCustomerCountOutput[]
  > {
    const conn = await this.db.getConnection()
    const data = await conn
      .count('STAFF_CUSTOMERS.STAFF_ID as count')
      .from('STAFF_CUSTOMERS')
      .join('ELLC_USERS', 'ELLC_USERS.staff_id', 'STAFF_CUSTOMERS.STAFF_ID')
      .join('ELLC_USER_PROFILES', 'ELLC_USERS.ID', 'ELLC_USER_PROFILES.user_id')
      .where('ELLC_USER_PROFILES.business_unit', businessUnit)
    return [
      { count: data[0]['count'], type: CustomerTypeEnum.ALL.toUpperCase() },
    ]
  }

  public async findClienteleCustomerCountByBusinessUnitAndCustomerTypes({
    businessUnit,
    customerTypes,
  }: IClienteleCustomerCountByBusinessUnitInput): Promise<
    IClienteleCustomerCountOutput[]
  > {
    const conn = await this.db.getConnection()
    const data = await conn
      .count('STAFF_CUSTOMERS.CUSTOMER_VIP_NO as count')
      .select('STAFF_CUSTOMERS.CUSTOMER_TYPE as type')
      .from('STAFF_CUSTOMERS')
      .join('ELLC_USERS', 'ELLC_USERS.staff_id', 'STAFF_CUSTOMERS.STAFF_ID')
      .join('ELLC_USER_PROFILES', 'ELLC_USERS.ID', 'ELLC_USER_PROFILES.user_id')
      .where('ELLC_USER_PROFILES.business_unit', businessUnit)
      .groupBy('STAFF_CUSTOMERS.CUSTOMER_TYPE')
    return Array.from(data, (d) => {
      return customerTypes.includes(d.type)
        ? {
            type: d.type.toUpperCase(),
            count: d.count,
          }
        : undefined
    }).filter((d) => d !== undefined)
  }

  public async findBusinessUnitCustomerReachCount({
    startDate,
    endDate,
    customerType,
    businessUnit,
  }: IQueryArguments): Promise<number | null> {
    const conn = await this.db.getConnection()
    const q = conn
      .countDistinct(
        'STAFF_CUSTOMER_INTERACTIONS.CUSTOMER_VIP_NO as customerCount',
      )
      .from('STAFF_CUSTOMER_INTERACTIONS')
      .join(
        'STAFF_CUSTOMERS',
        'STAFF_CUSTOMERS.CUSTOMER_VIP_NO',
        'STAFF_CUSTOMER_INTERACTIONS.CUSTOMER_VIP_NO',
      )
      .join(
        'ELLC_USERS',
        'ELLC_USERS.staff_id',
        'STAFF_CUSTOMER_INTERACTIONS.STAFF_ID',
      )
      .join('ELLC_USER_PROFILES', 'ELLC_USER_PROFILES.user_id', 'ELLC_USERS.id')
      .where('STAFF_CUSTOMER_INTERACTIONS.INTERACTED_AT', '>=', startDate)
      .where('STAFF_CUSTOMER_INTERACTIONS.INTERACTED_AT', '<=', endDate)
      .whereIn('ELLC_USER_PROFILES.business_unit', [businessUnit])
    const qWithCustomerTypes = customerType.includes(CustomerTypeEnum.ALL)
      ? q
      : q.whereIn('STAFF_CUSTOMERS.CUSTOMER_TYPE', customerType)
    const data = await qWithCustomerTypes
    const dataPath = ['0', 'customerCount']
    return R.hasPath(dataPath, data) ? R.path(dataPath, data) : null
  }

  public async findBusinessUnitCustomerReturnCount({
    startDate,
    endDate,
    customerType,
    businessUnit,
  }: IQueryArguments): Promise<number | null> {
    if (businessUnit === null || businessUnit === undefined) {
      return undefined
    }
    const conn = await this.db.getConnection()
    const subquery = conn
      .countDistinct('CUSTOMER_SALES.VIP_NO as customerCount')
      .from('CUSTOMER_SALES')
      .join(
        'STAFF_CUSTOMERS',
        'STAFF_CUSTOMERS.CUSTOMER_VIP_NO',
        'CUSTOMER_SALES.VIP_NO',
      )
      .join('ELLC_USERS', 'ELLC_USERS.staff_id', 'STAFF_CUSTOMERS.STAFF_ID')
      .join('ELLC_USER_PROFILES', 'ELLC_USER_PROFILES.user_id', 'ELLC_USERS.id')
      .where('CUSTOMER_SALES.ORDER_DATE', '>=', startDate)
      .where('CUSTOMER_SALES.ORDER_DATE', '<=', endDate)
      .whereIn('ELLC_USER_PROFILES.business_unit', [businessUnit])
    const subqueryWithCustomerTypes = customerType.includes(
      CustomerTypeEnum.ALL,
    )
      ? subquery
      : subquery.whereIn('STAFF_CUSTOMERS.CUSTOMER_TYPE', customerType)
    const data = await subqueryWithCustomerTypes
    const dataPath = ['0', 'customerCount']
    return R.hasPath(dataPath, data) ? R.path(dataPath, data) : null
  }

  public async findClienteleTestDataByStaffId(
    staffID: string,
    startDate: string,
    endDate: string,
  ): Promise<ITestDataFields[]> {
    const conn = await this.db.getConnection()
    const data = await conn.raw(`
      SELECT 
        * 
      FROM test_metrics tm  
      WHERE tm.queryName = 'clientelingPerformanceMetricsData'
      AND tm.staffID = '${staffID}'
      AND tm.startDate >= '${startDate}'
      AND tm.endDate <= '${endDate}'
    `)
    const dataPath = ['0']
    return R.hasPath(dataPath, data) ? R.path(dataPath, data) : null
  }

  public async findTestCustomerCountsByStaffId(
    staffID: string
  ): Promise<ITestDataFields[]> {
    const conn = await this.db.getConnection()
    const data = await conn.raw(`
      SELECT 
        * 
      FROM test_metrics tm  
      WHERE tm.queryName = 'customerCounts'
      AND tm.staffID = '${staffID}'
    `)
    const dataPath = ['0']
    return R.hasPath(dataPath, data) ? R.path(dataPath, data) : null
  }

  public async findTestBusinessUnitCustomerCountsByStaffId(
    staffID: string
  ): Promise<ITestDataFields[]> {
    const conn = await this.db.getConnection()
    const data = await conn.raw(`
      SELECT 
        * 
      FROM test_metrics tm  
      WHERE tm.queryName = 'businessUnitCustomerCounts'
      AND tm.staffID = '${staffID}'
    `)
    const dataPath = ['0']
    return R.hasPath(dataPath, data) ? R.path(dataPath, data) : null
  }
}
