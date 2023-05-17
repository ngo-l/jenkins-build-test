import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ElsieDateSelector } from '../'

describe('elsieDateSelector', () => {
  it('should render page without error', async () => {
    const setSelectedTime = jest.fn()

    render(
      <ElsieDateSelector selectedTime={new Date(2022, 4, 10, 16, 30)} setSelectedTime={setSelectedTime} />
    )

    expect(screen.getByTestId('elsieDateSelector')).toBeInTheDocument()
    expect(screen.getByTestId('elsieDateSelectorInputField')).toHaveValue('2022-05-10, 04:30 PM')

    const Input = screen.getByTestId('elsieDateSelectorInput')
    userEvent.click(Input)

    await waitFor(() => {
      expect(screen.getByTestId('elsieDateSelectorMenu')).toBeInTheDocument()
      expect(screen.getByTestId('elsieDateSelectorClearBtn')).toBeInTheDocument()
      expect(screen.getByTestId('elsieDateSelectorCurrentBtn')).toBeInTheDocument()
    })
  })

  it('should clear the selected time when the "Clear" button is clicked', async () => {
    const setSelectedTime = jest.fn()

    render(
      <ElsieDateSelector selectedTime={new Date(2022, 4, 10, 16, 30)} setSelectedTime={setSelectedTime} />
    )
    const Input = screen.getByTestId('elsieDateSelectorInput')
    await userEvent.click(Input)

    const clearButton = screen.getByTestId('elsieDateSelectorClearBtn')
    await userEvent.click(clearButton)
    await waitFor(() => {
      expect(setSelectedTime).toHaveBeenCalledWith(null)
    })
  })

  it('should set the selected time to the current time when the "Now" button is clicked', async () => {
    const setSelectedTime = jest.fn()

    render(
      <ElsieDateSelector selectedTime={new Date(2022, 4, 10, 16, 30)} setSelectedTime={setSelectedTime} />
    )
    const Input = screen.getByTestId('elsieDateSelectorInput')
    await userEvent.click(Input)

    const clearButton = screen.getByTestId('elsieDateSelectorCurrentBtn')
    await userEvent.click(clearButton)
    await waitFor(() => {
      expect(setSelectedTime).toHaveBeenCalledWith(expect.any(Date))
    })
  })
})
