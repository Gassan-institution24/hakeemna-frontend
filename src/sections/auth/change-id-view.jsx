import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import LoadingButton from '@mui/lab/LoadingButton';
import { Stack, Hidden, IconButton, Typography, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import Language from 'src/layouts/common/language-popover';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFUpload, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function ChangeIDView() {
  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const { t } = useTranslate();

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .required(t('required field'))
      .email(t('Email must be a valid email address')),
    password: Yup.string().required(t('required field')),
    scanned_identification: Yup.mixed().required(t('required field')),
  });

  const defaultValues = {
    email: '',
    password: '',
    scanned_identification: null,
  };

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const newFile = Object.assign(acceptedFiles[0], {
        preview: URL.createObjectURL(acceptedFiles[0]),
      });
      setValue('scanned_identification', newFile);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('scanned_identification', data.scanned_identification);
      await axiosInstance.patch(endpoints.auth.changeId, formData);
      enqueueSnackbar(t('sent successfully!'));
      router.push(paths.auth.login);
    } catch (error) {
      enqueueSnackbar(t(error.message || error), { variant: 'error' });
    }
  });

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

      <Typography variant="h4">{t('Change ID image')}</Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>

      <RHFTextField name="email" data-test='email-input' label={t('email address')} />

      <RHFTextField
        name="password"
        label={t('password')}
        data-test='password-input'
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
      <Stack gap={1}>
        <Typography variant="subtitle2">{t('identification scan')}</Typography>
        <RHFUpload
          name="scanned_identification"
          onDrop={handleDrop}
          label={t('identification photo')}
        />
        <Typography variant="caption">
          {t('the scanned image should be clear and able to read')}
        </Typography>
      </Stack>

      <LoadingButton
        fullWidth
        data-test='login-button'
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        {t('Save')}
      </LoadingButton>

    </Stack>
  );

  return (
    <FormProvider data-test='login-form' methods={methods} onSubmit={onSubmit}>
      <Stack data-test='login-form' justifyContent="center" width={1} height="70vh">
        {renderHead}
        {renderForm}
      </Stack>
    </FormProvider>
  );
}

