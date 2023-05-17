import { useCallback, useEffect } from 'react'
import { Card, CardContent, TableContainer, Table, TableRow, TableBody, TableCell, Chip } from '@mui/material'
import { Circle } from '@mui/icons-material'
import { parseISO, format } from 'date-fns'
import { useState } from 'react'
import { useRouter } from 'next/router'
import cuid from 'cuid'

import { Colors, Fonts } from '../../../styles/styleGuides'
import { ClienteleAssignmentTableStyles } from '../../../styles/clienteleAssignment/clienteleAssignmentTable'
import { ClienteleAssignmentTableFilter } from './clienteleAssignmentTableFilter'
import { ClienteleAssignmentTableRowMenu } from './clienteleAssignmentTableRowMenu'
import { ClienteleAssignmentTableHeader } from './clienteleAssignmentTableHeader'
import { ClienteleAssignmentTablePagination } from './clienteleAssignmentTablePagination'
import { getClienteleAssignmentList, getClienteleAssignmentReviewFile, getClienteleAssignmentAttachedFile } from '../../../api/RESTful'

export const ClienteleAssignmentTable = () => {
  const router = useRouter()
  const [rows, setRows] = useState([])
  const [paginationInfo, setPaginationInfo] = useState({})
  const [sortOrder, setSortOrder] = useState('desc')
  const [sortBy, setSortBy] = useState('scheduledAt')
  const [error, setError] = useState(false)
  const [filterBy, setFilterBy] = useState({ pending: false, cancelled: false, error: false, completed: false, scheduled: false })
  const emptyRows = paginationInfo?.currentPage > 1 ? paginationInfo?.pageSize - rows.length : 0

  const handleChangePage = useCallback(async (event, newPage) => {
    const { pageSize } = paginationInfo
    await getData({ currentPage: newPage, pageSize, sortBy, sortOrder, filterBy })
  }, [paginationInfo, paginationInfo.paginationInfo])

  const handleChangeRowsPerPage = useCallback(async (event) => {
    await getData({ currentPage: 0, pageSize: event.target.value, sortBy, sortOrder, filterBy })
  }, [])

  const handleView = useCallback((id) => {
    router.push({
      pathname: '/clientele-assignment/view/[scheduledId]',
      query: { scheduledId: id },
    })
  }, [])

  const handleConfirm = useCallback((id) => {
    router.push({
      pathname: '/clientele-assignment/review/[scheduledId]',
      query: { scheduledId: id },
    })
  }, [])

  const handleDownload = useCallback(async (id) => {
    await getClienteleAssignmentAttachedFile({ id }, (err) => { throw err })
  }, [])

  const handleReview = useCallback(async (id) => {
    await getClienteleAssignmentReviewFile({ id }, (err) => { throw err })
  }, [])

  const getData = async (data, signal) => {
    try {
      const { filterBy } = data
      const { pagination, rows } = await getClienteleAssignmentList({ ...data, filterBy: JSON.stringify(filterBy) }, signal)
      setRows(rows)
      setPaginationInfo(pagination)
    }
    catch (err) {
      if (err.code === 'ERR_CANCELED') {
        return
      }
      setError(err)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    getData({ currentPage: 0, pageSize: 10, sortBy: '', sortOrder: 'asc', filterBy }, signal)

    return () => {
      controller.abort()
    }
  }, [])

  if (error) {
    throw error
  }

  return (
    <Card sx={ClienteleAssignmentTableStyles.root} data-testid='clienteleAssignmentTable'>
      <CardContent sx={ClienteleAssignmentTableStyles.cardContent}>
        <ClienteleAssignmentTableFilter
          selectedList={filterBy}
          handleFilter={async (property) => {
            const isSelected = filterBy[property]
            const newList = { ...filterBy, [property]: isSelected ? false : true }
            setFilterBy(newList)
            const { pageSize, currentPage } = paginationInfo
            await getData({ currentPage, pageSize, sortBy, sortOrder, filterBy: newList })
          }}
        />
        <TableContainer>
          <Table>
            <ClienteleAssignmentTableHeader
              sortBy={sortBy}
              sortOrder={sortOrder}
              handleRequestSort={async (property) => {
                const isAsc = sortBy === property && sortOrder === 'asc'
                const newOrder = isAsc ? 'desc' : 'asc'
                setSortOrder(newOrder)
                setSortBy(property)
                const { pageSize, currentPage } = paginationInfo
                await getData({ currentPage, pageSize, sortBy, sortOrder, filterBy })
              }}
            />
            <TableBody data-testid='clienteleAssignmentTableContent' >
              {rows.map(({ id, userId, fileName, status, scheduledAt, createdBy, reviewed }) => {
                return (
                  <TableRow
                    key={cuid()}
                    sx={ClienteleAssignmentTableStyles.row}
                    onClick={() => handleView(id)}
                  >
                    <TableCell align='left' width='10%' sx={[Fonts.body1, Colors.system.black]}>{userId}</TableCell>
                    <TableCell align='left' width='20%' sx={[Fonts.body1, Colors.system.black]}>{fileName}</TableCell>
                    <TableCell align='left' width='20%' sx={[Fonts.body1, Colors.system.black]}>
                      {status === 'pending' && <Chip icon={<Circle sx={ClienteleAssignmentTableStyles.warningChipIcon} />} label={status} sx={ClienteleAssignmentTableStyles.warningChip} />}
                      {(status === 'scheduled' || status === 'completed') && <Chip icon={<Circle sx={ClienteleAssignmentTableStyles.successChipIcon} />} label={status} sx={ClienteleAssignmentTableStyles.successChip} />}
                      {(status === 'error' || status === 'cancelled') && <Chip icon={<Circle sx={ClienteleAssignmentTableStyles.errorChipIcon} />} label={status} sx={ClienteleAssignmentTableStyles.errorChip} />}
                    </TableCell>
                    <TableCell align='left' width='20%' sx={[Fonts.body1, Colors.system.black]}>{format(parseISO(scheduledAt), 'yyyy-MM-dd, hh:mm a')}</TableCell>
                    <TableCell align='left' width='20%' sx={[Fonts.body1, Colors.system.black]}>{createdBy}</TableCell>
                    <TableCell align='right' width='10%'>
                      {status === 'pending' && <ClienteleAssignmentTableRowMenu id={id} handleDownload={handleDownload} handleReview={reviewed && handleReview} handleConfirm={handleConfirm} />}
                      {(status === 'scheduled' || status === 'completed') && <ClienteleAssignmentTableRowMenu id={id} handleDownload={handleDownload} handleReview={reviewed && handleReview} />}
                      {(status === 'error' || status === 'cancelled') && <ClienteleAssignmentTableRowMenu id={id} handleDownload={handleDownload} handleReview={reviewed && handleReview} />}
                    </TableCell>
                  </TableRow>
                )
              })}
              {emptyRows > 0 && (
                <TableRow sx={{ height: 48 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
          {Object.keys(paginationInfo).length > 0 &&
            <ClienteleAssignmentTablePagination
              component='div'
              count={paginationInfo.totalItems}
              page={paginationInfo.currentPage}
              labelRowsPerPage='Rows per page'
              rowsPerPage={paginationInfo.pageSize}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[10, 50, 100]}
              onRowsPerPageChange={handleChangeRowsPerPage}
              showFirstButton
              showLastButton
            />
          }
        </TableContainer>
      </CardContent>
    </Card>
  )
}
