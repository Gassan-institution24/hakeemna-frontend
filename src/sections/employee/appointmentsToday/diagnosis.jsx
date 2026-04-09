import React from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  Button,
  Dialog,
  MenuItem,
  TextField,
  DialogTitle,
  Autocomplete,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetdiagnosis, useGetEntranceDiagnosis } from 'src/api';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

export default function Diagnosis({ Entrance }) {
  const { user } = useAuthContext();
  const dialog = useBoolean();
  const { diagnosisData } = useGetdiagnosis();
  const { EntranceDiagnosis } = useGetEntranceDiagnosis(Entrance?._id);
  console.log('EntranceDiagnosis', Entrance);
  const { t } = useTranslate();
  // ✅ validation
  const schema = Yup.object().shape({
    primary_diagnosis: Yup.object().required('Primary diagnosis is required'),
    secondary_diagnosis: Yup.object().nullable(),
    level: Yup.string(),
    note: Yup.string(),
  });

  const defaultValues = {
    primary_diagnosis: null,
    secondary_diagnosis: null,
    level: 'medium',
    note: '',
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { handleSubmit, setValue, watch, reset } = methods;
  // ✅ submit
  const onSubmit = async (data) => {
    try {
      const payload = {
        primary_diagnosis: data.primary_diagnosis?._id,
        secondary_diagnosis: data.secondary_diagnosis?._id,
        appointment: Entrance?.appointmentId,
        entrance: Entrance?._id,
        unit_service_patient: Entrance?.unit_service_patient,
        patient: Entrance?.patient?._id,
        given_by: user?._id,
        level: data.level,
        note: data.note,
      };

      await axiosInstance.post('/api/patient-diagnosis', payload);

      enqueueSnackbar('Diagnosis added successfully', {
        variant: 'success',
      });

      dialog.onFalse();
      reset();
    } catch (error) {
      enqueueSnackbar('Error saving diagnosis', {
        variant: 'error',
      });
    }
  };

  return (
    <>
 
      {/* ✅ Button */}
      <Button variant="outlined" color="success" onClick={dialog.onTrue} sx={{ m: 2 }}>
        {t('Add Diagnosis')}
        <Iconify icon="mingcute:add-line" />
      </Button>

   {EntranceDiagnosis  && ( <div>{t('Existing Diagnosis')}:</div> )}
      {/* ✅ Dialog */}
      <Dialog open={dialog.value} onClose={dialog.onFalse}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{t('Add Diagnosis')}</DialogTitle>

          <DialogContent sx={{ width: 400 }}>
            {/* 🔥 Primary */}
            <Autocomplete
              options={diagnosisData || []}
              value={watch('primary_diagnosis') || null}
              onChange={(e, newValue) =>
                setValue('primary_diagnosis', newValue, {
                  shouldValidate: true,
                })
              }
              getOptionLabel={(option) => option.name || ''}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => (
                <TextField {...params} label={t('Primary Diagnosis')} sx={{ my: 2 }} />
              )}
            />

            {/* 🔥 Secondary */}
            <Autocomplete
              options={diagnosisData || []}
              value={watch('secondary_diagnosis') || null}
              onChange={(e, newValue) =>
                setValue('secondary_diagnosis', newValue, {
                  shouldValidate: true,
                })
              }
              getOptionLabel={(option) => option.name || ''}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => (
                <TextField {...params} label={t('Secondary Diagnosis')} sx={{ mb: 2 }} />
              )}
            />

            {/* 🔥 Level */}
            <TextField
              select
              label={t('Level')}
              value={watch('level')}
              onChange={(e) => setValue('level', e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="low">{t('Low')}</MenuItem>
              <MenuItem value="medium">{t('Medium')}</MenuItem>
              <MenuItem value="high">{t('High')}</MenuItem>
              <MenuItem value="critical">{t('Critical')}</MenuItem>
            </TextField>

            {/* 🔥 Note */}
            <RHFTextField name="note" label={t('Doctor Note')} multiline rows={3} />
          </DialogContent>

          <DialogActions>
            <Button onClick={dialog.onFalse}>{t('Cancel')}</Button>
            <Button type="submit" variant="contained">
              {t('Save')}
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
}

Diagnosis.propTypes = {
  Entrance: PropTypes.object,
};
