import { Colors } from '../../styleGuides'

export const ClienteleAssignmentTableFilterStyles = {
  root: {
    padding: '8px'
  },
  toggleMenuBtnIcon: {
    ...Colors.system.black,
  },
  paper: {
    boxShadow: '0 0 10px 1px rgb(34 41 47 / 10%)'
  },
  menuItem: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '12px 25px',
    ':before': {
      content: '"\u2713"',
      display: 'inline-block',
      color: 'transparent',
      padding: '0 10px 0 0',
      backgroundColor: 'transparent !important',
    },
    ':hover': {
      backgroundColor: Colors.elsieAdmin.primary.lightHover.color,
    },
    '&.Mui-selected': {
      backgroundColor: 'transparent !important',
    },
    '&.Mui-selected:hover': {
      backgroundColor: `${Colors.elsieAdmin.primary.lightHover.color} !important`,
    },
    '&.Mui-selected:before': {
      content: '"\u2713"',
      display: 'inline-block',
      ...Colors.system.black,
      padding: '0 10px 0 0',
      backgroundColor: 'transparent !important',
    }
  },
  chip: {
    height: '24px',
    marginLeft: '20px'
  },
  option: {
    cursor: 'pointer'
  }
}
