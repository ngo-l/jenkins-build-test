import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import { useRouter } from 'next/router'

import ClienteleAssignmentViewPage from '../[scheduledId].page'

describe('clienteleAssignmentViewPage', () => {
  it('should render page without error', () => {
    render(
      <ClienteleAssignmentViewPage />
    )

    waitFor(() => {
      expect(screen.getByTestId('clienteleAssignmentViewPage')).toBeInTheDocument()
      expect(screen.getByTestId('clienteleAssignmentTitle')).toBeInTheDocument()
      expect(screen.getByTestId('elsieFileUploaderInput')).toBeInTheDocument()
      expect(screen.getByTestId('elsieDateSelectorInput')).toBeInTheDocument()
    })
    expect(axios.get).toBeCalledTimes(1)
  })

  test('shows details when details button is clicked', () => {
    render(
      <ClienteleAssignmentViewPage />
    )

    const ToggleMenuBtn = screen.getByTestId('clienteleAssignmentDetailsBtn')
    waitFor(async () => {
      await userEvent.click(ToggleMenuBtn)
      expect(screen.getByTestId('clienteleAssignmentScheduleDetails')).toBeInTheDocument()
    })
  })

  it('should hide details by default', () => {
    render(
      <ClienteleAssignmentViewPage />
    )

    waitFor(() => {
      expect(screen.getByTestId('clienteleAssignmentDetailsBtn')).toBeNull()
      expect(screen.queryByTestId('clienteleAssignmentScheduleDetails')).toBeNull()
    })
  })

  it('calls handleDiscard when back button is clicked', () => {
    render(
      <ClienteleAssignmentViewPage />
    )

    waitFor(async () => {
      await userEvent.click(screen.getByTestId('backBtn'))
      expect(useRouter().push).toBeCalledTimes(1)
    })
  })
})
