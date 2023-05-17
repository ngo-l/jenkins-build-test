import { Backgrounds, Fonts, Colors } from "../../styleGuides"

export const ElsieDateSelectorStyles = {
  root: {
    margin: '16px'
  },
  cardRoot: {
    boxShadow: '0 0 10px 1px rgb(34 41 47 / 10%)'
  },
  cardContent: {
    padding: '16px'
  },
  dateCalendarSlot: {
    minHeight: '200px'
  },
  dateCalendar: {
    width: '100%',
    '.MuiPickersCalendarHeader-root': {
      marginTop: '3%',
      padding: 0,
    },
    '.MuiPickersCalendarHeader-labelContainer': {
      ...Fonts.subHeading1
    },
    '.MuiTypography-root': {
      ...Fonts.body1
    },
    '.MuiButtonBase-root': {
      ...Fonts.body1,
      ':hover': {
        backgroundColor: Colors.elsieAdmin.primary.lightHover.color,
      },
      '&.Mui-selected': {
        backgroundColor: Colors.elsieAdmin.primary.lightHover.color,
        ...Colors.system.black,
        ':hover': {
          backgroundColor: Colors.elsieAdmin.primary.lightHover.color,
        },
        '&:focus': {
          backgroundColor: Colors.elsieAdmin.primary.lightHover.color,
        },
      },
    },
  },
  divider: {
    width: '2px',
    ...Backgrounds.system.grey1
  },
  timePicker: {
    border: 'none',
    width: '160px',
    '.MuiList-root': {
      maxHeight: '240px',
      border: 'none',
      '::after': {
        height: '196px',
      },
      ':not(:first-of-type)': {
        border: 'none',
      }
    },
    '.MuiButtonBase-root': {
      ...Fonts.body1,
      '&.Mui-selected': {
        backgroundColor: Colors.elsieAdmin.primary.lightHover.color,
        ...Colors.system.black,
        ':hover': {
          backgroundColor: Colors.elsieAdmin.primary.lightHover.color,
        },
      },
      ':hover': {
        backgroundColor: Colors.elsieAdmin.primary.lightHover.color,
      },
    }
  },
  dateTimePickerBtn: {
    padding: '4px 8px',
    cursor: 'pointer',
    ...Colors.elsieAdmin.primary.main,
    '&:hover': {
      ...Colors.elsieAdmin.primary.mainHover
    },
  },
  closeDateTimePickerBtn:{
    cursor:'pointer',
    ...Colors.system.grey2
  }
}
