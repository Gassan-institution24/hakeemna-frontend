import { zonedTimeToUtc } from 'date-fns-tz';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useUnitTime } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function NewEditLongHolidays() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { myunitTime } = useUnitTime();

  const { user } = useAuthContext();

  const { control, getValues } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'long_holidays',
  });

  const values = getValues();

  const handleAdd = () => {
    append({
      start_date: null,
      end_date: null,
      description: '',
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  return (
    <>
      <Divider flexItem sx={{ borderStyle: 'solid' }} />
      <Box sx={{ p: 3 }}>
        <Typography
          variant="p"
          sx={{ color: 'text.secondary', mb: 3, fontWeight: '700', textTransform: 'capitalize' }}
        >
          {curLangAr ? 'عطل طويلة' : 'Long Holidays'}:
        </Typography>

        <Stack
          sx={{ mt: 3 }}
          divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />}
          spacing={3}
        >
          {fields.map((item, index) => (
            <Stack
              key={item.id}
              alignItems="flex-start"
              spacing={1.5}
              sx={{ width: { xs: '100%', md: 'auto' } }}
            >
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                sx={{ width: { xs: '100%', md: 'auto' } }}
              >
                <RHFTextField
                  lang="ar"
                  size="small"
                  name={`long_holidays[${index}].description`}
                  label={t('description')}
                  // sx={{ flex: 2 }}
                />
                <Controller
                  name={`long_holidays[${index}].start_date`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label={t('start date')}
                      // sx={{ flex: 1 }}
                      value={myunitTime(values.long_holidays[index].start_date)}
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
                          size: 'small',
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name={`long_holidays[${index}].end_date`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label={t('end date')}
                      // sx={{ flex: 1 }}
                      value={myunitTime(values.long_holidays[index].end_date)}
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
                          size: 'small',
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
                <IconButton
                  size="small"
                  color="error"
                  sx={{ justifySelf: 'flex-end', alignSelf: 'flex-end', width: 35 }}
                  onClick={() => handleRemove(index)}
                >
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Stack>
            </Stack>
          ))}
        </Stack>

        <Divider sx={{ mt: 3, mb: 1, borderStyle: 'dashed' }} />

        <Stack
          spacing={1}
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-end', md: 'center' }}
        >
          <Button
            size="small"
            color="primary"
            startIcon={<Iconify icon="tdesign:plus" />}
            sx={{ padding: 1 }}
            onClick={handleAdd}
          >
            {curLangAr ? 'إضافة عطل طويلة' : 'add long holiday'}
          </Button>
        </Stack>
      </Box>
    </>
  );
}
