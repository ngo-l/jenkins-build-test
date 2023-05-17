import { Backgrounds, Colors } from './'

export const Buttons = {
  elsieGold: {
    textTransform: 'none',
    padding: '8px 16px',
    borderRadius: '12px',
    ...Backgrounds.elsieAdmin.primary.main,
    '&:hover': {
      ...Backgrounds.elsieAdmin.primary.mainHover,
    },
    '&:disabled': {
      ...Backgrounds.system.grey2,
    }
  },
  elsieGoldTransparent: {
    textTransform: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    '&:hover': {
      ...Backgrounds.elsieAdmin.primary.lightHover,
    },
    '&:disabled': {
      ...Colors.system.grey2,
    },
    '&.MuiButton-outlined': {
      borderRadius: '10px',
      border: `1px solid ${Colors.elsieAdmin.primary.main.color}`
    }
  },
  elsieGoldTransparentIcon: {
    width: '36px',
    height: '36px',
    textTransform: 'none',
    padding: '8px',
    borderRadius: '8px',
    '&:hover': {
      ...Backgrounds.elsieAdmin.primary.lightHover,
    },
    '&:disabled': {
      ...Colors.system.grey2,
    }
  },
  elsieSuccess: {
    textTransform: 'none',
    padding: '8px 16px',
    borderRadius: '12px',
    ...Backgrounds.success.main,
    '&:hover': {
      ...Backgrounds.success.hover,
    },
    '&:disabled': {
      ...Backgrounds.system.grey2,
    }
  },
  elsieSuccessTransparent: {
    textTransform: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    '&:hover': {
      ...Backgrounds.success.light,
    },
    '&:disabled': {
      ...Colors.success.main,
    },
    '&.MuiButton-outlined': {
      borderRadius: '10px',
      border: `1px solid ${Colors.elsieAdmin.primary.main.color}`
    }
  },
}
