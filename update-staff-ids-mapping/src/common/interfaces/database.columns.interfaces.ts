export interface IStaffCustomer {
    CUSTOMER_VIP_NO: string
    STAFF_ID: string
    STATUS: string
    CUSTOMER_TYPE: string
}

export interface IManagerSupervisor {
    SUPERVISOR_STAFF_ID: string
    MANAGER_STAFF_ID: string
}

export interface IManager {
    STAFF_ID: string
    NAME: string
}

export interface IStoreManager {
    STAFF_ID: string
    NAME: string
}

export interface IStoreManagerManager {
    STOREMANAGER_STAFF_ID: string
    MANAGER_STAFF_ID: string
}

export interface ISupervisorStaff {
    SUPERVISOR_STAFF_ID: string
    STAFF_ID: string
}

export interface ISupervisor {
    STAFF_ID: string
    NAME: string
}
