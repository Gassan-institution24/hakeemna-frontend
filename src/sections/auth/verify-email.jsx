import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useCountdownSeconds } from 'src/hooks/use-countdown';

import axios, { endpoints } from 'src/utils/axios';

import { EmailInboxIcon } from 'src/assets/icons';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFCode } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function ClassicVerifyView({ onVerify, patientId, selected, refetch }) {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const VerifySchema = Yup.object().shape({
    code: Yup.string()
      .min(6, `${t('must be at least')} 6`)
      .required(t('required field')),
  });

  const defaultValues = {
    code: '',
  };

  const { countdown, counting, startCountdown } = useCountdownSeconds(60);

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(VerifySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axios.post(endpoints.auth.activate, { email, code: data.code });
      if (onVerify) {
        await axios.patch(endpoints.appointments.book(selected), {
          patient: patientId,
          lang: curLangAr,
        });
        onVerify();
        refetch();
      } else {
        router.push(paths.dashboard.root);
      }
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
  const handleResendCode = useCallback(async () => {
    try {
      startCountdown();
      await axios.post(endpoints.auth.resendActivation, { email });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
    }
  }, [startCountdown, email, enqueueSnackbar, curLangAr]);

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      {/* <RHFTextField
        name="email"
        label="Email"
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
      /> */}

      <RHFCode name="code" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        {t('verify')}
      </LoadingButton>

      <Typography variant="body2">
        {t(`Don’t have a code?`)}
        <Link
          onClick={handleResendCode}
          variant="subtitle2"
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
      </Typography>

      {!patientId && (
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
      )}
    </Stack>
  );

  const renderHead = (
    <>
      <EmailInboxIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">{t('please check your email!')}</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          we have emailed a 6-digit confirmation code to{' '}
          <span style={{ color: 'green', textTransform: 'lowercase' }}>{email}</span>, please enter
          the code in below box to verify your email.
        </Typography>
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
ClassicVerifyView.propTypes = {
  refetch: PropTypes.func,
  onVerify: PropTypes.func,
  patientId: PropTypes.string,
  selected: PropTypes.string,
};
