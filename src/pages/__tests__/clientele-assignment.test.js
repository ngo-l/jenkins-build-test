import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'

import ClienteleAssignmentPage from '../clientele-assignment.page'

describe('clienteleAssignmentPage', () => {
  it('should render page without error', () => {
    waitFor(()=>{
      render(
        <ClienteleAssignmentPage />
      )
    })

    expect(screen.getByTestId('clienteleAssignmentPage')).toBeInTheDocument()
    expect(screen.getByTestId('clienteleAssignmentTitle')).toBeInTheDocument()
    expect(screen.getByTestId('clienteleAssignmentTable')).toBeInTheDocument()
    expect(screen.getByTestId('downloadAssignmentTemplateBtn')).toBeInTheDocument()
    expect(screen.getByTestId('createClienteleAssignmentScheduleBtn')).toBeInTheDocument()
  })
})
