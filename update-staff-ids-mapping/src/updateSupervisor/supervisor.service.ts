import { ISpreadSheetSupervisor, ISpreadSheetSupervisorStaff } from "../common/interfaces/spreadsheet.columns.interfaces"
import { formatId } from "../common/utils/staff.id"

class SupervisorService {
    
    constructor() {}

    public async assignSupervisorStaffData(jsonArray: object[]) {
        const supervisorStaffData = jsonArray.map(({ SUPERVISOR_STAFF_ID: supervisorStaffId, STAFF_ID: staffId}: ISpreadSheetSupervisorStaff) => { 
            const formattedSupervisorStaffId = formatId(String(supervisorStaffId))
            const formattedStaffId = formatId(String(staffId))
            if (formattedSupervisorStaffId !== undefined && formattedStaffId !== undefined) {
                return { SUPERVISOR_STAFF_ID: formattedSupervisorStaffId, STAFF_ID: formattedStaffId }
            }
        })
        return supervisorStaffData.filter(data => data != undefined)
    }

    public async assignSupervisorData(jsonArray: object[]) {
        const supervisorData = jsonArray.map(({ SUPERVISOR_NAME: supervisorName, SUPERVISOR_STAFF_ID: supervisorStaffId }: ISpreadSheetSupervisor) => {
            const formattedSupervisorStaffId = formatId(String(supervisorStaffId))
            if (formattedSupervisorStaffId !== undefined && supervisorName !== undefined) {
                return { STAFF_ID: formattedSupervisorStaffId, NAME: supervisorName }
            }
        })
        return supervisorData.filter(data => data != undefined)
    }
}

export const supervisorService = new SupervisorService()
