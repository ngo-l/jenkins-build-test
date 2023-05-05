import { Parse } from 'parse-multipart'
import { read, utils } from 'xlsx'
import { FileObjectInterface } from '../interfaces/file.interfaces'

export const parseBufferWithBoundary = (body: object, boundary: string) => {
    return Parse(Buffer.from(body), boundary)
}

export const requestBodyToBuffer = (body: object, contentType: string): Buffer => {    
    if (contentType.split(';').length <= 1) {
        throw new Error(`the contentType should be multipart/form-data with boundary.`)
    }
    const files = parseBufferWithBoundary(body, contentType.split('boundary=')[1])
    if (files.length !== 1) {
        throw new Error('You must have exactly one file')
    }
    const { data: { buffer } }: FileObjectInterface = Object(files[0])
    return buffer
}

export const bufferToJSONArray = (buffer: Buffer): object[] => {
    const workbook = read(buffer, { 'type': 'buffer' })
    if (workbook.SheetNames.length !== 1 ) {
        throw new Error('You must have exactly one sheet')
    }
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    return utils.sheet_to_json(firstSheet)
}
