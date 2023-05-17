import { Grid, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { Mainlayout } from '../layouts'
import ManTop from '../../public/assets/home/manTop'
import { Colors, Fonts } from '../styles/styleGuides'
import { HomePagesStyles } from '../styles/pages/homePagesStyles'

export default function Home() {
  const { t } = useTranslation('common')

  return (
    <div data-testid='homePage' className='root' style={HomePagesStyles.content}>
      <Grid direction='column' container justifyContent='center' alignItems='center'>
        <Grid item data-testid='homePageIcon'>
          <ManTop />
        </Grid>
        <Grid item>
          <Typography variant='h3' sx={[Fonts.h3, Colors.system.black]} data-testid='homePageIntro'>
            {t('intro', { ns: 'common' })}
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
}

Home.getLayout = function getLayout(home) {
  return (
    <Mainlayout>
      {home}
    </Mainlayout>
  )
}
