import { useState, useMemo } from 'react'
import cuid from 'cuid'
import { visuallyHidden } from '@mui/utils'
import { TableHead, TableRow, TableCell, TableSortLabel, Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { Backgrounds, Fonts } from '../../../styles/styleGuides'
import { ClienteleAssignmentTableHeaderStyles } from '../../../styles/clienteleAssignment/clienteleAssignmentTable'

export const ClienteleAssignmentTableHeader = ({ sortOrder, sortBy, handleRequestSort }) => {
  const { t, i18n } = useTranslation('clienteleAssignment')
  const HEAD_CELLS = useMemo(() => ([
    {
      id: 'userId',
      label: t('userId', { ns: 'clienteleAssignment' }),
      sortable: false
    },
    {
      id: 'fileName',
      label: t('fileName', { ns: 'clienteleAssignment' }),
      sortable: false
    },
    {
      id: 'status',
      label: t('status', { ns: 'clienteleAssignment' }),
      sortable: false
    },
    {
      id: 'scheduledAt',
      label: t('scheduledAt', { ns: 'clienteleAssignment' }),
      sortable: true
    },
    {
      id: 'createdBy',
      label: t('createdBy', { ns: 'clienteleAssignment' }),
      sortable: false
    },
    {
      id: 'actions',
      sortable: false
    }
  ]), [i18n.language])

  return (
    <TableHead sx={Backgrounds.system.grey1} data-testid='clienteleAssignmentTableHeader'    >
      <TableRow >
        {HEAD_CELLS.map(({ id, label, sortable }) => {
          const activeSorting = sortBy === id
          return (
            <TableCell key={cuid()} align='left' sortDirection={activeSorting && sortOrder}  >
              {sortable === false && <Typography variant='body' data-testid={`headCell${id}`} sx={Fonts.subHeading1}>{label}</Typography>}
              {sortable &&
                <TableSortLabel
                  active={activeSorting}
                  direction={activeSorting ? sortOrder : 'asc'}
                  onClick={() => handleRequestSort(id)}
                  sx={ClienteleAssignmentTableHeaderStyles.sortLabel}
                >
                  <Typography variant='body' data-testid={`headCell${id}`} sx={Fonts.subHeading1}>
                    {label}
                  </Typography>
                  {activeSorting && (
                    <Box component="span" sx={visuallyHidden}>
                      {sortOrder === 'desc' && 'sorted descending'}
                      {sortOrder === 'asc' && 'sorted ascending'}
                    </Box>
                  )}
                </TableSortLabel>
              }
            </TableCell>
          )
        })}
      </TableRow>
    </TableHead >
  )
}
