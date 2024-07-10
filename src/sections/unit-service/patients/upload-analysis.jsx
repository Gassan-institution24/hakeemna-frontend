import React from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Dialog from '@mui/material/Dialog';
import { Box, Button } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import axios, { endpoints } from 'src/utils/axios';

import { useGetAnalyses } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFUpload, RHFTextField, RHFMultiSelect } from 'src/components/hook-form';

export default function UploadAnalysis({ open, onClose, refetch, analysisData }) {
  const { user } = useAuthContext();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { enqueueSnackbar } = useSnackbar();

  const { analysesData } = useGetAnalyses();

  const oldMedicalReportsSchema = Yup.object().shape({
    file: Yup.mixed(),
    name: Yup.string().required('File name is required'),
    note: Yup.string().nullable(),
    analysis: Yup.array(),
    appointment: Yup.string().nullable(),
  });

  const defaultValues = {
    file: null,
    name: '',
    note: '',
    patient: analysisData?.patient,
    appointment: analysisData?.appointment,
    unit_service:
      user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service._id,
    employee: user?.employee?.employee_engagements?.[user.employee.selected_engagement]?._id,
    analysis: [],
  };

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(oldMedicalReportsSchema),
    defaultValues,
  });

  const {
    setValue,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleDrop = (acceptedFile) => {
    const newFile = acceptedFile;
    setValue('file', newFile);
  };

  const onSubmit = async (data) => {
    const dataToSubmit = { ...data, type: 'analysis', description: data.note }
    const formData = new FormData();
    Object.keys(dataToSubmit).forEach((key) => {
      if (Array.isArray(dataToSubmit[key])) {
        dataToSubmit[key].forEach((item) => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, dataToSubmit[key]);
      }
    });
    try {
      // await axios.post(endpoints.patientMedicalAnalysis.all, formData);
      await axios.post(endpoints.medicalreports.all, formData);
      enqueueSnackbar('uploaded sucessfully');
      onClose();
      reset();
      refetch();
    } catch (error) {
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ mb: 2 }}>{t('upload medical analysis')}</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <RHFTextField lang="en" name="name" label={t('File name')} sx={{ mb: 2 }} />

            {/* <RHFMultiSelect
              label={t('analyses types')}
              fullWidth
              name="analysis"
              options={analysesData}
              PaperPropsSx={{ textTransform: 'capitalize' }}
              sx={{ mb: 2 }}
            /> */}

            <RHFUpload
              multiple
              fullWidth
              name="file"
              sx={{ mb: 2 }}
              variant="outlined"
              onDrop={handleDrop}
            />

            <RHFTextField lang="en" name="note" label={t('More information')} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="inherit">
            {t('Cancel')}
          </Button>
          <Button type="submit" loading={isSubmitting} variant="contained">
            {t('Upload')}
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
UploadAnalysis.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  refetch: PropTypes.func,
  analysisData: PropTypes.object,
};
