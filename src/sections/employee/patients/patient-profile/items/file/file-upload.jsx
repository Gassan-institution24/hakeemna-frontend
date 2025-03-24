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

import { RHFEditor, RHFUpload } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';

export default function PatientFileUpload({ patient, refetch }) {
  const { t } = useTranslate();
  const { user } = useAuthContext();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { enqueueSnackbar } = useSnackbar();

  const employee = user?.employee?.employee_engagements?.[user.employee.selected_engagement];

  const validationSchema = yup
    .object()
    .shape({
      patient_record_file: yup.mixed().nullable(),
      patient_record_description: yup.string().required(t('required field')),
    });

  const methods = useForm({
    defaultValues: { patient_record_file: null, patient_record_description: '' },
    mode: 'all',
    resolver: yupResolver(validationSchema),
  });

  const handleDrop = (acceptedFile, name) => {
    const newFile = acceptedFile;
    methods.setValue(name, newFile);
  };

  const handleSubmit = methods.handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      if (patient?.patient?._id) {
        formData.append('patient', patient?.patient?._id);
      }
      if (patient?._id) {
        formData.append('unit_service_patient', patient?._id);
      }
      formData.append('unit_service', employee?.unit_service?._id);
      formData.append('employee', user?.employee?._id);
      formData.append('description', data.patient_record_description);
      data.patient_record_file?.forEach((one, idx) => {
        formData.append(`file[${idx}]`, one);
      });
      await axiosInstance.post(endpoints.doctorreport.all, formData);
      methods.reset();
      refetch();
      enqueueSnackbar(t('patient record added successfully'));
    } catch (e) {
      enqueueSnackbar(curLangAr ? e.arabic_message || e.message : e.message, { variant: 'error' });
    }
  });
  return (
    <FormProvider methods={methods}>
      <Card sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1">{t('patient record')}</Typography>
        <RHFEditor
          lang="en"
          name="patient_record_description"
          label={t('description')}
          sx={{ mb: 2, mt: 2, textTransform: 'lowercase' }}
        />
        <RHFUpload
          multiple
          fullWidth
          name="patient_record_file"
          margin="dense"
          sx={{ mb: 2 }}
          variant="outlined"
          onDrop={(file) => handleDrop(file, 'patient_record_file')}
        />
        <Stack direction="row" justifyContent="flex-end">
          <Button variant="contained" onClick={() => handleSubmit('patient_record')}>
            {t('save')}
          </Button>
        </Stack>
      </Card>
    </FormProvider>
  );
}
PatientFileUpload.propTypes = { patient: PropTypes.object, refetch: PropTypes.func };
