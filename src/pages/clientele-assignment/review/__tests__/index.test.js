import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import { useRouter } from 'next/router'

import ClienteleAssignmentReviewPage from '../[scheduledId].page'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('clienteleAssignmentReviewPage', () => {
  it('should render page without error', () => {
    render(
      <ClienteleAssignmentReviewPage />
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
      <ClienteleAssignmentReviewPage />
    )

    const ToggleMenuBtn = screen.getByTestId('clienteleAssignmentDetailsBtn')
    waitFor(async () => {
      await userEvent.click(ToggleMenuBtn)
      expect(screen.getByTestId('clienteleAssignmentScheduleDetails')).toBeInTheDocument()
    })
  })

  it('should hide details by default', () => {
    render(
      <ClienteleAssignmentReviewPage />
    )

    waitFor(() => {
      expect(screen.getByTestId('clienteleAssignmentDetailsBtn')).toBeNull()
      expect(screen.queryByTestId('clienteleAssignmentScheduleDetails')).toBeNull()
    })
  })

  it('calls handleDiscard when back button is clicked', () => {
    render(
      <ClienteleAssignmentReviewPage />
    )

    waitFor(async () => {
      await userEvent.click(screen.getByTestId('backBtn'))
      expect(useRouter().push).toBeCalledTimes(1)
    })
  })

  it('calls handleConfirm when back button is clicked', async () => {
    render(
      <ClienteleAssignmentReviewPage />
    )

    await userEvent.click(screen.getByTestId('confirmClienteleAssignmentScheduleBtn'))
    expect(axios.post).toBeCalledTimes(1)
  })

  it('calls handleReview when back button is clicked', async () => {
    render(
      <ClienteleAssignmentReviewPage />
    )

    expect(axios.get).toBeCalledTimes(1)
    window.URL.createObjectURL = jest.fn()
    document.createElement = jest.fn(() => ({ href: 'a', setAttribute: jest.fn(), click: jest.fn() }))
    document.body.appendChild = jest.fn()
    await userEvent.click(screen.getByTestId('downloadAssignmentReviewBtn'))
    expect(axios.get).toBeCalledTimes(2)
  })
})
