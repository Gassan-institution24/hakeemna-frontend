import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useRef, useState, useEffect } from 'react';
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
  // One step, not two.
  //
  // This screen used to ask for the address, post it to /loginstate, and only then reveal the
  // password field. That is an unusual shape for a sign-in form and it fought password managers
  // at every turn: the saved password had nowhere to go on the first screen, autofill re-running
  // could knock the form back a step, and people reported it as simply hard to use.
  //
  // The two-step existed for one reason — to spot an account that has no password yet and send
  // it to "create a password" instead. The login call already reports that case on its error
  // path (`error.password_pending`, handled below), so the pre-check bought nothing that could
  // not be learned by just trying. Both fields are on screen together now.

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
  // Reads the real input on submit, for the case where an autofilled value never reached
  // react-hook-form. See the fallback in onSubmit.
  const passwordRef = useRef(null);

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
    setError,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    setErrorMsg('');

    // A password manager writes straight into the input without firing the events React listens
    // for, so react-hook-form can still hold an empty string while the field visibly contains a
    // password. Submitting that empty value is what produced "wrong data" on an account whose
    // credentials were saved. Read the input itself as a fallback before giving up.
    const password_ = data.password || passwordRef.current?.value || '';

    if (!password_) {
      setError('password', { type: 'manual', message: t('required field') });
      return;
    }

    try {
      const userData = await login?.(data.email, password_);
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

      {/* Named for password managers: `username` on the address and `current-password` on the
          field below is what tells them this is a sign-in pair rather than a registration form,
          so they offer the right saved credential and fill both together. */}
      <RHFTextField
        name="email"
        data-test="email-input"
        label={t('email address')}
        autoComplete="username"
        inputProps={{ autoCapitalize: 'none', autoCorrect: 'off', spellCheck: 'false' }}
      />

      <RHFTextField
        name="password"
        label={t('password')}
        data-test="password-input"
        autoComplete="current-password"
        inputRef={passwordRef}
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
          sx={{ alignSelf: 'flex-end' }}
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
