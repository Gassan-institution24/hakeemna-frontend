import PropTypes from 'prop-types';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useNewScreen } from 'src/hooks/use-new-screen';

import { useUnitTime } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetUSActiveWorkShifts, useGetEmployeeActiveWorkGroups } from 'src/api';

import Iconify from 'src/components/iconify';
import { RHFSelect, RHFTextField, RHFMultiCheckbox } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function NewEditDetails({ appointmentConfigData, setAppointTime }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { id } = useParams();

  const weekDays = [
    { value: 'saturday', label: t('Saturday') },
    { value: 'sunday', label: t('Sunday') },
    { value: 'monday', label: t('Monday') },
    { value: 'tuesday', label: t('Tuesday') },
    { value: 'wednesday', label: t('Wednesday') },
    { value: 'thursday', label: t('Thursday') },
    { value: 'friday', label: t('Friday') },
  ];

  const { control, watch, trigger } = useFormContext();

  const values = watch();

  const { myunitTime } = useUnitTime();

  const { user } = useAuthContext();

  const { handleAddNew } = useNewScreen();

  const { workGroupsData } = useGetEmployeeActiveWorkGroups(id);
  const { workShiftsData } = useGetUSActiveWorkShifts(
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
                value={myunitTime(values.start_date)}
                onChange={(newValue) => {
                  const selectedTime = zonedTimeToUtc(
                    newValue,
                    user?.employee?.employee_engagements[user?.employee.selected_engagement]
                      ?.unit_service?.country?.time_zone ||
                      Intl.DateTimeFormat().resolvedOptions().timeZone
                  );
                  field.onChange(selectedTime);
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
                value={myunitTime(values.end_date)}
                onChange={(newValue) => {
                  const selectedTime = zonedTimeToUtc(
                    newValue,
                    user?.employee?.employee_engagements[user?.employee.selected_engagement]
                      ?.unit_service?.country?.time_zone ||
                      Intl.DateTimeFormat().resolvedOptions().timeZone
                  );
                  field.onChange(selectedTime);
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
            {workShiftsData.map((option, idx) => (
              <MenuItem lang="ar" key={idx} value={option._id}>
                {curLangAr ? option?.name_arabic : option?.name_english}
              </MenuItem>
            ))}
            <Divider />
            <MenuItem
              lang="ar"
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
                fontWeight: 600,
                // color: 'error.main',
              }}
              onClick={() => handleAddNew(paths.unitservice.tables.workshifts.new)}
            >
              <Typography variant="body2" sx={{ color: 'info.main' }}>
                {t('Add new')}
              </Typography>
              <Iconify icon="material-symbols:new-window-sharp" />
            </MenuItem>
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
              workGroupsData?.map((option, idx) => (
                <MenuItem lang="ar" key={idx} value={option._id}>
                  {curLangAr ? option?.name_arabic : option?.name_english}
                </MenuItem>
              ))}
            <Divider />
            <MenuItem
              lang="ar"
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
                fontWeight: 600,
                // color: 'error.main',
              }}
              onClick={() => handleAddNew(paths.unitservice.tables.workgroups.new)}
            >
              <Typography variant="body2" sx={{ color: 'info.main' }}>
                {t('Add new')}
              </Typography>
              <Iconify icon="material-symbols:new-window-sharp" />
            </MenuItem>
          </RHFSelect>
          <RHFTextField
            fullWidth
            step="5"
            name="appointment_time"
            label={t('appointment duration time')}
            type="number"
            onBlur={(event) => {
              setAppointTime(event.target.value);
              trigger('appointment_time');
            }}
            size="small"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Box sx={{ fontSize: '0.8rem' }}>{t('min')}</Box>
                </InputAdornment>
              ),
            }}
          />
          <RHFTextField
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
