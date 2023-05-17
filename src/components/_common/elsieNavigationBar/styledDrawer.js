import { Drawer, styled } from '@mui/material'

import { Backgrounds, Colors } from '../../../styles/styleGuides'

const DRAWER_WIDTH_OPEN = 260
const DRAWER_WIDTH_CLOSE = 82

const openedMixinStyle = (theme) => ({
  width: DRAWER_WIDTH_OPEN,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  '&& .Mui-selected': {
    ...Backgrounds.system.grey1,
    ...Colors.elsieAdmin.primary.main,
    borderRadius: '4px',
  },
  '&& .Mui-disabled': {
    opacity: 1
  },
  overflowX: 'hidden',
})

const closedMixinStyle = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: DRAWER_WIDTH_CLOSE,
  '&& .Mui-selected': {
    background: 'none'
  },
  '&& .Mui-disabled': {
    opacity: 1
  },
})

export const StyledDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    zIndex: 1,
    width: DRAWER_WIDTH_OPEN,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    width: '100%',
    ...(open && {
      ...openedMixinStyle(theme),
      '& .MuiDrawer-paper': openedMixinStyle(theme),
    }),
    ...(!open && {
      ...closedMixinStyle(theme),
      '& .MuiDrawer-paper': closedMixinStyle(theme),
    }),
  }),
)
