import { storemanagerService } from '../storemanager.service'

describe('storemanagerService.assignStoreManagerdata', () => {
    
    it('should return an empty array', async () => {
        const data1 = [{
            STOREMANAGER_STAFF_ID: undefined, 
            STOREMANAGER_NAME: 'XYZ' 
        }]
        const output1 = await storemanagerService.assignStoreManagerdata(data1)
        expect(output1).toEqual([])

        const data2 = [{
            STOREMANAGER_STAFF_ID: 'XYZ', 
            STOREMANAGER_NAME: undefined 
        }]
        const output2 = await storemanagerService.assignStoreManagerdata(data2)
        expect(output2).toEqual([])
    })

    it('should return an array containing the formatted ids', async () => {
        const data1 = [{
            STOREMANAGER_STAFF_ID: '123', 
            STOREMANAGER_NAME: 'XYZ' 
        }]
        const mockResult1 = {
            STAFF_ID: '000123',
            NAME: 'XYZ' 
        }
        const output1 = await storemanagerService.assignStoreManagerdata(data1)
        expect(output1[0]).toEqual(expect.objectContaining(mockResult1))

        const data2 = [
            {
                STOREMANAGER_STAFF_ID: '123', 
                STOREMANAGER_NAME: 'XYZ' 
            },
            {
                STOREMANAGER_STAFF_ID: '123', 
                STOREMANAGER_NAME: undefined 
            }
        ]
        const mockResult2 = [
            {
                STAFF_ID: '000123',
                NAME: 'XYZ' 
            }
        ]
        const output2 = await storemanagerService.assignStoreManagerdata(data2)
        expect(output2.length).toBe(1)
        expect(output2).toEqual(mockResult2)
    })
})

describe('storemanagerService.assignStoreManagerManagerData', () => {
    
    it('should return an empty array', async () => {
        const data1 = [{
            STOREMANAGER_STAFF_ID: '123', 
            MANAGER_STAFF_ID: undefined
        }]
        const output1 = await storemanagerService.assignStoreManagerManagerData(data1)
        expect(output1).toEqual([])

        const data2 = [{
            STOREMANAGER_STAFF_ID: undefined,
            MANAGER_STAFF_ID: '123'
        }]
        const output2 = await storemanagerService.assignStoreManagerManagerData(data2)
        expect(output2).toEqual([])
    })

    it('should return an array containing the formatted ids', async () => {
        const data1 = [{
            STOREMANAGER_STAFF_ID: '123', 
            MANAGER_STAFF_ID: '123'
        }]
        const mockResult1 = {
            STOREMANAGER_STAFF_ID: '000123', 
            MANAGER_STAFF_ID: '000123'
        }
        const output1 = await storemanagerService.assignStoreManagerManagerData(data1)
        expect(output1[0]).toEqual(expect.objectContaining(mockResult1))

        const data2 = [
            {
                STOREMANAGER_STAFF_ID: '123', 
                MANAGER_STAFF_ID: '123'
            },
            {
                STOREMANAGER_STAFF_ID: '123', 
                MANAGER_STAFF_ID: undefined
            }
        ]
        const mockResult2 = [
            {
                STOREMANAGER_STAFF_ID: '000123', 
                MANAGER_STAFF_ID: '000123'
            }
        ]
        const output2 = await storemanagerService.assignStoreManagerManagerData(data2)
        expect(output2.length).toBe(1)
        expect(output2).toEqual(mockResult2)
    })
})
