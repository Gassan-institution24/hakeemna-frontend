import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { matchIsValidTel } from 'mui-tel-input';
import { yupResolver } from '@hookform/resolvers/yup';

import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Link, Grid, Alert, Stack, Typography } from '@mui/material';

import axiosInstance from 'src/utils/axios';

import { useLocales, useTranslate } from 'src/locales';

import FormProvider, { RHFTextField, RHFPhoneNumber } from 'src/components/hook-form';

import TrainingVideo from './images/TrainigVideo.mp4';
import TrainigVideoAr from './images/TrainigVideoAr.mp4';

export default function Training() {
  const { t } = useTranslate();
  const [errorMsg, setErrorMsg] = useState('');
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const RegisterSchema = Yup.object().shape({
    full_name: Yup.string().required('English name is required'),
    topic: Yup.string().required('Topic name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    mobile_num1: Yup.string()
      .required('Mobile number is required')
      .test('is-valid-phone', t('Invalid phone number'), (value) => matchIsValidTel(value)),
  });

  const defaultValues = {
    full_name: '',
    topic: '',
    email: '',
    mobile_num1: '',
  };

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axiosInstance.post('/api/training', data);
      enqueueSnackbar(t('Thank you, will talk to you as soon as possible'), { variant: 'success' });
      reset();
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
      <Typography variant="h4" sx={{ textAlign: 'center' }}>
        {t('Contact us to register for the training course')}
      </Typography>
      <Box sx={{ width: '100%', height: 0, paddingBottom: '56.25%', position: 'relative' }}>
        <video
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          loop
          autoPlay
          muted
        >
          <source src={curLangAr ? TrainigVideoAr : TrainingVideo} type="video/mp4" />
          <track
            kind="captions"
            srcLang="en"
            src="path/to/your/captions.vtt"
            label="English"
            default
          />
        </video>
      </Box>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        color: 'text.secondary',
        mt: 2.5,
        typography: 'caption',
        textAlign: 'center',
      }}
    >
      {t('By signing up, I agree to ')}
      <Link underline="always" color="text.primary">
        {t('Terms of Service ')}
      </Link>
      {t('and ')}
      <Link underline="always" color="text.primary">
        {t('Privacy Policy')}
      </Link>
      .
    </Typography>
  );

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Typography variant="h4" sx={{ mb: 2.5, textAlign: 'center' }}>
        {t('How would you like to connect')}
      </Typography>
      <Stack spacing={2.5}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
        <RHFTextField name="full_name" label={t('Full Name')} />
        <RHFTextField name="topic" label={t('Topic')} />
        <RHFTextField name="email" label={t('Email address')} />
        <RHFPhoneNumber name="mobile_num1" label={t('Mobile number')} />
        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          {t('send')}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );

  return (
    <Grid
      container
      component="main"
      sx={{
        minHeight: '62vh',
        p: 5,
      }}
    >
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          p: 8,
          bgcolor: '#F3EFEC',
          borderTopLeftRadius: { md: '20px', xs: 0 },
          borderBottomLeftRadius: { md: '20px', xs: 0 },
          borderColor: '#000',
        }}
      >
        {renderHead}
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          p: 8,
          background: 'linear-gradient(to right, rgba(173, 216, 230, 0.115), #E8EAF6)',
          borderTopRightRadius: { md: '20px', xs: 0 },
          borderBottomRightRadius: { md: '20px', xs: 0 },
          borderColor: '#000',
        }}
      >
        {renderForm}
        {renderTerms}
      </Grid>
    </Grid>
  );
}
// #E8EAF6
