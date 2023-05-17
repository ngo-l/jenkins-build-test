import axios from 'axios'
import { config } from '../../config'

export async function getClienteleAssignmentList(params, signal) {
  try {
    const { data } = await axios.get(`${config.ELSIE_ADMIN_SERVER_URL}/clienteleAssignments`, { signal, params })
    return data
  } catch (err) {
    throw err
  }
} 
