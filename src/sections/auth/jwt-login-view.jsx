import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import LoadingButton from '@mui/lab/LoadingButton';
import { Link, Alert, Stack, Hidden, IconButton, Typography, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';
import { useLocales, useTranslate } from 'src/locales';
import Language from 'src/layouts/common/language-popover';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function JwtLoginView({ onSignin, selected, refetch, onSignUp, setPatientId }) {
  const { login, authenticated } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [errorMsg, setErrorMsg] = useState('');
  const [email, setEmail] = useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .required(t('required field'))
      .email(t('Email must be a valid email address')),
    password: Yup.string().required(t('required field')),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const userData = await login?.(data.email, data.password);
      if (onSignin) {
        setPatientId(userData.patient);
        await axiosInstance.patch(endpoints.appointments.book(selected), {
          patient: userData?.user?.patient,
          lang: curLangAr,
        });
        enqueueSnackbar('appointment booked successfully');
        onSignin();
        refetch();
        router.push(paths.dashboard.user.patientsappointments);
      } else {
        router.push(returnTo || PATH_AFTER_LOGIN);
      }
    } catch (error) {
      // reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
      if (error === 'Your account is inactive!') {
        setEmail(data.email);
      }
    }
  });

  useEffect(() => {
    if (authenticated) {
      router.push(paths.dashboard.root);
    }
  }, [authenticated, router]);

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Hidden mdUp>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <Language />
        </div>
      </Hidden>

      <Typography variant="h4">{t('Login')}</Typography>

      <Stack direction="row" alignItems="flex-end" spacing={0.5}>
        <Typography color="text.disabled" variant="subtitle1">
          {t('new user?')}
        </Typography>

        {onSignUp ? (
          <Link
            sx={{ px: 0.5, fontWeight: 400, fontSize: 13 }}
            component={RouterLink}
            onClick={() => onSignUp()}
            // href={paths.auth.register}
            variant="subtitle2"
            underline="always"
          >
            {t('create an account')}
          </Link>
        ) : (
          <Link
            sx={{ px: 0.5, fontWeight: 400, fontSize: 13 }}
            component={RouterLink}
            href={paths.auth.register}
            variant="subtitle2"
            underline="always"
          >
            {t('create an account')}
          </Link>
        )}
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && (
        <Alert severity="error">
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: t(errorMsg) }} />
          {email && (
            <Link component={RouterLink} href={paths.auth.verify(email)} variant="subtitle2">
              {t('verify your account')}
            </Link>
          )}
        </Alert>
      )}

      <RHFTextField name="email" data-test="email-input" label={t('email address')} />

      <RHFTextField
        name="password"
        label={t('password')}
        data-test="password-input"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {!onSignin && (
        <Link
          variant="body2"
          component={RouterLink}
          href={paths.auth.forgotPassword}
          color="inherit"
          underline="always"
          sx={{ alignSelf: 'flex-end', mt: 5 }}
        >
          {t('Forgot password?')}
        </Link>
      )}

      <LoadingButton
        fullWidth
        data-test="login-button"
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        {t('Login')}
      </LoadingButton>
      {!onSignin && (
        <Link
          sx={{ alignSelf: 'center' }}
          component={RouterLink}
          href="/"
          variant="subtitle2"
          underline="always"
        >
          {t('home page')}
        </Link>
      )}
    </Stack>
  );

  return (
    <FormProvider data-test="login-form" methods={methods} onSubmit={onSubmit}>
      <Stack data-test="login-form" justifyContent="center" width={1} height="70vh">
        {renderHead}
        {renderForm}
      </Stack>
    </FormProvider>
  );
}
JwtLoginView.propTypes = {
  onSignin: PropTypes.func,
  selected: PropTypes.string,
  refetch: PropTypes.func,
  onSignUp: PropTypes.func,
  setPatientId: PropTypes.func,
};
