import { ISpreadSheetStoreManager, ISpreadSheetStoreManagerManager } from "../common/interfaces/spreadsheet.columns.interfaces"
import { formatId } from "../common/utils/staff.id"

class StoremanagerService {

    constructor() {}

  public async assignStoreManagerdata(jsonArray: object[]) {
    const storeManagerdata = jsonArray.map(({ 
        STOREMANAGER_STAFF_ID: storemanagerStaffId, 
        STOREMANAGER_NAME: storemanagerName 
    }: ISpreadSheetStoreManager) => {
        const formattedStoremanagerStaffId = formatId(String(storemanagerStaffId))
        if (formattedStoremanagerStaffId !== undefined && storemanagerName !== undefined) {
            return { STAFF_ID: formattedStoremanagerStaffId, NAME: storemanagerName }
        }
    })
    return storeManagerdata.filter(data => data != undefined)
  } 

  public async assignStoreManagerManagerData(jsonArray: object[]) {
    const storeManagerManagerData = jsonArray.map(({ 
        STOREMANAGER_STAFF_ID: storemanagerStaffId, 
        MANAGER_STAFF_ID: managerStaffId
    }: ISpreadSheetStoreManagerManager) => { 
        const formattedStoremanagerStaffId = formatId(String(storemanagerStaffId))
        const formattedManagerStaffId = formatId(String(managerStaffId))
        if (formattedStoremanagerStaffId !== undefined && formattedManagerStaffId !== undefined) {
            return { STOREMANAGER_STAFF_ID: formattedStoremanagerStaffId, MANAGER_STAFF_ID: formattedManagerStaffId }
        }
    })
    return storeManagerManagerData.filter(data => data != undefined)
  }  
}


export const storemanagerService = new StoremanagerService()
