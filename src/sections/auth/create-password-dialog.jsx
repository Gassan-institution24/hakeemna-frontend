import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

/**
 * First-login password creation.
 *
 * A clinic creates its staff accounts without a password — the employee chooses their own the
 * first time they sign in. The login screen opens this when the server answers a login attempt
 * with `password_pending`, and the server signs them in as soon as the password is set, so
 * `onDone` lands them in the app rather than back at the login form.
 *
 * From then on the account is an ordinary one: same address, the password chosen here, and this
 * dialog never appears for it again.
 */
export default function CreatePasswordDialog({ open, email, onClose, onDone }) {
  const { t } = useTranslate();
  const { setInitialPassword } = useAuthContext();

  const password = useBoolean();

  const [errorMsg, setErrorMsg] = useState('');

  const CreatePasswordSchema = Yup.object().shape({
    password: Yup.string()
      .required(t('required field'))
      .min(8, `${t('must be at least')} 8`),
    confirmPassword: Yup.string()
      .required(t('required field'))
      .oneOf([Yup.ref('password')], t('Passwords must match')),
  });

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(CreatePasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Reopening for a different account must not show the previous attempt's error or entries.
  useEffect(() => {
    if (open) {
      setErrorMsg('');
      reset();
    }
  }, [open, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await setInitialPassword(email, data.password, data.confirmPassword);
      onDone();
    } catch (error) {
      setErrorMsg(typeof error === 'string' ? error : error?.message || t('something went wrong'));
    }
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{t('create your password')}</DialogTitle>

        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('this is your first login, choose a password for')} <strong>{email}</strong>
            </Typography>

            {!!errorMsg && <Alert severity="error">{t(errorMsg)}</Alert>}

            <RHFTextField
              name="password"
              label={t('password')}
              type={password.value ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={password.onToggle} edge="end">
                      <Iconify
                        icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <RHFTextField
              name="confirmPassword"
              label={t('confirm password')}
              type={password.value ? 'text' : 'password'}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" onClick={onClose}>
            {t('cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {t('create password')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

CreatePasswordDialog.propTypes = {
  open: PropTypes.bool,
  email: PropTypes.string,
  onClose: PropTypes.func,
  onDone: PropTypes.func,
};
