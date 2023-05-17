import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ElsieNavigationBar } from '../'

jest.mock('../pathname')

describe('elsieNavigationBar', () => {
  it('should render page with elsieNavigationBar', async () => {
    render(<ElsieNavigationBar />)
    const NavigationBar = screen.getByTestId('elsieNavigationBar')
    expect(NavigationBar).toBeInTheDocument()
    await userEvent.hover(NavigationBar)
    expect(NavigationBar.getElementsByClassName('Mui-selected')).toHaveLength(1)
    expect(screen.getAllByTestId('elsieNavigationItem').length).toBe(2)
    expect(screen.getByRole('button', { name: 'Testing1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Testing2' })).toBeInTheDocument()
    expect(screen.getByTestId('elsieLogoutBtn', { name: 'Back to Portal' })).toBeInTheDocument()
  })

  it('should pop up the menu if mouse hovers on it', async () => {
    render(
      <ElsieNavigationBar />
    )
    const NavigationBar = screen.getByTestId('elsieNavigationBar')
    await userEvent.hover(NavigationBar)
    expect(NavigationBar).toHaveStyle('width:260px')
    await userEvent.unhover(NavigationBar)
    expect(NavigationBar).not.toHaveStyle('width:260px:')
  })
})
