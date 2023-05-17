import React, { useContext, useState, createContext } from 'react'
import { formatISO, set } from 'date-fns'

import { uploadFileCSV, createClienteleAssignmentSchedule } from '../api/RESTful'

//Todo add useSchedule hook (downloadFile,validateFile)
const scheduleContext = createContext()

function useProvideSchedule() {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [selectedTime, setSelectedTime] = useState(set(new Date(), { minutes: 0 }))

  async function uploadScheduleFile() {
    if (!uploadedFile) {
      return
    }

    const formData = new FormData()
    await uploadFileCSV(formData.append('file', uploadedFile))
  }

  async function addSchedule() {
    if (!uploadedFile || !selectedTime) {
      return
    }

    //add elsieSnackBar to show the response 
    try {
      const { name, storagePath } = uploadedFile
      await createClienteleAssignmentSchedule({ name, storagePath, scheduleDate: formatISO(selectedTime) })
    }
    catch (err) {
      throw err
    }
  }

  return { uploadScheduleFile, addSchedule, selectedTime, setSelectedTime, uploadedFile, setUploadedFile }
}

export function ProvideSchedule({ children }) {
  const schedule = useProvideSchedule()

  return <scheduleContext.Provider value={schedule}>{children}</scheduleContext.Provider>
}

export const useSchedule = () => {
  return useContext(scheduleContext)
}
