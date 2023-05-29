import { read, utils } from 'xlsx'
import { IRawRecord } from '../interfaces/csv.columns.interfaces'

// reads a buffer object returns an array of JSON objects converted from the csv
export const bufferToJSONArray = (buffer: Buffer): IRawRecord[] => {
  const workbook = read(buffer, { type: 'buffer' })
  // reads sheet[0] as csv only have one sheet
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  // return a JSON
  return utils.sheet_to_json(sheet)
}
