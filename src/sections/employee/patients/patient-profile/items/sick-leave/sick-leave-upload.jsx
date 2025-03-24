import React from 'react';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Card, Stack, Button, Typography } from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFEditor, RHFDatePicker } from 'src/components/hook-form';

export default function SickLeaveUpload({ patient, refetch }) {
  const { t } = useTranslate();
  const { user } = useAuthContext();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { enqueueSnackbar } = useSnackbar();

  const employee = user?.employee?.employee_engagements?.[user.employee.selected_engagement];

  const methods = useForm({
    defaultValues: { start_date: null, end_date: null, sick_leave_description: '' },
    mode: 'all',
    resolver: yupResolver(
      yup
        .object()
        .shape({
          start_date: yup.date().required(t('required field')),
          end_date: yup.date().required(t('required field')),
          sick_leave_description: yup.string(),
        })
    ),
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    try {
      await axiosInstance.post(endpoints.sickleave.all, {
        patient: patient?.patient?._id,
        unit_service_patient: patient?._id,
        unit_services: employee?.unit_service?._id,
        employee: user?.employee?._id,
        Medical_sick_leave_start: data.start_date,
        Medical_sick_leave_end: data.end_date,
        description: data.sick_leave_description,
      });
      methods.reset();
      refetch();
      enqueueSnackbar(t('sick leave added successfully'));
    } catch (e) {
      enqueueSnackbar(curLangAr ? e.arabic_message || e.message : e.message, { variant: 'error' });
    }
  });
  return (
    <FormProvider methods={methods}>
      <Card sx={{ p: 2, mb: 2 }}>
        <Stack gap={2}>
          <Typography variant="subtitle1">{t('sick leave')}</Typography>
          <RHFDatePicker name="start_date" label={t('start date')} />
          <RHFDatePicker name="end_date" label={t('end date')} />
          <RHFEditor
            lang="en"
            name="sick_leave_description"
            label={t('description')}
            sx={{ textTransform: 'lowercase' }}
          />
          <Stack direction="row" justifyContent="flex-end">
            <Button variant="contained" onClick={() => handleSubmit('sick_leave')}>
              {t('save')}
            </Button>
          </Stack>
        </Stack>
      </Card>
    </FormProvider>
  );
}
SickLeaveUpload.propTypes = { patient: PropTypes.object, refetch: PropTypes.func };
