import { Grid, Typography, Stack, TextField, Card, CardContent, Chip, IconButton } from '@mui/material'
import { Circle } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { useCallback, useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import { ChevronDown, ChevronUp } from 'react-feather'

import { getClienteleAssignmentSchedule, deleteClienteleAssignmentSchedule, editClienteleAssignmentSchedule } from '../../../api/RESTful'
import { ClienteleAssignmentViewPagesStyles } from '../../../styles/pages/clienteleAssignmentViewPagesStyles'
import { Colors, Fonts, TextFields } from '../../../styles/styleGuides'
import { Mainlayout } from '../../../layouts'

export default function ClienteleAssignmentViewPage() {
  const { t } = useTranslation(['clienteleAssignment', 'common'])
  const [isDetails, setIsDetails] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)
  const router = useRouter()

  const handleDiscard = useCallback(() => { router.push('/clientele-assignment') }, [])
  const handleChangeSchedule = useCallback(() => {
    const status = data?.status
    const { scheduledId } = router?.query
    if (!status || !scheduledId || status !== 'pending') {
      return
    }
    router.push({
      pathname: '/clientele-assignment/change-schedule/[scheduledId]',
      query: { scheduledId },
    })
  }, [data, router?.query])
  const handleDelete = useCallback(async () => {
    const { scheduledId } = router?.query
    if (!scheduledId) {
      return
    }

    const res = await deleteClienteleAssignmentSchedule({ id: scheduledId }, (err) => { if (!err) { return } setError(err) })
    if (res === 'Deleted successfully') {
      //ToDo add elsieSnackBar to show the result
    }
  }, [router?.query])
  const handleCancel = useCallback(async () => {
    const { scheduledId } = router?.query
    if (!scheduledId) {
      return
    }

    const res = await editClienteleAssignmentSchedule({ id: scheduledId, status: 'cancelled' }, (err) => { if (!err) { return } setError(err) })
    if (res === 'Cancelled successfully') {
      //ToDo add elsieSnackBar to show the result
    }
  }, [router?.query])
  const getData = async (data, signal) => {
    const res = await getClienteleAssignmentSchedule(data, signal, (err) => { if (!err) { return } setError(err) })
    if (!res) {
      return null
    }

    setData(res)
  }

  useEffect(() => {
    if (router.isReady !== true) {
      return
    }
    const controller = new AbortController()
    const { signal } = controller
    const { scheduledId } = router.query
    getData({ id: scheduledId }, signal)

    return () => {
      controller.abort()
    }
  }, [router.isReady])

  if (error) {
    throw new Error('fullPageError')
  }

  return (
    <div data-testid='clienteleAssignmentViewPage' className='root'>
      <Grid container direction='row' justifyContent='center' alignItems='center' >
        <Grid container direction='row' justifyContent='flex-start' alignItems='center'>
          <Grid item data-testid='backBtn' sx={ClienteleAssignmentViewPagesStyles.backBtn} onClick={handleDiscard}>
            <Typography variant='h5' sx={Fonts.subHeading1}>
              {t('back', { ns: 'common' })}
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction='row' justifyContent='flex-start' alignItems='center'>
          <Grid item data-testid='clienteleAssignmentTitle'>
            <Typography variant='h4' sx={Fonts.h4}>
              {t('view', { ns: 'clienteleAssignment' })}
            </Typography>
          </Grid>
          <Grid item sx={ClienteleAssignmentViewPagesStyles.chip} >
            {data?.status === 'pending' && <Chip icon={<Circle sx={ClienteleAssignmentViewPagesStyles.warningChipIcon} />} label={data.status} sx={ClienteleAssignmentViewPagesStyles.warningChip} />}
            {(data?.status === 'scheduled' || data?.status === 'completed') && <Chip icon={<Circle sx={ClienteleAssignmentViewPagesStyles.successChipIcon} />} label={data.status} sx={ClienteleAssignmentViewPagesStyles.successChip} />}
            {(data?.status === 'error' || data?.status === 'cancelled') && <Chip icon={<Circle sx={ClienteleAssignmentViewPagesStyles.errorChipIcon} />} label={data.status} sx={ClienteleAssignmentViewPagesStyles.errorChip} />}
          </Grid>
        </Grid>
        <Grid item sx={ClienteleAssignmentViewPagesStyles.clienteleAssignmentContent} data-testid='clienteleAssignmentContent'>
          <Card sx={ClienteleAssignmentViewPagesStyles.cardRoot} data-testid='clienteleAssignmentTable'>
            <CardContent sx={ClienteleAssignmentViewPagesStyles.cardContent}>
              <Grid container direction='row' justifyContent='flex-start' alignItems='center' >
                <Grid container direction='row' justifyContent='flex-start' alignItems='center' sx={ClienteleAssignmentViewPagesStyles.elsieFileUploaderInput} >
                  <Grid item xs={11} md={8} lg={5} >
                    <TextField
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      value={data?.fileName || ''}
                      id='elsieFileUploaderInput'
                      data-testid='elsieFileUploaderInput'
                      label={t('elsieFileUploaderLabel', { ns: 'common' })}
                      sx={TextFields.systemGrey1}
                      variant='filled'
                      InputLabelProps={TextFields.systemGrey1InputLabel}
                    />
                  </Grid>
                </Grid>
                <Grid container direction='row' justifyContent='flex-start' alignItems='center' sx={ClienteleAssignmentViewPagesStyles.elsieDateSelectorInput} >
                  <Grid item xs={11} md={8} lg={5} >
                    <TextField
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      id='elsieDateSelectorInput'
                      data-testid='elsieDateSelectorInput'
                      label={t('elsieDateSelectorLabel', { ns: 'common' })}
                      sx={TextFields.systemGrey1}
                      variant='filled'
                      value={data?.scheduledAt ?
                        format(parseISO(data.scheduledAt), 'yyyy-MM-dd, hh:mm a') :
                        ''
                      }
                      onClick={handleChangeSchedule}
                      InputLabelProps={TextFields.systemGrey1InputLabel}
                      inputProps={{ 'data-testid': 'elsieDateSelectorInputField', sx: { cursor: 'pointer' } }}
                    />
                  </Grid>
                </Grid>
                <IconButton disableRipple onClick={() => setIsDetails(!isDetails)} sx={ClienteleAssignmentViewPagesStyles.detailsBtn} data-testid='clienteleAssignmentDetailsBtn'>
                  {isDetails && <ChevronUp width='20px' />}
                  {!isDetails && <ChevronDown width='20px' />}
                  <Typography variant='h5' sx={Fonts.subHeading1}>
                    {t('details', { ns: 'common' })}
                  </Typography>
                </IconButton>
                {isDetails &&
                  <Grid container direction='column' justifyContent='flex-start' alignItems='flex-start' sx={ClienteleAssignmentViewPagesStyles.details} data-testid='clienteleAssignmentScheduleDetails'>
                    <Stack direction='column' justifyContent='flex-start' alignItems='flex-start' sx={ClienteleAssignmentViewPagesStyles.content}>
                      <Typography variant='p' sx={Fonts.body1}>
                        {t('id', { ns: 'common' })}{data?.userId}
                      </Typography>
                      <Typography variant='p' sx={Fonts.body1}>
                        {t('createdBy', { ns: 'common' })}{data?.createdBy}
                      </Typography>
                      <Typography variant='p' sx={Fonts.body1}>
                        {t('lastUpdatedBy', { ns: 'common' })}{data?.lastUpdatedBy}
                      </Typography>
                      <Typography variant='p' sx={Fonts.body1}>
                        {t('confirmedBy', { ns: 'common' })}{data?.confirmedBy}
                      </Typography>
                    </Stack>
                    {(data?.status === 'pending' || data?.status === 'error') &&
                      <Stack direction='column' justifyContent='flex-start' alignItems='flex-start' sx={ClienteleAssignmentViewPagesStyles.cancelBtn} onClick={handleCancel}>
                        <Typography variant='p' sx={[Fonts.subHeading1, Colors.error.main]}>
                          {t('cancelSchedule', { ns: 'clienteleAssignment' })}
                        </Typography>
                      </Stack>
                    }
                    {data?.status === 'cancelled' &&
                      <Stack direction='column' justifyContent='flex-start' alignItems='flex-start' sx={ClienteleAssignmentViewPagesStyles.deleteBtn} onClick={handleDelete}>
                        <Typography variant='p' sx={[Fonts.subHeading1, Colors.error.main]}>
                          {t('deleteSchedule', { ns: 'clienteleAssignment' })}
                        </Typography>
                      </Stack>
                    }
                  </Grid>
                }
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div >
  )
}

ClienteleAssignmentViewPage.getLayout = function getLayout(home) {
  return (
    <Mainlayout>
      {home}
    </Mainlayout>
  )
}
