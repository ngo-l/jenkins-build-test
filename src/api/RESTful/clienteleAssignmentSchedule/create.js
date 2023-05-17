import axios from 'axios'
import { config } from '../../../config'

export async function createClienteleAssignmentSchedule(data) {
  try {
    const { data } = await axios.post(`${config.ELSIE_ADMIN_SERVER_URL}/clienteleAssignment/addSchedule`, data)
    return data
  } catch (err) {
    throw err
  }
}

export async function uploadFileCSV(formData) {
  try {
    axios({
      url: `${config.ELSIE_ADMIN_SERVER_URL}/clienteleAssignment/uploadClienteleAssignmentFile`,
      method: 'post',
      formData,
    }).then(({ data }) => {
      return data
    })
  } catch (err) {
    throw err
  }
}
