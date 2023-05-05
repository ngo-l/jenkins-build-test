import * as XLSX from 'xlsx'
import { Readable } from 'stream'
import * as FormData from 'form-data'
import { HttpResponse, HttpResponseInput} from '../shared/interfaces'

export const isXlsx = (filename: string) => filename.endsWith('.xlsx')

export const isFormData = (contentType: string | undefined) : Boolean => {
  if (contentType){
    return contentType.split(';')[0] === 'multipart/form-data' ? true : false
  }
  return false
}

export const bufferToJSON = async (buffer: Buffer) : Promise<object[]> => {
  const workbook = XLSX.read(buffer, {'type': 'buffer'})
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
  return XLSX.utils.sheet_to_json(firstSheet)
}

export const convertToCsvStr = async (arr: object[]) : Promise<string> => {
  const columns = Object.keys(arr[0]).join(',') + '\n'
  const data = arr.map(it => Object.values(it).toString()).join('\n')
  return columns + data
}

export const csvToForm = async (str: string) => {
  const buff = Buffer.from(str, "utf-8");
  const readableStream = new Readable()
  readableStream.push(buff)
  readableStream.push(null)
  const formData = new FormData()
  formData.append("file", buff, {contentType: 'multipart/form-data', filename: "test.csv"})
  return formData
}

export const Response = (responseObj: HttpResponseInput): HttpResponse => {
  const { headers, status, body, isRaw } = responseObj
  return {
    headers: headers ? headers : {'Content-Type': 'application/json'},
    status: status ? status: 200,
    body: body,
    isRaw: isRaw ? isRaw : true
  }
}
