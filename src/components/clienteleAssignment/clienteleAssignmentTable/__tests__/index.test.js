import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'

import { ClienteleAssignmentTable } from '../'

describe('clienteleAssignmentTable', () => {
  it('should render page without error', () => {
    waitFor(() => {
      render(
        <ClienteleAssignmentTable />
      )
    })
    expect(screen.getByTestId('clienteleAssignmentTable')).toBeInTheDocument()
    expect(screen.getByTestId('clienteleAssignmentTableFilter')).toBeInTheDocument()
    expect(screen.getByTestId('clienteleAssignmentTableHeader')).toBeInTheDocument()
    expect(screen.getByTestId('clienteleAssignmentTableContent')).toBeInTheDocument()

    waitFor(() => {
      expect(screen.getByTestId('clienteleAssignmentTablePagination')).toBeInTheDocument()
    })
  })
})
