import { supervisorService } from '../supervisor.service'

describe('supervisorService.assignSupervisorData', () => {
    
    it('should return an empty array', async () => {
        const data1 = [{SUPERVISOR_STAFF_ID: undefined, SUPERVISOR_NAME: 'XYZ'}]
        const output1 = await supervisorService.assignSupervisorData(data1)
        expect(output1).toEqual([])

        const data2 = [{ SUPERVISOR_STAFF_ID: 'XYZ', SUPERVISOR_NAME: undefined }]
        const output2 = await supervisorService.assignSupervisorData(data2)
        expect(output2).toEqual([])
    })

    it('should return an array containing the formatted ids', async () => {
        const data1 = [{SUPERVISOR_STAFF_ID: '123', SUPERVISOR_NAME: 'XYZ'}]
        const mockResult1 = {
            STAFF_ID: '000123',
            NAME: 'XYZ' 
        }
        const output1 = await supervisorService.assignSupervisorData(data1)
        expect(output1[0]).toEqual(expect.objectContaining(mockResult1))

        const data2 = [
            {
                SUPERVISOR_STAFF_ID: '123', 
                SUPERVISOR_NAME: 'XYZ' 
            },
            {
                SUPERVISOR_STAFF_ID: '123', 
                SUPERVISOR_NAME: undefined 
            }
        ]
        const mockResult2 = [{STAFF_ID: '000123', NAME: 'XYZ'}]
        const output2 = await supervisorService.assignSupervisorData(data2)
        expect(output2.length).toBe(1)
        expect(output2).toEqual(mockResult2)
    })
})

describe('supervisorService.assignSupervisorStaffData', () => {
    
    it('should return an empty array', async () => {
        const data1 = [{ SUPERVISOR_STAFF_ID: '123', STAFF_ID: undefined }]

        const output1 = await supervisorService.assignSupervisorStaffData(data1)
        expect(output1).toEqual([])

        const data2 = [{SUPERVISOR_STAFF_ID: undefined, STAFF_ID: '123'}]
        const output2 = await supervisorService.assignSupervisorStaffData(data2)
        expect(output2).toEqual([])
    })

    it('should return an array containing the formatted ids', async () => {
        const data1 = [{ SUPERVISOR_STAFF_ID: '123', STAFF_ID: '123' }]
        const mockResult1 = {SUPERVISOR_STAFF_ID: '000123', STAFF_ID: '000123'}
        const output1 = await supervisorService.assignSupervisorStaffData(data1)
        expect(output1[0]).toEqual(expect.objectContaining(mockResult1))

        const data2 = [
            {
                SUPERVISOR_STAFF_ID: '123', 
                STAFF_ID: '123'
            },
            {
                SUPERVISOR_STAFF_ID: '123', 
                STAFF_ID: undefined
            }
        ]
        const mockResult2 = [
            {
                SUPERVISOR_STAFF_ID: '000123', 
                STAFF_ID: '000123'
            }
        ]
        const output2 = await supervisorService.assignSupervisorStaffData(data2)
        expect(output2.length).toBe(1)
        expect(output2).toEqual(mockResult2)
    })
})
