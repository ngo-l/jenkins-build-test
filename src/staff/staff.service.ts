import { Injectable } from '@nestjs/common'
import { formatId } from '../common/utils/staff.id'
import { ICSVStaffCustomer } from '../common/interfaces/csv.columns.interfaces'
import { IStaffCustomer } from '../common/interfaces/database.columns.interfaces'
import { StaffRepository } from './staff.repository'

@Injectable()
export class StaffService {
  constructor(private staffRepository: StaffRepository) {}

  public async assignStaffData(jsonArray: object[]) {
    const data = jsonArray.map(
      ({
        CUSTOMER_VIP_NO: customerVipNo,
        STAFF_ID: staffId,
        CUSTOMER_TYPE: customerType,
      }: ICSVStaffCustomer) => {
        // format the staff ids
        const formattedStaffId = formatId(String(staffId))
        // filter out all the undefined data
        if (
          formattedStaffId !== undefined &&
          customerVipNo !== undefined &&
          customerType !== undefined
        ) {
          return {
            CUSTOMER_VIP_NO: customerVipNo,
            STAFF_ID: formattedStaffId,
            CUSTOMER_TYPE: customerType,
          }
        }
      },
    )
    // return defined data
    return data.filter((d) => d != undefined)
  }

  public async truncateReplaceIntoStaffTable(data: IStaffCustomer[]) {
    await this.staffRepository.truncate('STAFF_CUSTOMERS')
    await this.staffRepository.replaceInto(
      'STAFF_CUSTOMERS',
      data.filter(Boolean),
      ['CUSTOMER_VIP_NO', 'STAFF_ID', 'CUSTOMER_TYPE'],
    )
  }
}
