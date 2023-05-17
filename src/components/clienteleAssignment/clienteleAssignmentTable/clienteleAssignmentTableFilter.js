import { Chip, Stack, IconButton, Menu, MenuItem } from '@mui/material'
import { Filter } from 'react-feather'
import { Circle, ClearOutlined } from '@mui/icons-material'
import { useCallback, useState } from 'react'
import cuid from 'cuid'

import { Colors, Buttons, Fonts } from '../../../styles/styleGuides'
import { ClienteleAssignmentTableStyles, ClienteleAssignmentTableFilterStyles } from '../../../styles/clienteleAssignment/clienteleAssignmentTable'

export const ClienteleAssignmentTableFilter = ({ selectedList, handleFilter }) => {
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
    <Stack data-testid='clienteleAssignmentTableFilter' direction='row' sx={ClienteleAssignmentTableFilterStyles.root} alignItems='center'>
      <IconButton
        data-testid='toggleFilterMenuBtn'
        id='toggleFilterMenuBtn'
        key='toggleFilterMenuBtn'
        onClick={handleActionsOpen}
        disableRipple
        sx={Buttons.elsieGoldTransparentIcon}
      >
        <Filter style={Colors.elsieAdmin.primary.main} width='18px' />
      </IconButton >
      {Object.entries(selectedList).map(
        ([key, value]) => value === true &&
          <div style={ClienteleAssignmentTableFilterStyles.chip} key={cuid()}>
            {key === 'pending' &&
              <Chip
                icon={<Circle sx={ClienteleAssignmentTableStyles.warningChipIcon} />}
                label={key}
                sx={ClienteleAssignmentTableStyles.warningChip}
                onDelete={() => {
                  handleFilter(key)
                }}
                deleteIcon={<ClearOutlined />}
              />}
            {(key === 'scheduled' || key === 'completed') &&
              <Chip
                icon={<Circle sx={ClienteleAssignmentTableStyles.successChipIcon} />}
                label={key}
                sx={ClienteleAssignmentTableStyles.successChip}
                onDelete={() => {
                  handleFilter(key)
                }}
                deleteIcon={<ClearOutlined />}
              />
            }
            {(key === 'error' || key === 'cancelled') &&
              <Chip
                icon={<Circle sx={ClienteleAssignmentTableStyles.errorChipIcon} />}
                label={key}
                sx={ClienteleAssignmentTableStyles.errorChip}
                onDelete={() => {
                  handleFilter(key)
                }}
                deleteIcon={<ClearOutlined />}
              />
            }
          </div>
      )}
      <Menu
        id='clienteleAssignmentTableFilterMenu'
        data-testid='clienteleAssignmentTableFilterMenu'
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: [ClienteleAssignmentTableFilterStyles.paper, Fonts.body1],
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem
          data-testid='pendingTab'
          key='pendingTab'
          selected={selectedList['pending']}
          onClick={(e) => {
            handleFilter('pending')
            handleActionsClose(e)
          }}
          sx={ClienteleAssignmentTableFilterStyles.menuItem}
        >
          <Chip icon={<Circle sx={ClienteleAssignmentTableStyles.warningChipIcon} />} label='pending' sx={[ClienteleAssignmentTableStyles.warningChip, ClienteleAssignmentTableFilterStyles.option]} />
        </MenuItem>
        <MenuItem
          data-testid='scheduledTab'
          key='scheduledTab'
          selected={selectedList['scheduled']}
          onClick={(e) => {
            handleFilter('scheduled')
            handleActionsClose(e)
          }}
          sx={ClienteleAssignmentTableFilterStyles.menuItem}
        >
          <Chip icon={<Circle sx={ClienteleAssignmentTableStyles.successChipIcon} />} label='scheduled' sx={[ClienteleAssignmentTableStyles.successChip, ClienteleAssignmentTableFilterStyles.option]} />
        </MenuItem>
        <MenuItem
          data-testid='completedTab'
          key='completedTab'
          selected={selectedList['completed']}
          onClick={(e) => {
            handleFilter('completed')
            handleActionsClose(e)
          }}
          sx={ClienteleAssignmentTableFilterStyles.menuItem}
        >
          <Chip icon={<Circle sx={ClienteleAssignmentTableStyles.successChipIcon} />} label='completed' sx={[ClienteleAssignmentTableStyles.successChip, ClienteleAssignmentTableFilterStyles.option]} />
        </MenuItem>
        <MenuItem
          data-testid='errorTab'
          key='errorTab'
          selected={selectedList['error']}
          onClick={(e) => {
            handleFilter('error')
            handleActionsClose(e)
          }}
          sx={ClienteleAssignmentTableFilterStyles.menuItem}
        >
          <Chip icon={<Circle sx={ClienteleAssignmentTableStyles.errorChipIcon} />} label='error' sx={[ClienteleAssignmentTableStyles.errorChip, , ClienteleAssignmentTableFilterStyles.option]} />
        </MenuItem>
        <MenuItem
          data-testid='cancelledTab'
          key='cancelledTab'
          selected={selectedList['cancelled']}
          onClick={(e) => {
            handleFilter('cancelled')
            handleActionsClose(e)
          }}
          sx={ClienteleAssignmentTableFilterStyles.menuItem}
        >
          <Chip icon={<Circle sx={ClienteleAssignmentTableStyles.errorChipIcon} />} label='cancelled' sx={[ClienteleAssignmentTableStyles.errorChip, ClienteleAssignmentTableFilterStyles.option]} />
        </MenuItem>
      </Menu>
    </Stack>
  )
}
