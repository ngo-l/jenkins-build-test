import { useState, useCallback, useEffect } from 'react'
import { Stack, Box, List, CssBaseline, ListItem, Typography, ListItemButton, ListItemIcon, Divider } from '@mui/material'
import { useRouter } from 'next/router'
import { LogOut } from 'react-feather'
import { useTranslation } from 'react-i18next'
import cuid from 'cuid'

import { ElsieNavigationBarStyles } from '../../../styles/_common/elsieNavigationBar'
import { Pathname } from './pathname'
import { StyledDrawer } from './styledDrawer'
import { Colors, Fonts } from '../../../styles/styleGuides'

export const ElsieNavigationBar = () => {
  const router = useRouter()
  const { t } = useTranslation('common')
  const [open, setOpen] = useState(false)
  const [selectedPage, setSelectedPage] = useState('')
  const handleDrawerOpen = useCallback(() => { setOpen(true) }, [])
  const handleDrawerClose = useCallback(() => { setOpen(false) }, [])
  const handleLogout = useCallback(() => {
    document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    router.push('https://lc-seenit.lanecrawford.com.cn/index.php/admin')
  }, [])

  useEffect(() => {
    if (!router.isReady) {
      return
    }
    setSelectedPage(router.pathname)
  }, [router.pathname])

  return (
    <>
      <CssBaseline />
      <StyledDrawer
        variant='permanent'
        open={open}
        onMouseOut={handleDrawerClose}
        onMouseOver={handleDrawerOpen}
        PaperProps={{ 'data-testid': 'elsieNavigationBar', style: ElsieNavigationBarStyles.elsieNavigationBar }}
      >
        <Box sx={ElsieNavigationBarStyles.elsieLogo}>
          <img src='/favicon.png' height='40px' width='40px' alt='ElsieLogo' />
        </Box>
        <Stack direction='column' justifyContent='space-between' sx={ElsieNavigationBarStyles.elsieNavigationBarContent}>
          <List sx={ElsieNavigationBarStyles.navigationItemList}>
            {Pathname().map(({ name, icon, path, disabled }) => {
              const selected = path === selectedPage
              return (
                <ListItem disablePadding selected={selected} key={cuid()} data-testid='elsieNavigationItem'>
                  <ListItemButton
                    sx={ElsieNavigationBarStyles.navigationItem}
                    disabled={disabled || selected}
                    onClick={() => {
                      setSelectedPage(path)
                      router.push(path)
                    }}
                  >
                    {icon &&
                      <ListItemIcon>
                        {icon(selected)}
                      </ListItemIcon>
                    }
                    {open &&
                      <Typography variant='body' sx={[Fonts.body1, selected ? Colors.elsieAdmin.primary.main : disabled ? Colors.system.grey2 : Colors.system.black]}>
                        {name}
                      </Typography>
                    }
                  </ListItemButton>
                </ListItem>
              )
            }
            )}
          </List>
          <Box >
            <Divider />
            <List sx={ElsieNavigationBarStyles.navigationItemList}>
              <ListItem disablePadding data-testid='elsieLogoutBtn'>
                <ListItemButton sx={ElsieNavigationBarStyles.navigationItem} onClick={handleLogout}>
                  <ListItemIcon>
                    <LogOut style={Colors.system.black} />
                  </ListItemIcon>
                  {open &&
                    <Typography variant='body' sx={[Fonts.body1, Colors.system.black]}>
                      {t('logOut')}
                    </Typography>
                  }
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Stack>
      </StyledDrawer>
    </>
  )
}
