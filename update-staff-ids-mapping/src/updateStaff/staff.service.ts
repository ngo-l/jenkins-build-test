import { ISpreadSheetStaffCustomer } from "../common/interfaces/spreadsheet.columns.interfaces"
import { formatId } from "../common/utils/staff.id"

class StaffService {
  constructor() {}

  public async assignStaffData(jsonArray: object[]) {
    const data = jsonArray.map(({ CUSTOMER_VIP_NO: customerVipNo, STAFF_ID: staffId, STATUS: status, CUSTOMER_TYPE: customerType}: ISpreadSheetStaffCustomer) => {
        const formattedStaffId = formatId(String(staffId))
        if ( formattedStaffId !== undefined && customerVipNo !== undefined && status !== undefined && customerType !== undefined) {
            return { CUSTOMER_VIP_NO: customerVipNo, STAFF_ID: formattedStaffId, STATUS: status, CUSTOMER_TYPE: customerType }
        }
    })

    return data.filter(d => d != undefined)
  }
}

export const staffService = new StaffService()
