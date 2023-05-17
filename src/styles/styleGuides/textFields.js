import { Backgrounds, Colors, Fonts } from '.'

export const TextFields = {
  systemGrey1: {
    '& .MuiInputBase-input': {
      padding: '12px 8px 12px 8px',
      transform: 'translate(0.6%,20%)',
      ...Fonts.body1,
    },
    '.MuiFilledInput-root': {
      borderRadius: '8px',
      ...Backgrounds.system.grey1,
      '.disabled': {
        ...Backgrounds.system.grey1,
      },
    },
    '& .MuiFilledInput-underline:before': {
      borderBottom: '1px solid',
      borderColor: Colors.system.grey3.color,
    },
    '& .MuiFilledInput-underline:after': {
      borderBottom: '1px solid',
      borderColor: Colors.system.grey3.color,
    },
    '& .MuiInputBase-root.Mui-disabled:before': {
      borderBottomStyle: 'solid',
    },
    '& .MuiInputBase-root.Mui-disabled:after': {
      borderBottomStyle: 'solid',
    },
  },
  systemGrey1InputLabel: {
    sx: {
      ...Fonts.body1,
      ...Colors.system.black,
      top: -5,
      '&.Mui-focused': {
        ...Fonts.body1,
        ...Colors.system.black,
      },
    }
  },
  elsieGold: {
    '& .MuiInputBase-input': {
      padding: '12px 8px 12px 8px',
      transform: 'translate(0.6%,20%)',
      ...Fonts.body1,
    },
    '.MuiFilledInput-root': {
      borderRadius: '8px',
      ...Backgrounds.system.grey1,
      '.disabled': {
        ...Backgrounds.system.grey1,
      }
    },
    '& .MuiFilledInput-underline:before': {
      borderBottom: '1px solid',
      borderColor: Colors.elsieAdmin.primary.main.color,
    },
    '& .MuiFilledInput-underline:after': {
      borderBottom: '1px solid',
      borderColor: Colors.elsieAdmin.primary.main.color,
    },
    '& .MuiInputBase-root.Mui-disabled:before': {
      borderBottomStyle: 'solid',
    },
    '& .MuiInputBase-root.Mui-disabled:after': {
      borderBottomStyle: 'solid',
    },
  },
  elsieGoldInputLabel: {
    sx: {
      ...Fonts.body1,
      color: 'red',
      ...Colors.system.black,
      top: -5,
      '&.Mui-focused': {
        ...Fonts.body1,
        ...Colors.elsieAdmin.primary.main
      },
    }
  }
}
