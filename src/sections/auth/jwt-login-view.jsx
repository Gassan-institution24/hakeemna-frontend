import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box } from '@mui/material';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { login } = useAuthContext();

  const router = useRouter();

  const { t } = useTranslate();

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
    mode: 'onTouched',
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login?.(data.email, data.password);

      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      console.error(error);
      // reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
      if (error === 'Your account is inactive!') {
        setEmail(data.email);
      }
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">{t('Login')}</Typography>

      <Stack direction="row" alignItems="flex-end" spacing={0.5}>
        <Typography color="text.disabled" variant="subtitle1">
          {t('new user?')}
        </Typography>

        <Link
          sx={{ px: 0.5, fontWeight: 400, fontSize: 13 }}
          component={RouterLink}
          href={paths.auth.register}
          variant="subtitle2"
          underline="always"
        >
          {t('create an account')}
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && (
        <Alert severity="error">
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: errorMsg }} />
          {email && (
            <Link component={RouterLink} href={paths.auth.verify(email)} variant="subtitle2">
              {t('verify your account')}
            </Link>
          )}
        </Alert>
      )}

      <RHFTextField name="email" label={t('email address')} />

      <RHFTextField
        name="password"
        label={t('password')}
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

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        {t('Login')}
      </LoadingButton>
      <Link
        sx={{  alignSelf: 'center' }}
        component={RouterLink}
        href='https://doctorna.online/'
        variant="subtitle2"
        underline="always"
      >
        {t('web page')}
      </Link>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}
      <Box height="5vh" />
      {renderForm}
    </FormProvider>
  );
}
