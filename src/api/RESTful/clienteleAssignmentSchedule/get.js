import axios from 'axios'
import { config } from '../../../config'

export async function getClienteleAssignmentSchedule(params, signal, handleError) {
  try {
    const { data } = await axios.get(`${config.ELSIE_ADMIN_SERVER_URL}/clienteleAssignmentSchedule`, { params, signal })

    return data
  } catch (err) {
    if (axios.isCancel(err)) {
      return null
    }
    handleError(new Error('Unknown Error'))
  }
}
