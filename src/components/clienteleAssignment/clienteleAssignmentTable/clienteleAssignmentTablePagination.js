import { useCallback } from 'react'
import { TablePagination, Button, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { KeyboardDoubleArrowRightOutlined, KeyboardDoubleArrowLeftOutlined, KeyboardArrowLeft, KeyboardArrowRight, KeyboardArrowDown } from '@mui/icons-material'

import { ClienteleAssignmentTablePaginationStyles } from '../../../styles/clienteleAssignment/clienteleAssignmentTable'
import { Buttons, Colors } from '../../../styles/styleGuides'

function TablePaginationActions(props) {
  const theme = useTheme()
  const { count, page, rowsPerPage, onPageChange } = props

  const handleFirstPage = useCallback((event) => {
    onPageChange(event, 0)
  }, [rowsPerPage, count])

  const handleBackButtonClick = useCallback((event) => {
    onPageChange(event, page - 1)
  }, [rowsPerPage, page, count])

  const handleNextButtonClick = useCallback((event) => {
    onPageChange(event, page + 1)
  }, [rowsPerPage, page, count])

  const handleLastPage = useCallback((event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }, [count, rowsPerPage, count])

  return (
    <Stack direction='row'>
      <Button
        data-testid='clienteleAssignmentTablePaginationFirstPageBtn'
        sx={[Buttons.elsieGoldTransparent, Colors.system.black]}
        onClick={handleFirstPage}
        disabled={page === 0}
        aria-label='first page'
      >
        {theme.direction === 'rtl' ? <KeyboardDoubleArrowRightOutlined sx={ClienteleAssignmentTablePaginationStyles.TablePaginationActionIcon} /> : <KeyboardDoubleArrowLeftOutlined sx={ClienteleAssignmentTablePaginationStyles.TablePaginationActionIcon} />}
      </Button>
      <Button
        data-testid='clienteleAssignmentTablePaginationPreviousPageBtn'
        sx={[Buttons.elsieGoldTransparent, Colors.system.black]}
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label='previous page'
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight sx={ClienteleAssignmentTablePaginationStyles.TablePaginationActionIcon} /> : <KeyboardArrowLeft sx={ClienteleAssignmentTablePaginationStyles.TablePaginationActionIcon} />}
      </Button>
      <Button
        data-testid='clienteleAssignmentTablePaginationNextPageBtn'
        sx={[Buttons.elsieGoldTransparent, Colors.system.black]}
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='next page'
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft sx={ClienteleAssignmentTablePaginationStyles.TablePaginationActionIcon} /> : <KeyboardArrowRight sx={ClienteleAssignmentTablePaginationStyles.TablePaginationActionIcon} />}
      </Button>
      <Button
        data-testid='clienteleAssignmentTablePaginationLastPageBtn'
        sx={[Buttons.elsieGoldTransparent, Colors.system.black]}
        onClick={handleLastPage}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='last page'
      >
        {theme.direction === 'rtl' ? <KeyboardDoubleArrowLeftOutlined sx={ClienteleAssignmentTablePaginationStyles.TablePaginationActionIcon} /> : <KeyboardDoubleArrowRightOutlined sx={ClienteleAssignmentTablePaginationStyles.TablePaginationActionIcon} />}
      </Button>
    </Stack>
  )
}

export const ClienteleAssignmentTablePagination = (props) => {
  return (
    <div data-testid='clienteleAssignmentTablePagination'>
      <TablePagination
        SelectProps={{
          variant: 'outlined',
          sx: ClienteleAssignmentTablePaginationStyles.rowsPerPage,
          IconComponent: KeyboardArrowDown,
          MenuProps: ClienteleAssignmentTablePaginationStyles.rowsPerPageMenu
        }}
        ActionsComponent={TablePaginationActions}
        {...props}
      />
    </div>
  )
}
