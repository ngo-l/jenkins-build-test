import axios from 'axios'
import { config } from '../../config'

export async function getClienteleAssignmentAttachedFile(data, handleError) {
  try {
    axios.get({
      url: `${config.ELSIE_ADMIN_SERVER_URL}/clienteleAssignment/attachedFile`,
      params: data,
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'file.pdf')
      document.body.appendChild(link)
      link.click()
    })
  } catch (err) {
    if (axios.isCancel(err)) {
      return
    }
    throw err
  }
}

export async function getClienteleAssignmentReviewFile(data, handleError) {
  try {
    axios.get({
      url: `${config.ELSIE_ADMIN_SERVER_URL}/clienteleAssignment/reviewFile`,
      params: data,
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'file.pdf')
      document.body.appendChild(link)
      link.click()
    })
  } catch (err) {
    if (axios.isCancel(err)) {
      return
    }
    throw err
  }
}
