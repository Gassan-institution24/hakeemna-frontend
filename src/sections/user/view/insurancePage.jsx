import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

import Dialog from '@mui/material/Dialog';
import { DatePicker } from '@mui/x-date-pickers';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Box, Card, Button, MenuItem, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axios from 'src/utils/axios';
import { fMonth } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';
import {
  useGetOneInsurance,
  useGetInsuranceTypes,
  useGetPatientInsurance,
  useGetActiveInsuranceCos,
} from 'src/api';

import Iconify from 'src/components/iconify';
import Image from 'src/components/image/image';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';

export default function InsurancePage({ patientId }) {
  const [Insuranse, setInsuranse] = useState();
  const { patientInsuranseData, refetch } = useGetPatientInsurance(patientId);
  const { oneInsuranseData } = useGetOneInsurance(Insuranse);
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const { insuranseCosData } = useGetActiveInsuranceCos();
  const { insuranseTypesData } = useGetInsuranceTypes();
  const curLangAr = currentLang.value === 'ar';
  const dialog = useBoolean(false);

  const { enqueueSnackbar } = useSnackbar();

  const insurancesSchema = Yup.object().shape({
    type: Yup.string().required('Type is required'),
    patient: Yup.string().required('Patient is required'),
    insurance: Yup.string().required('Insurance is required'),
    insurance_client_num: Yup.string().required('Card number is required'),
    insurance_expiry_time: Yup.mixed().required('Date is required'),
  });

  const defaultValues = {
    type: oneInsuranseData?.type?._id || '',
    patient: patientId || '',
    insurance: oneInsuranseData?.insurance?._id || '',
    insurance_client_num: oneInsuranseData?.insurance_client_num || '',
    insurance_expiry_time: null,
  };

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(insurancesSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;
  const saveFunction = (id) => {
    dialog.onTrue();
    setInsuranse(id);
  };

  const onSubmit = async (data) => {
    try {
      await axios.patch(`/api/insurance/data/${Insuranse}`, data);
      enqueueSnackbar('Insurance updated successfully', { variant: 'success' });
      dialog.onFalse();
      refetch();
    } catch (error) {
      console.error('Error during API call:', error);
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
    }
  };
  useEffect(() => {
    if (oneInsuranseData) {
      reset({
        type: oneInsuranseData?.type?._id || '',
        patient: patientId || '',
        insurance: oneInsuranseData?.insurance?._id || '',
        insurance_client_num: oneInsuranseData?.insurance_client_num || '',
        insurance_expiry_time: null,
      });
    }
  }, [oneInsuranseData, reset, patientId]);

  return (
    <>
      <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr', xs: '1fr' } }}>
        {patientInsuranseData?.map((info, key) => (
          <Card key={key} sx={{ borderRadius: 1, width: '60%', mb: 5, bgcolor: '#64a3aa' }}>
            <Box
              sx={{
                bgcolor: '#ddf0ee',
                borderRadius: 1,
                width: '100%',
                padding: 0.7,
                margin: 1.5,
                position: 'relative',
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Iconify sx={{ color: '#64a3aa' }} icon="akar-icons:health" /> &nbsp;&nbsp;
              <Typography sx={{ color: '#64a3aa', fontWeight: 600, fontSize: 16 }}>
                {t('Insurance Card')}
              </Typography>
            </Box>
            <Box
              sx={{
                display: { md: 'grid', xs: 'block' },
                gridTemplateColumns: '1fr 1fr 1fr',
                margin: 1,
                gap: 2,
              }}
            >
              <Image
                src={info?.patient?.profile_picture}
                sx={{ width: '100px', height: '135px', mb: 1 }}
              />
              <Box>
                <Box sx={{ mb: 1 }}>
                  <Typography sx={{ color: '#e1eeed' }}>
                    {curLangAr ? info?.insurance?.name_arabic : info?.insurance?.name_english}
                  </Typography>
                  <Typography sx={{ color: '#e1eeed' }}>
                    {info?.patient?.name_english} {info?.patient?.last_name}
                  </Typography>
                  <Typography sx={{ color: '#e1eeed' }}>{info?.type?.Coverage_name}</Typography>
                  <Typography sx={{ color: '#e1eeed' }}>{info?.insurance_client_num}</Typography>
                  <Typography sx={{ color: '#e1eeed' }}>
                    {' '}
                    {t('Expiry date')} {fMonth(info?.insurance_expiry_time)}
                  </Typography>
                </Box>
              </Box>
              <Iconify
                icon="mi:options-vertical"
                sx={{
                  color: 'white',
                  ml: 10,
                }}
                width={25}
                onClick={() => saveFunction(info?._id)}
              />
            </Box>
          </Card>
        ))}
      </Box>

      <Dialog open={dialog.value} onClose={dialog.onFalse}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ position: 'relative', top: '10px' }}>
            {t('Add your insurance cards here')}
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: 'red', mb: 5, fontSize: 14 }}>
              {t('The attached card must be present and valid')}
            </Typography>
            <Controller
              name="insurance_expiry_time"
              control={control}
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <DatePicker
                  value={value || null} // Ensure value is null when undefined
                  onChange={onChange} // Pass the onChange handler
                  onBlur={onBlur}
                  sx={{ mb: 3 }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!error,
                      helperText: error?.message,
                      label: `${t('Expiry date*')}`,
                    },
                  }}
                />
              )}
            />

            <RHFSelect
              name="insurance"
              label={`${t('Insurance company*')}`}
              placeholder="Insurance"
              sx={{ mb: 2 }}
            >
              <MenuItem
                value=""
                disabled
                sx={{
                  display: 'none',
                }}
              />
              {insuranseCosData?.map((option, key) => (
                <MenuItem
                  key={key}
                  sx={{ mx: 1, borderRadius: 0.75, typography: 'body2' }}
                  value={option._id}
                >
                  {curLangAr ? option?.name_arabic : option?.name_english}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFTextField
              name="insurance_client_num"
              label={t('Insurance card number')}
              placeholder={t('Insurance card number')}
              sx={{ mb: 2 }}
            />

            <RHFSelect
              name="type"
              label={`${t('Insurance type*')}`}
              placeholder="Insurance type"
              sx={{ mb: 2 }}
            >
              <MenuItem
                value=""
                disabled
                sx={{
                  display: 'none',
                }}
              />
              {insuranseTypesData?.map((option, key) => (
                <MenuItem
                  key={key}
                  sx={{ mx: 1, borderRadius: 0.75, typography: 'body2' }}
                  value={option._id}
                >
                  {curLangAr ? option?.Coverage_name_ar : option?.Coverage_name}
                </MenuItem>
              ))}
            </RHFSelect>
          </DialogContent>
          <DialogActions>
            <Button color="inherit" onClick={dialog.onFalse}>
              {t('Cancel')}
            </Button>
            <Button type="submit" loading={isSubmitting} variant="contained">
              {t('Upload')}
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
}

InsurancePage.propTypes = {
  patientId: PropTypes.object,
};
