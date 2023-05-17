import { Grid, Typography, Stack, TextField, Card, CardContent, Chip, IconButton, Button } from '@mui/material'
import { Circle } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { useCallback, useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import { ChevronDown, ChevronUp } from 'react-feather'

import { getClienteleAssignmentSchedule, getClienteleAssignmentReviewFile, deleteClienteleAssignmentSchedule, editClienteleAssignmentSchedule } from '../../../api/RESTful'
import { ClienteleAssignmentReviewPageStyles } from '../../../styles/pages/clienteleAssignmentReviewPageStyles'
import { Colors, Fonts, TextFields, Buttons } from '../../../styles/styleGuides'
import { Mainlayout } from '../../../layouts'

export default function ClienteleAssignmentReviewPage() {
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

  const handleReview = useCallback(async () => {
    const { scheduledId } = router?.query
    if (!scheduledId) {
      return
    }
    await getClienteleAssignmentReviewFile({ id: scheduledId })
  }, [])

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

  const handleConfirm = useCallback(async () => {

    const { scheduledId } = router?.query
    if (!scheduledId) {
      return
    }

    const res = await editClienteleAssignmentSchedule({ id: scheduledId, status: 'scheduled' }, (err) => { if (!err) { return } setError(err) })
    if (res === 'Scheduled successfully') {
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
    <div data-testid='clienteleAssignmentReviewPage' className='root'>
      <Grid container direction='row' justifyContent='center' alignItems='center' >
        <Grid container direction='row' justifyContent='flex-start' alignItems='center'>
          <Grid item data-testid='backBtn' sx={ClienteleAssignmentReviewPageStyles.backBtn} onClick={handleDiscard}>
            <Typography variant='h5' sx={Fonts.subHeading1}>
              {t('back', { ns: 'common' })}
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction='row' justifyContent='space-between' alignItems='center'>
          <Grid item>
            <Grid container direction='row' justifyContent='flex-start' alignItems='center'>
              <Grid item data-testid='clienteleAssignmentTitle'>
                <Typography variant='h4' sx={Fonts.h4}>
                  {t('review.name', { ns: 'clienteleAssignment' })}
                </Typography>
              </Grid>
              <Grid item sx={ClienteleAssignmentReviewPageStyles.chip} >
                {data?.status === 'pending' && <Chip icon={<Circle sx={ClienteleAssignmentReviewPageStyles.warningChipIcon} />} label={data.status} sx={ClienteleAssignmentReviewPageStyles.warningChip} />}
                {(data?.status === 'scheduled' || data?.status === 'completed') && <Chip icon={<Circle sx={ClienteleAssignmentReviewPageStyles.successChipIcon} />} label={data.status} sx={ClienteleAssignmentReviewPageStyles.successChip} />}
                {(data?.status === 'error' || data?.status === 'cancelled') && <Chip icon={<Circle sx={ClienteleAssignmentReviewPageStyles.errorChipIcon} />} label={data.status} sx={ClienteleAssignmentReviewPageStyles.errorChip} />}
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction='row' alignItems='center'>
              <Grid item data-testid='downloadAssignmentReviewBtn' sx={ClienteleAssignmentReviewPageStyles.reviewChangeBtn} onClick={handleReview}>
                <Typography variant='h3' sx={Fonts.subHeading1}>
                  {t('review.reviewChange', { ns: 'clienteleAssignment' })}
                </Typography>
              </Grid>
              <Grid item >
                <Button sx={Buttons.elsieGold} disableRipple onClick={handleConfirm} data-testid='confirmClienteleAssignmentScheduleBtn'>
                  <Typography variant='h3' sx={[Fonts.subHeading1, Colors.system.white]}>
                    {t('review.confirmSchedule', { ns: 'clienteleAssignment' })}
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sx={ClienteleAssignmentReviewPageStyles.clienteleAssignmentContent} data-testid='clienteleAssignmentContent'>
          <Card sx={ClienteleAssignmentReviewPageStyles.cardRoot} data-testid='clienteleAssignmentTable'>
            <CardContent sx={ClienteleAssignmentReviewPageStyles.cardContent}>
              <Grid container direction='row' justifyContent='flex-start' alignItems='center' >
                <Grid container direction='row' justifyContent='flex-start' alignItems='center' sx={ClienteleAssignmentReviewPageStyles.elsieFileUploaderInput} >
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
                <Grid container direction='row' justifyContent='flex-start' alignItems='center' sx={ClienteleAssignmentReviewPageStyles.elsieDateSelectorInput} >
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
                <IconButton disableRipple onClick={() => setIsDetails(!isDetails)} sx={ClienteleAssignmentReviewPageStyles.detailsBtn} data-testid='clienteleAssignmentDetailsBtn'>
                  {isDetails && <ChevronUp width='20px' />}
                  {!isDetails && <ChevronDown width='20px' />}
                  <Typography variant='h5' sx={Fonts.subHeading1}>
                    {t('details', { ns: 'common' })}
                  </Typography>
                </IconButton>
                {isDetails &&
                  <Grid container direction='column' justifyContent='flex-start' alignItems='flex-start' sx={ClienteleAssignmentReviewPageStyles.details} data-testid='clienteleAssignmentScheduleDetails'>
                    <Stack direction='column' justifyContent='flex-start' alignItems='flex-start' sx={ClienteleAssignmentReviewPageStyles.content}>
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
                    {(data?.status === 'pending' || data?.status === 'error' || data?.status === 'scheduled') &&
                      <Stack direction='column' justifyContent='flex-start' alignItems='flex-start' sx={ClienteleAssignmentReviewPageStyles.cancelBtn} onClick={handleCancel}>
                        <Typography variant='p' sx={[Fonts.subHeading1, Colors.error.main]}>
                          {t('cancelSchedule', { ns: 'clienteleAssignment' })}
                        </Typography>
                      </Stack>
                    }
                    {data?.status === 'cancelled' &&
                      <Stack direction='column' justifyContent='flex-start' alignItems='flex-start' sx={ClienteleAssignmentReviewPageStyles.deleteBtn} onClick={handleDelete}>
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

ClienteleAssignmentReviewPage.getLayout = function getLayout(home) {
  return (
    <Mainlayout>
      {home}
    </Mainlayout>
  )
}
