import { staffService } from '../staff.service'

describe('staffService.assignStaffData', () => {
    
    it('should return an empty array', async () => {
        const data = [{
            CUSTOMER_VIP_NO: '123', 
            STAFF_ID: undefined,
            STATUS: undefined,
            CUSTOMER_TYPE: undefined
        }]
        const output = await staffService.assignStaffData(data)
        expect(output).toEqual([])

        const data2 = [{
            CUSTOMER_VIP_NO: undefined, 
            STAFF_ID: '123',
            STATUS: undefined,
            CUSTOMER_TYPE: undefined
        }]
        const output2 = await staffService.assignStaffData(data2)
        expect(output2).toEqual([])

        const data3 = [{
            CUSTOMER_VIP_NO: undefined, 
            STAFF_ID: undefined,
            STATUS: 'Active',
            CUSTOMER_TYPE: undefined
        }]
        const output3 = await staffService.assignStaffData(data3)
        expect(output3).toEqual([])

        const data4 = [{
            CUSTOMER_VIP_NO: undefined, 
            STAFF_ID: undefined,
            STATUS: undefined,
            CUSTOMER_TYPE: 'Core'
        }]
        const output4 = await staffService.assignStaffData(data4)
        expect(output4).toEqual([])
    })

    it('should return an array containing the formatted ids', async () => {
        const data1 = [{
            CUSTOMER_VIP_NO: 'CUSTOMER_VIP_NO', 
            STAFF_ID: '12',
            STATUS: 'Active',
            CUSTOMER_TYPE: 'Core'
        }]
        const mockResult1 = {
            CUSTOMER_VIP_NO: 'CUSTOMER_VIP_NO', 
            STAFF_ID: '000012',
            STATUS: 'Active',
            CUSTOMER_TYPE: 'Core'
        }
        const output1 = await staffService.assignStaffData(data1)
        expect(output1[0]).toEqual(expect.objectContaining(mockResult1))

        const data2 = [
            {
                CUSTOMER_VIP_NO: 'CUSTOMER_VIP_NO', 
                STAFF_ID: '9912',
                STATUS: 'Active',
                CUSTOMER_TYPE: 'Core'
            },
            {
                CUSTOMER_VIP_NO: 'CUSTOMER_VIP_NO', 
                STAFF_ID: undefined,
                STATUS: 'Active',
                CUSTOMER_TYPE: 'Core'
            }
        ]
        const mockResult2 = [
            {
                CUSTOMER_VIP_NO: 'CUSTOMER_VIP_NO', 
                STAFF_ID: '009912',
                STATUS: 'Active',
                CUSTOMER_TYPE: 'Core'
            }
        ]
        const output2 = await staffService.assignStaffData(data2)
        expect(output2.length).toBe(1)
        expect(output2).toEqual(mockResult2)
    })
})
