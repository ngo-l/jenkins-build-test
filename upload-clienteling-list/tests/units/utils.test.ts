import { isXlsx, isFormData} from '../../src/shared/utils'

describe('isXlsx', () => {
    
    test('return true for string ends with .xlsx', () => {
        const data1 = isXlsx('heeloo.xlsx')
        expect(data1).toBe(true)
    
        const data2 = isXlsx('xyx.xlsx')
        expect(data2).toBe(true)
    })
    
    test('return false for string does not end with .xlsx', () => {
        const data1 = isXlsx('heeloo.xls')
        expect(data1).toBe(false)
    
        const data2 = isXlsx('xyx.abc')
        expect(data2).toBe(false)
    })
})

describe('isFormData', () => {
    
    test("return true for string can be split by ';' and the resulted array is equal to 'multipart/form-data' ", () => {
        const data1 = isFormData('multipart/form-data; boundary=???')
        expect(data1).toBe(true)

        const data2 = isFormData('multipart/form-data; boundary=123456')
        expect(data2).toBe(true)

    })

    test("return false for string cannot be split by ';' and the resulted array is equal to 'multipart/form-data' ", () => {
        const data1 = isFormData('multipart/form')
        expect(data1).toBe(false)

        const data2 = isFormData('multipart/for')
        expect(data2).toBe(false)
    })
})

