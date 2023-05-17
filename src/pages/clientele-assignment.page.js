import { useCallback } from 'react'
import { Typography, Grid, Button } from '@mui/material'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

import { getClienteleAssignmentTemplate } from '../api/RESTful'
import { ClienteleAssignmentTable } from '../components/clienteleAssignment'
import { Mainlayout } from '../layouts'
import { ClienteleAssignmentPageStyles } from '../styles/pages/clienteleAssignmentPageStyles'
import { Fonts, Colors, Buttons } from '../styles/styleGuides'

export default function ClienteleAssignmentPage() {
  const { t } = useTranslation('clienteleAssignment')
  const router = useRouter()

  const handleDownloadTemplate = useCallback(async () => { await getClienteleAssignmentTemplate() }, [])
  const handleNewScedule = useCallback(() => { router.push('/clientele-assignment/new-schedule') }, [])

  return (
    <div data-testid='clienteleAssignmentPage' className='root'>
      <Grid container direction='row' justifyContent='center' alignItems='center' >
        <Grid container direction='row' justifyContent='space-between' alignItems='center'>
          <Grid item data-testid='clienteleAssignmentTitle'>
            <Typography variant='h3' sx={Fonts.h3}>
              {t('name', { ns: 'clienteleAssignment' })}
            </Typography>
          </Grid>
          <Grid item>
            <Grid container direction='row' alignItems='center'>
              <Grid item data-testid='downloadAssignmentTemplateBtn' sx={ClienteleAssignmentPageStyles.downloadAssignmentTemplateBtn} onClick={handleDownloadTemplate}>
                <Typography variant='h3' sx={Fonts.subHeading1}>
                  {t('downloadTemplate', { ns: 'clienteleAssignment' })}
                </Typography>
              </Grid>
              <Grid item data-testid='createClienteleAssignmentScheduleBtn'>
                <Button sx={Buttons.elsieGold} disableRipple onClick={handleNewScedule}>
                  <Typography variant='h3' sx={[Fonts.subHeading1, Colors.system.white]}>
                    {t('newSchedule', { ns: 'clienteleAssignment' })}
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sx={ClienteleAssignmentPageStyles.clienteleAssignmentPageTable}>
          <ClienteleAssignmentTable />
        </Grid>
      </Grid>
    </div>
  )
}

ClienteleAssignmentPage.getLayout = function getLayout(home) {
  return (
    <Mainlayout>
      {home}
    </Mainlayout>
  )
}
