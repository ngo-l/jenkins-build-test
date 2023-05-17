import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import ClienteleAssignmentNewSchedulePage from '../new-schedule.page'
import { ProvideSchedule } from '../../../hook'

describe('clienteleAssignmentNewSchedulePage', () => {
  it('should render page without error', () => {
    render(
      <ProvideSchedule>
        <ClienteleAssignmentNewSchedulePage />
      </ProvideSchedule>
    )

    expect(screen.getByTestId('clienteleAssignmentNewSchedulePage')).toBeInTheDocument()
    expect(screen.getByTestId('clienteleAssignmentTitle')).toBeInTheDocument()
    expect(screen.getByTestId('clienteleAssignmentContent')).toBeInTheDocument()
    // expect(screen.getByTestId('discardClienteleAssignmentScheduleBtn')).toBeInTheDocument()
    expect(screen.getByTestId('saveClienteleAssignmentScheduleBtn')).toBeInTheDocument()
    expect(screen.getByTestId('elsieFileUploader')).toBeInTheDocument()
    // expect(screen.getByTestId('elsieDateSelector')).toBeInTheDocument()
  })
})
