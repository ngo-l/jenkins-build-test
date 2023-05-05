import { managerService } from '../manager.service'

describe('managerService.assignManagerData', () => {
    
    it('should not return any undefined values', async () => {
        const data = [{
            MANAGER_STAFF_ID: '123',
            MANAGER_NAME: undefined
        }]
        const output = await managerService.assignManagerData(data)
        expect(output).not.toContain(undefined)
        expect(output).toEqual([])
    })

    it('should return an array containing the formatted ids', async () => {
        const data = [{
            MANAGER_STAFF_ID: '123',
            MANAGER_NAME: 'hello'
        }]
        const mockResult = {
            STAFF_ID: '000123',
            NAME: 'hello'
        }
        const output = await managerService.assignManagerData(data)
        expect(output[0]).toEqual(expect.objectContaining(mockResult))
    })
})

describe('assignSupervisorManagerData', () => {

    it('should not return any undefined values', async () => {
        const data = [{
            MANAGER_STAFF_ID: '123',
            SUPERVISOR_STAFF_ID: undefined
        }]
        const output = await managerService.assignSupervisorManagerData(data)
        expect(output).not.toContain(undefined)
        expect(output).toEqual([])
    })
    
    it('should return an array containing the formatted ids', async () => {
        const data = [{
            MANAGER_STAFF_ID: '123',
            SUPERVISOR_STAFF_ID: '123'
        }]
        const mockResult = {
            MANAGER_STAFF_ID: '000123',
            SUPERVISOR_STAFF_ID: '000123'
        }
        const output = await managerService.assignSupervisorManagerData(data)
        expect(output[0]).toEqual(expect.objectContaining(mockResult))
    })
})
