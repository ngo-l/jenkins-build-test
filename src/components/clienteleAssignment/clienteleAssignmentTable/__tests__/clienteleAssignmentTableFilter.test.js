import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ClienteleAssignmentTableFilter } from '../clienteleAssignmentTableFilter'

describe('clienteleAssignmentTableFilter', () => {
  it('should render component without error', async () => {
    const handleFilter = jest.fn()

    render(
      <ClienteleAssignmentTableFilter selectedList={{}} handleFilter={handleFilter} />
    )

    expect(screen.getByTestId('clienteleAssignmentTableFilter')).toBeInTheDocument()
    const ToggleMenuBtn = screen.getByTestId('toggleFilterMenuBtn')
    await userEvent.click(ToggleMenuBtn)

    expect(screen.getByTestId('clienteleAssignmentTableFilterMenu')).toBeInTheDocument()
    expect(screen.getByTestId('pendingTab')).toBeInTheDocument()
    expect(screen.getByTestId('scheduledTab')).toBeInTheDocument()
    expect(screen.getByTestId('completedTab')).toBeInTheDocument()
    expect(screen.getByTestId('errorTab')).toBeInTheDocument()

    await userEvent.click(screen.getByTestId('pendingTab'))
    expect(handleFilter).toHaveBeenCalledTimes(1)
    expect(screen.queryByTestId('clienteleAssignmentTableFilterMenu')).not.toBeInTheDocument()
  })
})
