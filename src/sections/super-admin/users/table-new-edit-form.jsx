import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, MenuItem, IconButton, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function UsersNewEditForm({ currentSelected }) {
  const router = useRouter();

  const password = useBoolean();

  const [errorMsg, setErrorMsg] = useState();

  const { enqueueSnackbar } = useSnackbar();

  const NewSchema = Yup.object().shape({
    userName: Yup.string().required('userName is required'),
    email: Yup.string().required('email is required'),
    password: Yup.string(),
    confirmPassword: Yup.string(),
    role: Yup.string().required('role is required'),
  });

  const defaultValues = useMemo(
    /// edit
    () => ({
      userName: currentSelected?.userName || '',
      email: currentSelected?.email || '',
      password: currentSelected?.password || '',
      confirmPassword: currentSelected?.confirmPassword || '',
      role: currentSelected?.role || '',
    }),
    [currentSelected]
  );

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(NewSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // const handleArabicInputChange = (event) => {
  //   // Validate the input based on Arabic language rules
  //   const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_-]*$/; // Range for Arabic characters

  //   if (arabicRegex.test(event.target.value)) {
  //     methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
  //   }
  // };

  // const handleEnglishInputChange = (event) => {
  //   // Validate the input based on English language rules
  //   const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%]*$/; // Only allow letters and spaces

  //   if (englishRegex.test(event.target.value)) {
  //     methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
  //   }
  // };

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentSelected) {
        await axiosInstance.patch(endpoints.auth.user(currentSelected._id), data); /// edit
      } else {
        await axiosInstance.post(endpoints.auth.users, {
          ...data,
          email: data.email.toLowerCase(),
        }); /// edit
      }
      reset();
      enqueueSnackbar(currentSelected ? 'Update success!' : 'Create success!');
      router.push(paths.superadmin.users.root);
    } catch (error) {
      setErrorMsg(typeof error === 'string' ? error : error.message);
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} maxWidth="md">
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }} /// edit
            >
              {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
              <RHFTextField lang="ar" name="userName" label="username" />
              <RHFTextField lang="ar" name="email" label="email" />
              <RHFSelect name="role" label="Role">
                <MenuItem value="admin">admin</MenuItem>
                <MenuItem value="superadmin">superadmin</MenuItem>
                <MenuItem value="employee">employee</MenuItem>
                <MenuItem value="patient">patient</MenuItem>
              </RHFSelect>
              {!currentSelected && (
                <RHFTextField
                  lang="ar"
                  name="password"
                  label="password"
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
              )}
              {!currentSelected && (
                <RHFTextField
                  lang="ar"
                  name="confirmPassword"
                  label="confirm password"
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
              )}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" tabIndex={-1} variant="contained" loading={isSubmitting}>
                {!currentSelected ? 'Create One' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

UsersNewEditForm.propTypes = {
  currentSelected: PropTypes.object,
};
