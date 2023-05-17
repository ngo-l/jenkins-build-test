import { useCallback, useState } from 'react'
import { Divider, IconButton, Menu, MenuItem } from '@mui/material'
import { MoreVert } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

import { ClienteleAssignmentTableRowMenuStyles } from '../../../styles/clienteleAssignment/clienteleAssignmentTable'
import { Buttons, Fonts } from '../../../styles/styleGuides'

export const ClienteleAssignmentTableRowMenu = ({ id, handleDownload, handleReview, handleConfirm }) => {
  const { t } = useTranslation('clienteleAssignment')
  const [anchorEl, setAnchorEl] = useState(null)
  const handleActionsOpen = useCallback((e) => {
    e.stopPropagation()
    setAnchorEl(e.currentTarget)
  }, [])
  const handleActionsClose = useCallback((e) => {
    e.stopPropagation()
    setAnchorEl(null)
  }, [])

  return (
    <>
      <IconButton
        data-testid={`toggleRowMenuBtn${id}`}
        id={`toggleRowMenuBtn${id}`}
        key={`toggleRowMenuBtn${id}`}
        onClick={handleActionsOpen}
        disableRipple
        sx={Buttons.elsieGoldTransparentIcon}
      >
        <MoreVert sx={ClienteleAssignmentTableRowMenuStyles.toggleMenuBtnIcon} />
      </IconButton>
      <Menu
        id={`clienteleAssignmentTableRowMenu${id}`}
        data-testid={`clienteleAssignmentTableRowMenu${id}`}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: [ClienteleAssignmentTableRowMenuStyles.paper, Fonts.body1],
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem
          data-testid={`downloadBtn${id}`}
          key={`downloadBtn${id}`}
          onClick={(e) => {
            handleActionsClose(e)
            handleDownload(id)
          }}
          sx={ClienteleAssignmentTableRowMenuStyles.menuItem}
        >
          {t('downloadUploadedFile', { ns: 'clienteleAssignment' })}
        </MenuItem>
        <MenuItem
          data-testid={`reviewBtn${id}`}
          key={`reviewBtn${id}`}
          onClick={(e) => {
            handleActionsClose(e)
            handleReview(id)
          }}
          disabled={!handleReview}
          sx={ClienteleAssignmentTableRowMenuStyles.menuItem}
        >
          {t('reviewChange', { ns: 'clienteleAssignment' })}
        </MenuItem>
        <Divider />
        <MenuItem
          data-testid={`confirmScheduleBtn${id}`}
          key={`confirmScheduleBtn${id}`}
          onClick={(e) => {
            handleActionsClose(e)
            handleConfirm(id)
          }}
          disabled={!handleConfirm}
          sx={ClienteleAssignmentTableRowMenuStyles.menuItem}
        >
          {t('confirmSchedule', { ns: 'clienteleAssignment' })}
        </MenuItem>
      </Menu>
    </>
  )
}
