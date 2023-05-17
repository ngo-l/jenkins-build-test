import { Grid, TextField, Divider, Card, CardContent, Typography, InputAdornment } from '@mui/material'
import { useCallback, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Close } from '@mui/icons-material'
import { DateCalendar, LocalizationProvider, MultiSectionDigitalClock } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { format, set } from 'date-fns'


import { Fonts, TextFields } from '../../../styles/styleGuides'
import { ElsieDateSelectorStyles } from '../../../styles/_common/elsieDateSelector'

export const ElsieDateSelector = ({ selectedTime, setSelectedTime }) => {
  const [isDateTimePicker, setIsDateTimePicker] = useState(false)
  const { t } = useTranslation('common')

  const handleToggle = useCallback((e, value) => {
    setIsDateTimePicker(value)
    e.stopPropagation()
  }, [])

  const current = useMemo(() => {
    return set(new Date(), { minutes: 0 })
  }, [selectedTime])

  const handleChangeDate = useCallback((newValue) => {
    const date = { year: newValue.getFullYear(), month: newValue.getMonth(), date: newValue.getDate() }

    if (!selectedTime) {
      setSelectedTime(set(current, date))
      return
    }
    setSelectedTime(set(selectedTime, date))
  }, [selectedTime, current])

  const handleChangeTime = useCallback((newValue) => {
    const time = { hours: newValue.getHours(), minutes: newValue.getMinutes() }

    if (!selectedTime && current) {
      setSelectedTime(set(current, time))
      return
    }
    setSelectedTime(set(selectedTime, time))
  }, [selectedTime, current])

  return (
    <Grid direction='row' container justifyContent='flex-start' alignItems='center' data-testid='elsieDateSelector' sx={ElsieDateSelectorStyles.root} columns={14}>
      <Grid item xs={11} md={8} lg={5} >
        <TextField
          disabled
          fullWidth
          id='elsieDateSelectorInput'
          data-testid='elsieDateSelectorInput'
          label={t('elsieDateSelectorLabel', { ns: 'common' })}
          sx={TextFields.elsieGold}
          variant='filled'
          value={selectedTime ? format(selectedTime, 'yyyy-MM-dd, hh:mm a') : ''}
          InputLabelProps={TextFields.elsieGoldInputLabel}
          onClick={(e) => handleToggle(e, true)}
          inputProps={{ 'data-testid': 'elsieDateSelectorInputField' }}
          InputProps={{
            endAdornment: isDateTimePicker && (
              <InputAdornment position='end' onClick={(e) => handleToggle(e, false)}>
                <Close sx={ElsieDateSelectorStyles.closeDateTimePickerBtn} />
              </InputAdornment>
            )
          }}
        />
        {isDateTimePicker &&
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Card sx={ElsieDateSelectorStyles.cardRoot} data-testid='elsieDateSelectorMenu'>
              <CardContent sx={ElsieDateSelectorStyles.cardContent}>
                <Grid direction='row' container justifyContent='flex-start' alignItems='stretch'>
                  <Grid item xs='auto'>
                    <DateCalendar
                      views={['day']}
                      defaultValue={selectedTime}
                      value={selectedTime}
                      onChange={(newValue) => handleChangeDate(newValue)}
                      slotProps={{
                        sx: ElsieDateSelectorStyles.dateCalendarSlot
                      }}
                      sx={ElsieDateSelectorStyles.dateCalendar}
                    />
                  </Grid>
                  <Divider sx={ElsieDateSelectorStyles.divider} />
                  <Grid item xs='auto'>
                    <MultiSectionDigitalClock
                      sx={ElsieDateSelectorStyles.timePicker}
                      value={selectedTime}
                      onChange={(newValue) => handleChangeTime(newValue)}
                    />
                  </Grid>
                </Grid>
                <Grid direction='row' container justifyContent='space-between' alignItems='center'>
                  <Grid item  >
                    <Typography variant='h3' sx={[Fonts.subHeading1, ElsieDateSelectorStyles.dateTimePickerBtn]} onClick={() => setSelectedTime(null)} data-testid='elsieDateSelectorClearBtn'>
                      {t('clear', { ns: 'common' })}
                    </Typography>
                  </Grid>
                  <Grid item >
                    <Typography variant='h3' sx={[Fonts.subHeading1, ElsieDateSelectorStyles.dateTimePickerBtn]} onClick={() => setSelectedTime(current)} data-testid='elsieDateSelectorCurrentBtn' >
                      {t('now', { ns: 'common' })}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </LocalizationProvider>
        }
      </Grid>
    </Grid >
  )
}
