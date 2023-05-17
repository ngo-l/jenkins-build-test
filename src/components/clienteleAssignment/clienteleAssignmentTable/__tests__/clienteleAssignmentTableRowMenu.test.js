import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ClienteleAssignmentTableRowMenu } from '../clienteleAssignmentTableRowMenu'

const TEST_ID = 1

describe('clienteleAssignmentTableRowMenu', () => {
  it('should render component without error', async () => {
    const handleDownload = jest.fn()
    const handleReview = jest.fn()
    const handleConfirm = jest.fn()

    render(
      <ClienteleAssignmentTableRowMenu id={TEST_ID} handleDownload={handleDownload} handleReview={handleReview} handleConfirm={handleConfirm} />
    )
    const ToggleMenuBtn=screen.getByTestId(`toggleRowMenuBtn${TEST_ID}`)
    await userEvent.click(ToggleMenuBtn)
    const Menu=screen.getByTestId(`clienteleAssignmentTableRowMenu${TEST_ID}`)

    expect(Menu).toBeInTheDocument()
    await userEvent.click(screen.getByTestId(`downloadBtn${TEST_ID}`))
    expect(handleDownload).toHaveBeenCalledTimes(1)

    await userEvent.click(ToggleMenuBtn)
    await userEvent.click(screen.getByTestId(`reviewBtn${TEST_ID}`))
    expect(handleReview).toHaveBeenCalledTimes(1)
    
    await userEvent.click(ToggleMenuBtn)
    await userEvent.click(screen.getByTestId(`confirmScheduleBtn${TEST_ID}`))
    expect(handleConfirm).toHaveBeenCalledTimes(1)
  })
})
