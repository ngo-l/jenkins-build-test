import { Backgrounds } from "../../styleGuides"

export const ElsieNavigationBarStyles = {
  elsieNavigationBar: {
    padding: '8px 0',
    borderRadius: '0px 8px 8px 0px',
    boxShadow: '5px 10px 40px rgba(15, 17, 12, 0.1)',
  },
  elsieLogo: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '8px 22px 8px 20px',
  },
  elsieNavigationBarContent: {
    height: '100%'
  },
  navigationItemList: {
    padding: '8px 13px 8px 13px',
  },
  navigationItem: {
    minHeight: 48,
    '&:hover': {
      ...Backgrounds.elsieAdmin.primary.lightHover,
      borderRadius: '4px',
    },
  },
}
