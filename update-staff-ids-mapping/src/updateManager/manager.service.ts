import { ISpreadSheetManager, ISpreadSheetManagerSupervisor } from "../common/interfaces/spreadsheet.columns.interfaces"
import { formatId } from "../common/utils/staff.id"

class ManagerService {

    constructor() {}

    public async assignManagerData(jsonArray: object[]){
        const managerData = jsonArray.map(({ MANAGER_STAFF_ID: managerStaffId, MANAGER_NAME: managerName }: ISpreadSheetManager) => {
            const formattedManagerStaffId = formatId(String(managerStaffId))
            if (formattedManagerStaffId !== undefined && managerName !== undefined) {
                return { STAFF_ID: formattedManagerStaffId, NAME: managerName }
            }
        })
        return managerData.filter(data => data != undefined)
    }

    public async assignSupervisorManagerData(jsonArray: object[]) {
        const supervisorManagerData = jsonArray.map(({ MANAGER_STAFF_ID: managerStaffId, SUPERVISOR_STAFF_ID: supervisorStaffId }: ISpreadSheetManagerSupervisor) => { 
            const formattedManagerStaffId = formatId(String(managerStaffId))
            const formattedSupervisorStaffId = formatId(String(supervisorStaffId))
            if ( formattedManagerStaffId !== undefined && formattedSupervisorStaffId !== undefined) {
                return { SUPERVISOR_STAFF_ID: formattedSupervisorStaffId, MANAGER_STAFF_ID: formattedManagerStaffId }
            }
        })
        return supervisorManagerData.filter(data => data != undefined)
    }
}

export const managerService = new ManagerService()
