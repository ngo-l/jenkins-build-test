import axios from 'axios'
import { config } from '../../../config'

export async function deleteClienteleAssignmentSchedule(data, handleError) {
  try {
    const { msg } = await axios.post(`${config.ELSIE_ADMIN_SERVER_URL}/clienteleAssignment/addSchedule`, data)
    return msg
  } catch (err) {
    handleError(new Error('Unknown Error'))
  }
}
