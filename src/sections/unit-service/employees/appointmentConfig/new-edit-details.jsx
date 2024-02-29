import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetUSWorkShifts, useGetEmployeeWorkGroups } from 'src/api';

import { RHFSelect, RHFTextField, RHFMultiCheckbox } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function NewEditDetails({ appointmentConfigData, setAppointTime }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const weekDays = [
    { value: 'saturday', label: t('Saturday') },
    { value: 'sunday', label: t('Sunday') },
    { value: 'Monday', label: t('Monday') },
    { value: 'tuesday', label: t('Tuesday') },
    { value: 'wednesday', label: t('Wednesday') },
    { value: 'thursday', label: t('Thursday') },
    { value: 'friday', label: t('Friday') },
  ];

  const { control, getValues } = useFormContext();

  const values = getValues();

  const { user } = useAuthContext();

  const { id } = useParams();

  const { workGroupsData } = useGetEmployeeWorkGroups(id);
  const { workShiftsData } = useGetUSWorkShifts(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id
  );

  return (
    <>
      <Divider flexItem sx={{ borderStyle: 'solid' }} />
      <Stack sx={{ p: 3 }}>
        {/* <Typography
          variant="p"
          sx={{ color: 'text.secondary', mb: 3, fontWeight: '700', textTransform: 'capitalize' }}
        >
          Details:
        </Typography> */}
        <Stack
          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ p: 3, width: { xs: '100%', md: 'auto' } }}
        >
          <Controller
            name="start_date"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                label={`${t('start date')} *`}
                // sx={{ flex: 1 }}
                value={new Date(values.start_date || '')}
                onChange={(newValue) => {
                  field.onChange(newValue);
                }}
                slotProps={{
                  textField: {
                    // size: 'small',
                    fullWidth: true,
                    error: !!error,
                    helperText: error?.message,
                  },
                }}
              />
            )}
          />
          <Controller
            name="end_date"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                label={t('end date')}
                // sx={{ flex: 1 }}
                value={new Date(values.end_date || '')}
                onChange={(newValue) => {
                  field.onChange(newValue);
                }}
                slotProps={{
                  textField: {
                    // size: 'small',
                    fullWidth: true,
                    error: !!error,
                    helperText: error?.message,
                  },
                }}
              />
            )}
          />
        </Stack>
        <Stack
          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ px: 3, pb: 3, width: { xs: '100%', md: 'auto' } }}
        >
          <RHFSelect
            size="small"
            name="work_shift"
            label={`${t('work shift')} *`}
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
            disabled={Boolean(appointmentConfigData)}
          >
            {workShiftsData.map((option) => (
              <MenuItem key={option._id} value={option._id}>
                {curLangAr ? option?.name_arabic : option?.name_english}
              </MenuItem>
            ))}
          </RHFSelect>
          <RHFSelect
            size="small"
            name="work_group"
            label={`${t('work group')} *`}
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
            disabled={Boolean(appointmentConfigData)}
          >
            {workGroupsData &&
              workGroupsData?.map((option) => (
                <MenuItem key={option._id} value={option._id}>
                  {curLangAr ? option?.name_arabic : option?.name_english}
                </MenuItem>
              ))}
          </RHFSelect>
          <Controller
            name="appointment_time"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                fullWidth
                label={t('appointment duration time')}
                type="number"
                lang="ar"
                value={field.value === 0 ? '' : field.value}
                onChange={(event) => {
                  field.onChange(Number(event.target.value));
                  setAppointTime(event.target.value);
                }}
                error={!!error}
                size="small"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box lang="ar" sx={{ fontSize: '0.8rem' }}>
                        {t('min')}
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <RHFTextField
            lang="ar"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ fontSize: '0.8rem' }}>{curLangAr ? 'لبعد' : 'for the next'}</Box>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Box sx={{ fontSize: '0.8rem' }}>{curLangAr ? 'أيام' : 'days'}</Box>
                </InputAdornment>
              ),
            }}
            name="config_frequency"
            label={t('configuration frequency')}
            type="number"
            inputProps={{ min: 0, max: 30, textAlign: 'center' }}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
        <Typography
          variant="p"
          sx={{ color: 'text.secondary', mb: 3, fontWeight: '700', textTransform: 'capitalize' }}
        >
          {curLangAr ? 'العطل الأسبوعية' : 'Weekly Days Off'}:
        </Typography>
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ p: 3 }}>
          <RHFMultiCheckbox
            size="small"
            name="weekend"
            options={weekDays}
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                md: 'repeat(7, 1fr)',
                sm: 'repeat(4, 1fr)',
                xs: 'repeat(2, 1fr)',
              },
            }}
          />
        </Stack>
      </Stack>
    </>
  );
}

NewEditDetails.propTypes = {
  appointmentConfigData: PropTypes.object,
  setAppointTime: PropTypes.func,
};
