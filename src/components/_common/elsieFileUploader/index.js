import { Grid, TextField, Button, Typography } from '@mui/material'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Buttons, Colors, Fonts, TextFields } from '../../../styles/styleGuides'
import { ElsieFileUploaderStyles } from '../../../styles/_common/elsieFileUploader'

export const ElsieFileUploader = ({ handleSubmit }) => {
  const { t } = useTranslation('common')
  const [name, setName] = useState('')

  const handleUpload = useCallback((event) => {
    const file = event?.target?.files[0]
    if (!file) {
      return
    }

    setName(file.name)
    handleSubmit(file)
  }, [])

  return (
    <Grid direction='row' container justifyContent='flex-start' alignItems='center' data-testid='elsieFileUploader' sx={ElsieFileUploaderStyles.root} columns={14}>
      <Grid item xs={11} md={8} lg={5} >
        <TextField
          disabled={name.length === 0}
          fullWidth
          value={name}
          id='elsieFileUploaderInput'
          data-testid='elsieFileUploaderInput'
          label={t('elsieFileUploaderLabel', { ns: 'common' })}
          sx={TextFields.systemGrey1}
          variant='filled'
          InputLabelProps={TextFields.systemGrey1InputLabel}
        />
      </Grid>
      <Grid item xs={4}>
        <Button
          sx={[Buttons.elsieGoldTransparent, ElsieFileUploaderStyles.uploadFileBtn]}
          disableRipple
          variant='outlined'
          component='label'
          data-testid='elsieFileUploaderUploadBtn'
        >
          <Typography variant='h3' sx={[Fonts.subHeading1, Colors.elsieAdmin.primary.main]}>
            {t('browser', { ns: 'common' })}
          </Typography>
          <input
            type='file'
            accept='.csv'
            hidden
            onChange={handleUpload}
          />
        </Button>
      </Grid>
    </Grid>
  )
}
