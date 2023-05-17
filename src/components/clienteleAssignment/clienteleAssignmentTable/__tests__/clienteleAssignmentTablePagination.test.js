import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ClienteleAssignmentTablePagination } from '../clienteleAssignmentTablePagination'

describe('clienteleAssignmentTablePagination', () => {
  it('should render component without error', async () => {
    const handlePageChange = jest.fn()
    const handleRowsPageChange = jest.fn()

    render(
      <ClienteleAssignmentTablePagination
        component='div'
        count={100}
        page={0}
        rowsPerPage={10}
        rowsPerPageOptions={[10, 50, 100]}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPageChange}
      />
    )
    expect(screen.getByTestId('clienteleAssignmentTablePagination')).toBeInTheDocument()
    expect(screen.getByTestId('clienteleAssignmentTablePaginationFirstPageBtn')).toHaveProperty('disabled')
    expect(screen.getByTestId('clienteleAssignmentTablePaginationPreviousPageBtn')).toHaveProperty('disabled')
 
    await userEvent.click(screen.getByTestId('clienteleAssignmentTablePaginationNextPageBtn'))
    expect(handlePageChange).toHaveBeenCalledTimes(1)
    await userEvent.click(screen.getByTestId('clienteleAssignmentTablePaginationLastPageBtn'))
    expect(handlePageChange).toHaveBeenCalledTimes(2)
    const select = screen.getByLabelText('10')
    await userEvent.click(select)
    const option = screen.getByRole('option', { name: '50' })
    await userEvent.click(option)
    expect(handleRowsPageChange).toHaveBeenCalledTimes(1)
  })
})
