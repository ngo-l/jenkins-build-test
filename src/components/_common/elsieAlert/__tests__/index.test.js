import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import { ElsieAlert } from '../'

describe('elsieAlert', () => {
  it('should render component if isOpen is true', () => {
    render(
      <ElsieAlert isOpen={true} />
    )

    expect(screen.getByTestId('elsieAlertTitle')).toBeInTheDocument()
    expect(screen.getByTestId('elsieAlertContent')).toBeInTheDocument()
    expect(screen.getByTestId('elsieAlertActions')).toBeInTheDocument()
  })

  it('should not render componet if isOpen is false', () => {
    render(
      <ElsieAlert isOpen={false} />
    )

    expect(screen.queryByTestId('elsieAlertTitle')).not.toBeInTheDocument()
    expect(screen.queryByTestId('elsieAlertContent')).not.toBeInTheDocument()
    expect(screen.queryByTestId('elsieAlertActions')).not.toBeInTheDocument()
  })
})
