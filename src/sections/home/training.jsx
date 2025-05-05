import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { matchIsValidTel } from 'mui-tel-input';
import { yupResolver } from '@hookform/resolvers/yup';

import { useTheme } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Link, Grid, Alert, Stack, Typography, useMediaQuery } from '@mui/material';

import { paths } from 'src/routes/paths';

import axiosInstance from 'src/utils/axios';

import { useLocales, useTranslate } from 'src/locales';

import FormProvider, { RHFTextField, RHFPhoneNumber } from 'src/components/hook-form';

import TrainingImage from './images/Video files-bro 1.svg';

// same imports...

export default function Training() {
  const { t } = useTranslate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [errorMsg, setErrorMsg] = useState('');

  const RegisterSchema = Yup.object().shape({
    full_name: Yup.string().required('English name is required'),
    topic: Yup.string().required('Topic name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    mobile_num1: Yup.string()
      .required('Mobile number is required')
      .test('is-valid-phone', t('Invalid phone number'), (value) => matchIsValidTel(value)),
  });

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const defaultValues = { full_name: '', topic: '', email: '', mobile_num1: '' };
  const methods = useForm({ mode: 'all', resolver: yupResolver(RegisterSchema), defaultValues });

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
    <Stack spacing={2} sx={{ color: 'white', position: 'relative' }}>
      <Typography
        variant={isSmallScreen ? 'h4' : 'h2'}
        sx={{ textAlign: 'center', mb: 4, color: 'white' }}
      >
        {t('Contact us to register for the training course')}
      </Typography>
      <Box>
        <Typography sx={{ color: 'white' }} variant="h6">
          {t('What are the benefits of registering with us?')}
        </Typography>
        <Typography sx={{ color: 'white' }} variant="h6">
          {t('Gain new skills')}
        </Typography>
        <Typography sx={{ color: 'white' }} variant="h6">
          {t('Get a free certificate')}
        </Typography>
      </Box>

      {!isSmallScreen && (
        <Box sx={{ position: 'relative', height: '200px' }}>
          <img
            src={TrainingImage}
            alt="Training"
            style={{
              position: 'absolute',
              top: -70,
              [curLangAr ? 'left' : 'right']: 0,
              maxWidth: isSmallScreen ? '100%' : '50%',
            }}
          />
        </Box>
      )}
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
      <Link underline="always" color="text.primary" href={paths.pages.UsPrivacypolicy}>
        {t('Terms of Service ')}
      </Link>
      &nbsp;
      {t('and ')}&nbsp;
      <Link underline="always" color="text.primary" href={paths.pages.UsPrivacypolicy}>
        {t('Privacy Policy')}
      </Link>
      .
    </Typography>
  );

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Typography
        variant={isSmallScreen ? 'h5' : 'h4'}
        sx={{ mb: 2.5, textAlign: 'center', color: '#1F2C5C' }}
      >
        {t('How would you like to connect')}
      </Typography>
      <Stack spacing={2.5}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
        <RHFTextField
          name="full_name"
          label={t('Full Name')}
          InputLabelProps={{ style: { color: '#1F2C5C' } }}
        />
        <RHFTextField
          name="topic"
          label={t('Topic')}
          InputLabelProps={{ style: { color: '#1F2C5C' } }}
        />
        <RHFTextField
          name="email"
          label={t('Email address')}
          InputLabelProps={{ style: { color: '#1F2C5C' } }}
        />
        <RHFPhoneNumber
          name="mobile_num1"
          label={t('Mobile number')}
          InputLabelProps={{ style: { color: '#1F2C5C' } }}
        />
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          sx={{ bgcolor: '#1F2C5C' }}
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
      spacing={0}
      sx={{
        minHeight: '62vh',
        px: { xs: 2, sm: 6, md: 10, lg: 15, xl: 30 },
        py: { xs: 6, md: 10 },
        flexDirection: { xs: 'column', md: 'row' },
        mt: '150px',
      }}
    >
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          p: { xs: 3, md: 6 },
          background: 'linear-gradient(to bottom right, #74BCB7, #6EBBB3)',
          borderTopLeftRadius: { md: '20px', xs: 0 },
          borderBottomLeftRadius: { md: '20px', xs: 0 },
        }}
      >
        {renderHead}
      </Grid>

      <Grid
        item
        xs={12}
        md={6}
        sx={{
          p: { xs: 3, md: 6 },
          background: '#E4F6F2',
          borderTopRightRadius: { md: '20px', xs: 0 },
          borderBottomRightRadius: { md: '20px', xs: 0 },
        }}
      >
        {renderForm}
        {renderTerms}
      </Grid>
    </Grid>
  );
}
