import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import HomePage from '../index.page'

describe('homePage', () => {
  it('should render page without error', () => {
    render(
      <HomePage />
    )

    expect(screen.getByTestId('homePage')).toBeInTheDocument()
    expect(screen.getByTestId('homePageIcon')).toBeInTheDocument()
    expect(screen.getByTestId('homePageIntro')).toBeInTheDocument()
  })
})
