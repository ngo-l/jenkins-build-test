import { Backgrounds, Colors } from "../../styleGuides"

export const ClienteleAssignmentTablePaginationStyles = {
  root: {
    padding: '8px'
  },
  rowsPerPage: {
    margin: '0px 24px 0px 16px',
    '& .MuiInputBase-input': {
      border: 'none',
      ...Backgrounds.system.grey1,
      padding: '8px 0px 8px 8px',
      width: '51px',
    },
    '.MuiOutlinedInput-notchedOutline': {
      borderRadius: '8px 8px 0px 0px',
      borderTop: 0,
      borderRight: 0,
      borderLeft: 0,
      borderBottom: `1px solid ${Colors.system.grey3.color}`,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderRadius: '8px 8px 0px 0px',
      borderTop: 0,
      borderRight: 0,
      borderLeft: 0,
      borderBottom: `2px solid ${Colors.elsieAdmin.primary.main.color}`,
    },
    '.MuiSvgIcon-root ': {
      width: '20px',
      fill: Colors.system.black.color,
    }
  },
  rowsPerPageMenu: {
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'center',
    },
    transformOrigin: {
      vertical: 'bottom',
      horizontal: 'center',
    },
    sx: {
      '.MuiPaper-root': {
        boxShadow: '0 0 10px 1px rgb(34 41 47 / 10%)',
      },
      '.MuiTablePagination-menuItem': {
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
        '&.Mui-selected:before': {
          content: '"\u2713"',
          display: 'inline-block',
          ...Colors.system.black,
          padding: '0 10px 0 0',
          backgroundColor: 'transparent !important',
        },
      }
    }
  },
  TablePaginationActionIcon: {
    width: '18px',
  },
}
