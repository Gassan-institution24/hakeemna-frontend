import * as Yup from 'yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import axios, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const showpasswordCurrent = useBoolean();
  const showpassword = useBoolean();
  const showconfirmPassword = useBoolean();

  const ChangePassWordSchema = Yup.object().shape({
    passwordCurrent: Yup.string().required(t('required field')),
    password: Yup.string()
      .required(t('required field'))
      .min(8, `${t('must be at least')} 8`)
      .test(
        'no-match',
        t('New password must be different than old password'),
        (value, { parent }) => value !== parent.passwordCurrent
      ),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], t('Passwords must match')),
  });

  const defaultValues = {
    email: user?.email,
    passwordCurrent: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (Object.keys(errors).length) {
      Object.keys(errors).forEach((key, idx) =>
        enqueueSnackbar(`${key}: ${errors?.[key]?.message || 'error'}`, { variant: 'error' })
      );
    }
  }, [errors, enqueueSnackbar]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { passwordCurrent, password, confirmPassword } = data;
      const requestData = { passwordCurrent, password, confirmPassword };

      const response = await axios.patch(endpoints.auth.updatepassword, requestData);
      if (response.status === 201) {
        reset();
        enqueueSnackbar(t('Password updated successfully!'), { variant: 'success' });
      } else {
        enqueueSnackbar(response.data || t('Password update failed!'), { variant: 'error' });
      }
    } catch (error) {
      // error emitted in backend
      enqueueSnackbar(curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`, {
        variant: 'error',
      });
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        <RHFTextField value={user?.email} name="email" />
        <RHFTextField
          name="passwordCurrent"
          type={showpasswordCurrent.value ? 'text' : 'password'}
          label={t('current password')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showpasswordCurrent.onToggle} edge="end">
                  <Iconify
                    icon={showpasswordCurrent.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="password"
          label={t('new password')}
          type={showpassword.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showpassword.onToggle} edge="end">
                  <Iconify icon={showpassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          helperText={
            <Stack component="span" direction="row" alignItems="center">
              <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} />{' '}
              {t('Password must be minimum 8+')}
            </Stack>
          }
        />

        <RHFTextField
          name="confirmPassword"
          type={showconfirmPassword.value ? 'text' : 'password'}
          label={t('confirm new password')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showconfirmPassword.onToggle} edge="end">
                  <Iconify
                    icon={showconfirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          type="submit"
          tabIndex={-1}
          variant="contained"
          loading={isSubmitting}
          sx={{ ml: 'auto' }}
        >
          {t('save changes')}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
