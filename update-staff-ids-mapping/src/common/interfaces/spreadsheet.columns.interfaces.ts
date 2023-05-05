export interface ISpreadSheetManager {
    MANAGER_STAFF_ID: string
    MANAGER_NAME: string
}

export interface ISpreadSheetSupervisor {
    SUPERVISOR_STAFF_ID: string
    SUPERVISOR_NAME: string
}

export interface ISpreadSheetManagerSupervisor {
    SUPERVISOR_STAFF_ID: string
    MANAGER_STAFF_ID: string
}

export interface ISpreadSheetStaffCustomer {
    CUSTOMER_VIP_NO: string
    STAFF_ID: string
    STATUS: string
    CUSTOMER_TYPE: string
}

export interface ISpreadSheetStoreManagerManager {
    STOREMANAGER_STAFF_ID: string
    MANAGER_STAFF_ID: string
}

export interface ISpreadSheetStoreManager {
    STOREMANAGER_STAFF_ID: string
    STOREMANAGER_NAME: string
}
export interface ISpreadSheetSupervisorStaff {
    SUPERVISOR_STAFF_ID: string
    STAFF_ID: string
}
