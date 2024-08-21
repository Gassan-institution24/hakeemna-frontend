import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { MenuItem, Typography } from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetAppointmentTypes } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFCheckbox, RHFTimePicker } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    appointment_type: Yup.string().required(t('required field')),
    service_types: Yup.array().required(t('required field')),
    online_available: Yup.bool().required(t('required field')),
    start_time: Yup.date().required(t('required field')),
  });
  const defaultValues = useMemo(
    () => ({
      appointment_type: currentTable?.appointment_type?._id || null,
      start_time: currentTable?.start_time || null,
      online_available: currentTable?.online_available || true,
      service_types: currentTable?.service_types?.map((one) => one?._id) || [],
    }),
    [currentTable]
  );

  const { appointmenttypesData } = useGetAppointmentTypes();

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (Object.keys(errors).length) {
      Object.keys(errors).forEach((key, idx) =>
        enqueueSnackbar(`${key}: ${errors?.[key]?.message || 'error'}`, { variant: 'error' })
      );
    }
  }, [errors, enqueueSnackbar]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentTable) {
        await axiosInstance.patch(endpoints.appointments.one(currentTable._id), data);
      } else {
        await axiosInstance.post(endpoints.appointments.all, data);
      }
      reset();
      enqueueSnackbar(currentTable ? t('update success!') : t('create success!'));
      // router.push(paths.unitservice.tables.workshifts.root);
    } catch (error) {
      // error emitted in backend
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
      console.error(error);
    }
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid xs={12} maxWidth="md">
        <Card sx={{ p: 3 }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFSelect name="appointment_type" label={t('appointment type')}>
              {appointmenttypesData?.map((option, idx) => (
                <MenuItem lang="ar" key={idx} value={option._id}>
                  {curLangAr ? option?.name_arabic : option?.name_english}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFTimePicker name="start_time" label={t('start time')} />
            <RHFCheckbox
              sx={{ ml: 3, mt: 1 }}
              name="online_available"
              label={<Typography sx={{ fontSize: 12 }}>{t('online avaliable')}</Typography>}
            />
          </Box>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" tabIndex={-1} variant="contained" loading={isSubmitting}>
              {!currentTable ? t('create') : t('save changes')}
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>
    </FormProvider>
  );
}

TableNewEditForm.propTypes = {
  currentTable: PropTypes.object,
};
