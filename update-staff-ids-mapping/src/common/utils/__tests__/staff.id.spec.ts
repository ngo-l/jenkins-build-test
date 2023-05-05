import { formatId } from '../staff.id'

describe('Staff ID format', () => {
    it('shoud return undefined if the input is not a series of numbers', () => {
        const input = 'ddadashdaos123122312312zxuaosd'
        expect(formatId(input)).toBe(undefined)
    })

    it('should return undefined if the length of the input > 6', () => {
        const input = '92132131231283'
        expect(formatId(input)).toBe(undefined)
    })
    
    it('should return the input if the input is a series of numbers and its length is 6', () => {
        const input = '777777'
        expect(formatId(input)).toBe(input)
    })

    it('should return the input if the input is a series of numbers and its length is 6', () => {
        const input = '777777'
        expect(formatId(input)).toBe(input)
    })

    it("should return the input starting with one or more than one '0' to make the length of the input to be 6", () => {
        const input = '7'
        expect(formatId(input)).toBe('000007')
    })

})
