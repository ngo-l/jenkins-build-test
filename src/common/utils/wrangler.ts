import { IRawRecord } from '../interfaces/csv.columns.interfaces'

export const renameXlsxColumnName = (jsonArray: IRawRecord[]) => {
  return jsonArray.map(({ vip_no, SA_Staff_No, cust_type }: IRawRecord) => {
    return {
      CUSTOMER_VIP_NO: vip_no,
      STAFF_ID: SA_Staff_No,
      CUSTOMER_TYPE: cust_type,
    }
  })
}
