import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useParams, useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { SentIcon } from 'src/assets/icons';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function NewUserView() {
  const router = useRouter();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const searchParams = useSearchParams();

  const { token } = useParams();

  const { enqueueSnackbar } = useSnackbar();

  const email = searchParams.get('email');

  const password = useBoolean();

  const VerifySchema = Yup.object().shape({
    email: Yup.string()
      .required(t('required field'))
      .email(t('Email must be a valid email address')),
    password: Yup.string().min(8, t('Password must be minimum 8+')).required(t('required field')),
    confirmPassword: Yup.string()
      .required(t('required field'))
      .oneOf([Yup.ref('password')], t('Passwords must match')),
  });

  const defaultValues = {
    email: email || '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(VerifySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axiosInstance.post(endpoints.auth.newUser, {
        email: data.email,
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      router.push(paths.auth.login);
      enqueueSnackbar(t('Account created successfully!'));
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
    }
  });

  // const handleResendCode = useCallback(async () => {
  //   try {
  //     startCountdown();
  //     await forgotPassword?.(values.email);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [forgotPassword, startCountdown, values.email]);

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField
        name="email"
        label={t('email')}
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
      />

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

      <RHFTextField
        name="confirmPassword"
        label={t('confirm new password')}
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

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        {t('create user')}
      </LoadingButton>

      {/* <Typography variant="body2">
        {t(`Don’t have a code?`)}
        <Link
          variant="subtitle2"
          onClick={handleResendCode}
          sx={{
            px: 1,
            cursor: 'pointer',
            ...(counting && {
              color: 'text.disabled',
              pointerEvents: 'none',
            }),
          }}
        >
          {t('resend code')} {counting && `(${countdown}s)`}
        </Link>
      </Typography> */}

      <Link
        component={RouterLink}
        href={paths.auth.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        {t('return to login')}
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <SentIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">{t('request sent successfully!')}</Typography>

        {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t("We've sent a 6-digit confirmation email to your email.")}
          <br />
          {t('please enter the code in below box to verify your email.')}
        </Typography> */}
      </Stack>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}
    </FormProvider>
  );
}
