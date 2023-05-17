import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import { Mainlayout } from '../index'

describe('mainLayout', () => {
  it('should render page with elsieNavigationBar', () => {
    render(
      <Mainlayout >
        Hello
      </Mainlayout>
    )
    expect(screen.getByTestId('mainLayout')).toBeInTheDocument()
    expect(screen.getByTestId('elsieNavigationBar')).toBeInTheDocument()
    expect(screen.getByTestId('mainLayoutContent')).toBeInTheDocument()
  })
})
