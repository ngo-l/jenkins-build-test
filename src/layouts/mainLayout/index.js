import { ElsieNavigationBar } from '../../components/_common'

export const Mainlayout = ({ children }) => {
  return (
    <div data-testid='mainLayout'>
      <ElsieNavigationBar />
      <div data-testid='mainLayoutContent'>
        {children}
      </div>
    </div>
  )
}
