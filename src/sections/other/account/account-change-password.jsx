import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import axios, { endpoints } from 'src/utils/axios';
// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();

  const showpasswordCurrent = useBoolean();
  const showpassword = useBoolean();
  const showconfirmPassword = useBoolean();

  const ChangePassWordSchema = Yup.object().shape({
    passwordCurrent: Yup.string().required('Old Password is required'),
    password: Yup.string()
      .required('New Password is required')
      .min(8, 'Password must be at least 6 characters')
      .test(
        'no-match',
        'New password must be different than old password',
        (value, { parent }) => value !== parent.passwordCurrent
      ),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  const defaultValues = {
    passwordCurrent: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { passwordCurrent, password, confirmPassword } = data;
      const requestData = { passwordCurrent, password, confirmPassword };

      const response = await axios.patch(endpoints.auth.updatepassword, requestData);
      if (response.status === 201) {
        reset();
        enqueueSnackbar('Password updated successfully!', { variant: 'success' });
      } else {
        enqueueSnackbar(response.data || 'Password update failed!', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('An error occurred. Please try again.', { variant: 'error' });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        <RHFTextField
          name="passwordCurrent"
          type={showpasswordCurrent.value ? 'text' : 'password'}
          label="Current Password"
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
          label="New Password"
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
              <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> Password must be minimum
              8+
            </Stack>
          }
        />

        <RHFTextField
          name="confirmPassword"
          type={showconfirmPassword.value ? 'text' : 'password'}
          label="Confirm New Password"
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

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Save Changes
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
