import { Colors } from '../../styleGuides'

export const ClienteleAssignmentTableRowMenuStyles = {
  toggleMenuBtnIcon: {
    ...Colors.system.black,
  },
  paper: {
    boxShadow: '0 0 10px 1px rgb(34 41 47 / 10%)'
  },
  menuItem: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    ':hover': {
      backgroundColor: Colors.elsieAdmin.primary.lightHover.color,
    },
    '&.Mui-selected': {
      backgroundColor: 'transparent !important',
    },
    '&.Mui-selected:hover': {
      backgroundColor: `${Colors.elsieAdmin.primary.lightHover.color} !important`,
    },
  }
}
