import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import { ClienteleAssignmentTableHeader } from '../clienteleAssignmentTableHeader'

describe('clienteleAssignmentTableHeader', () => {
  it('should render page without error', () => {
    render(
      <table>
        <ClienteleAssignmentTableHeader />
      </table>
    )
    expect(screen.getByTestId('clienteleAssignmentTableHeader')).toBeInTheDocument()
    expect(screen.getByTestId('headCelluserId')).toHaveTextContent('userId')
    expect(screen.getByTestId('headCellfileName')).toHaveTextContent('fileName')
    expect(screen.getByTestId('headCellstatus')).toHaveTextContent('status')
    expect(screen.getByTestId('headCellscheduledAt')).toHaveTextContent('scheduledAt')
    expect(screen.getByTestId('headCellcreatedBy')).toHaveTextContent('createdBy')
  })
})
