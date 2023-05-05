import { FileObjectInterface } from './uploadInterfaces'
import { bufferToJSON, convertToCsvStr, csvToForm } from '../shared/utils'
import { config } from '../shared/config'
import axios from 'axios'
import * as FormData from 'form-data'

export const sendCsvFormDataToEliseServer = async (formData: FormData) => {
  if (config.elsie_server_url === undefined || config.elsie_server_url === null) {
    throw new Error(`environment variable: ELISE_SERVER_URL must neither be null nor undefined.`)
  }
  const res = await axios.post(
    config.elsie_server_url, formData.getBuffer(), {
      headers: {
        ...formData.getHeaders()
       }
    }
  )
  return res
}
export const getCSVFormFromFileWithBuffer = async (file: FileObjectInterface)=> {
  // transform the buffer to json
  const data: object[] = await bufferToJSON(file.data.buffer)
  // convert the array of objects to a csv file
  const csvStr: string = await convertToCsvStr(data)
  const formData = await csvToForm(csvStr)
  return formData
}
