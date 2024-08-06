import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

import Link from '@mui/material/Link';
import Dialog from '@mui/material/Dialog';
import Checkbox from '@mui/material/Checkbox';
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

export default function InsurancePage({ user }) {
  const [checkChange, setCheckChange] = useState(false);
  const [Insuranse, setInsuranse] = useState(null); // Start with null
  const { patientInsuranseData } = useGetPatientInsurance(user);
  const { oneInsuranseData } = useGetOneInsurance(Insuranse);
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const { insuranseCosData } = useGetActiveInsuranceCos();
  const { insuranseTypesData } = useGetInsuranceTypes();
  const curLangAr = currentLang.value === 'ar';
  const dialog = useBoolean(false);

  const { enqueueSnackbar } = useSnackbar();

  const insurancesSchema = Yup.object().shape({
    // type: Yup.string().required('Type is required'),
    patient: Yup.string().required('Patient is required'),
    insurance: Yup.string().required('Insurance is required'),
    insurance_client_num: Yup.string().required('Card number is required'),
    agree: Yup.boolean().oneOf([true], 'You must agree to terms'),
    insurance_expiry_time: Yup.date().required('Date is required'),
  });

  const defaultValues = {
    // type: oneInsuranseData?.type?._id || '',
    patient: user?.patient?._id || '',
    insurance: oneInsuranseData?.insurance?._id || '',
    insurance_client_num: oneInsuranseData?.insurance_client_num || '',
    insurance_expiry_time: '',
    agree: oneInsuranseData?.agree || false,
  };

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(insurancesSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  // Update form values when oneInsuranseData changes
  useEffect(() => {
    if (oneInsuranseData) {
      reset({
        type: oneInsuranseData?.type?._id || '',
        patient: user?.patient?._id || '',
        insurance: oneInsuranseData?.insurance?._id || '',
        insurance_client_num: oneInsuranseData?.insurance_client_num || '',
        insurance_expiry_time:  '',
        agree: oneInsuranseData?.agree || false,
      });
    }
  }, [oneInsuranseData, reset, user]);

  const saveFunction = (id) => {
    dialog.onTrue();
    setInsuranse(id); // Save the selected ID
  };

  const updateFunction = async (data) => {
    try {
      await axios.patch(`/api/insurance/data/${Insuranse}`, data); // Use the ID stored in Insuranse
      enqueueSnackbar('Insurance updated successfully', { variant: 'success' });
      dialog.onFalse();
      setCheckChange(!checkChange);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
    }
  };

  const onSubmit = (data) => {
    if (Insuranse) {
      updateFunction(data); // Call updateFunction if an insurance ID is set
    } else {
      // Handle new insurance creation logic here if applicable
      enqueueSnackbar('Please select an insurance card to update.', { variant: 'warning' });
    }
  };

  return (
    <>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {patientInsuranseData?.map((info, key) => (
          <Card key={key} sx={{ borderRadius: 1, width: '75%', mb: 5, bgcolor: '#64a3aa' }}>
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
            <Box sx={{ display: { md: 'flex', xs: 'block' }, margin: 1, gap: 2 }}>
              <Image
                src={info?.patient?.profile_picture}
                sx={{ width: '100px', height: '135px', mb: 1 }}
              />
              <Box>
                <Box sx={{ mb: 1 }}>
                  <Typography sx={{ color: '#e1eeed' }}>{info?.insurance?.name_english}</Typography>
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
                  position: 'relative',
                  right: '-30%',
                  color: '#ddf0ee',
                  '&:hover': {
                    color: 'black',
                  },
                }}
                width={23}
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
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  {...field}
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
            />

            <RHFSelect name="type" label={`${t('Insurance type*')}`} placeholder="Insurance type">
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

            {/* <Box>
              <Controller
                name="agree"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Checkbox
                    {...field}
                    error={!!error}
                    helperText={error?.message}
                    sx={{ ml: '-5px' }}
                  />
                )}
              />
              <Link
                component="button"
                sx={{
                  color: 'text.secondary',
                  typography: 'body2',
                }}
              >
                {t('I agree to the terms and conditions')}
              </Link>
            </Box> */}
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
  user: PropTypes.object,
};
