import { Grid, Typography, Button, Card, CardContent } from '@mui/material'
import { useTranslation, Trans } from 'react-i18next'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'

import { ElsieFileUploader, ElsieDateSelector, ElsieAlert } from '../../components/_common'
import { Mainlayout } from '../../layouts'
import { ProvideSchedule, useSchedule } from '../../hook/useSchedule'
import { Fonts, Buttons, Colors } from '../../styles/styleGuides'
import { ClienteleAssignmentNewSchedulePageStyles } from '../../styles/pages/clienteleAssignmentNewSchedulePageStyles'

//Todo add setSchedule Time
export default function ClienteleAssignmentNewSchedulePage() {
  const { t } = useTranslation(['clienteleAssignment', 'common'])
  const [isAlert, setIsAlert] = useState(false)
  const router = useRouter()
  const { selectedTime, setSelectedTime, uploadedFile, setUploadedFile, uploadScheduleFile, addSchedule } = useSchedule()

  const handleDiscard = useCallback(() => { router.push('/clientele-assignment') }, [])
  const handleOpenAlert = useCallback(() => { setIsAlert(true) }, [])
  const handleCloseAlert = useCallback(() => { setIsAlert(false) }, [])
  const handleSave = useCallback(async () => {
    setIsAlert(false)
    await uploadScheduleFile()
  }, [])

  return (
    <div data-testid='clienteleAssignmentNewSchedulePage' className='root'>
      <Grid container direction='row' justifyContent='center' alignItems='center' >
        {/* <Grid container direction='row' justifyContent='flex-start' alignItems='center'>
          <Grid item data-testid='backBtn' sx={ClienteleAssignmentNewSchedulePageStyles.backBtn} onClick={handleDiscard}>
            <Typography variant='h3' sx={Fonts.subHeading1}>
              {t('back', { ns: 'common' })}
            </Typography>
          </Grid>
        </Grid> */}
        <Grid container direction='row' justifyContent='space-between' alignItems='center'>
          <Grid item data-testid='clienteleAssignmentTitle'>
            <Typography variant='h4' sx={Fonts.h4}>
              {t('newAssignment', { ns: 'clienteleAssignment' })}
            </Typography>
          </Grid>
          <Grid item>
            <Grid container direction='row' alignItems='center'>
              {/* <Grid item data-testid='discardClienteleAssignmentScheduleBtn' sx={ClienteleAssignmentNewSchedulePageStyles.discardClienteleAssignmentScheduleBtn} onClick={handleDiscard}>
                <Typography variant='h3' sx={Fonts.subHeading1}>
                  {t('discard', { ns: 'common' })}
                </Typography>
              </Grid> */}
              <Grid item data-testid='saveClienteleAssignmentScheduleBtn'>
                <Button sx={Buttons.elsieGold} disableRipple onClick={handleOpenAlert} disabled={!(uploadedFile && selectedTime)}>
                  <Typography variant='h3' sx={[Fonts.subHeading1, Colors.system.white]}>
                    {t('upload', { ns: 'common' })}
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sx={ClienteleAssignmentNewSchedulePageStyles.clienteleAssignmentContent} data-testid='clienteleAssignmentContent'>
          <Card sx={ClienteleAssignmentNewSchedulePageStyles.cardRoot} data-testid='clienteleAssignmentTable'>
            <CardContent sx={ClienteleAssignmentNewSchedulePageStyles.cardContent}>
              <Grid container direction='row' justifyContent='flex-start' alignItems='center' >
                <ElsieFileUploader handleSubmit={setUploadedFile} />
                {/* <ElsieDateSelector selectedTime={selectedTime} setSelectedTime={setSelectedTime} /> */}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <ElsieAlert
        isOpen={isAlert}
        handleClose={handleCloseAlert}
        title={t('uploadAssignmentAlert.title', { ns: 'clienteleAssignment' })}
        cancelBtn={
          () =>
            <Button onClick={handleCloseAlert} sx={[Buttons.elsieSuccessTransparent, Colors.success.main, Fonts.body1]} data-testid='elsieAlertCancelBtn' >
              {t('uploadAssignmentAlert.cancel', { ns: 'clienteleAssignment' })}
            </Button>
        }
        confirmBtn={
          () =>
            <Button onClick={handleSave} sx={[Buttons.elsieSuccess, Colors.system.white, Fonts.body1]} data-testid='elsieAlertCancelBtn' >
              {t('uploadAssignmentAlert.upload', { ns: 'clienteleAssignment' })}
            </Button>
        }
      >
        <Trans
          t={t}
          i18nKey='uploadAssignmentAlert.content'
          components={{
            bold: <Typography variant='span' sx={Fonts.subHeading1} />,
          }}
        />
      </ElsieAlert>
    </div >
  )
}

ClienteleAssignmentNewSchedulePage.getLayout = function getLayout(home) {
  return (
    <Mainlayout>
      <ProvideSchedule>
        {home}
      </ProvideSchedule>
    </Mainlayout>
  )
}
