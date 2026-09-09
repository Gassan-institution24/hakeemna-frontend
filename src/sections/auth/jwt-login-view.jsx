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

import CreatePasswordDialog from './create-password-dialog';

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

  // The address is asked for on its own first: what comes next depends on the account. Staff
  // created by a clinic have no password yet and are sent to the create-password dialog;
  // everyone else gets the password field. 'email' is step one, 'password' step two.
  const [step, setStep] = useState('email');

  // Staff accounts are created by their clinic without a password. The server answers the first
  // login attempt on such an account with `password_pending` instead of a session; that opens
  // this dialog, where the employee chooses the password they will use from then on.
  const [pendingPasswordEmail, setPendingPasswordEmail] = useState('');

  // The axios interceptor / socket handler set this flag before bouncing an expired demo
  // account back to login. Consume it once so the user is told why they were signed out
  // instead of landing here with no explanation.
  useEffect(() => {
    try {
      if (sessionStorage.getItem('demoExpired')) {
        sessionStorage.removeItem('demoExpired');
        setErrorMsg(t('Demo account expired'));
      }
    } catch (error) {
      /* storage unavailable — nothing to show */
    }
  }, [t]);

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .required(t('required field'))
      .email(t('Email must be a valid email address')),
    // Not required by the schema: on step one there is no password field yet. Step two checks
    // it directly, so the rule cannot fall out of step with what is on screen.
    password: Yup.string(),
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
    watch,
    setError,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Editing the address invalidates the answer we got for the previous one, so go back a step.
  const emailValue = watch('email');

  useEffect(() => {
    setStep('email');
  }, [emailValue]);

  const onSubmit = handleSubmit(async (data) => {
    setErrorMsg('');

    // Step one: the address alone decides what to show next.
    if (step === 'email') {
      try {
        const { data: state } = await axiosInstance.post(endpoints.auth.loginstate, {
          email: data.email.toLowerCase().trim(),
        });

        if (state?.state === 'password_pending') {
          setPendingPasswordEmail(data.email);
        } else {
          setStep('password');
        }
      } catch (error) {
        setErrorMsg(typeof error === 'string' ? error : error.message);
      }
      return;
    }

    // Step two: an ordinary sign-in.
    if (!data.password) {
      setError('password', { type: 'manual', message: t('required field') });
      return;
    }

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
      // A first login on an account that has no password yet. Not an error to show — the
      // employee is asked to create one instead.
      if (error?.password_pending) {
        setErrorMsg('');
        setPendingPasswordEmail(error.email || data.email);
        return;
      }

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

      {step === 'password' && (
        <>
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
        </>
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
        {step === 'email' ? t('continue') : t('Login')}
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
    <>
      <FormProvider data-test="login-form" methods={methods} onSubmit={onSubmit}>
        <Stack data-test="login-form" justifyContent="center" width={1} height="70vh">
          {renderHead}
          {renderForm}
        </Stack>
      </FormProvider>

      <CreatePasswordDialog
        open={!!pendingPasswordEmail}
        email={pendingPasswordEmail}
        onClose={() => setPendingPasswordEmail('')}
        onDone={() => {
          setPendingPasswordEmail('');
          // Setting the password signs the employee in, so go where a successful login goes.
          router.push(returnTo || PATH_AFTER_LOGIN);
        }}
      />
    </>
  );
}
JwtLoginView.propTypes = {
  onSignin: PropTypes.func,
  selected: PropTypes.string,
  refetch: PropTypes.func,
  onSignUp: PropTypes.func,
  setPatientId: PropTypes.func,
};
