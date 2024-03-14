import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { MenuItem } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetCountries, useGetCountryCities } from 'src/api';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

export default function Create() {
  const { countriesData } = useGetCountries();
  const { register } = useAuthContext();
  const { t } = useTranslate();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const { user } = useAuthContext();
  const password = useBoolean();

  const RegisterSchema = Yup.object().shape({
    first_name: Yup.string().required('First name required'),
    family_name: Yup.string().required('Last name required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .min(8, 'Confirm password must be at least 8 characters'),
    identification_num: Yup.string().required('Identification number is required'),
    mobile_num1: Yup.string().required('Mobile number is required'),
    gender: Yup.string().required('Gender is required'),
    country: Yup.string().required('Country is required'),
    city: Yup.string().required('City is required'),
  });

  const defaultValues = {
    first_name: '',
    family_name: '',
    email: '',
    family_members: user?.patient?._id,
    password: '',
    confirmPassword: '',
    mobile_num1: '',
    identification_num: '',
    gender: '',
    country: null,
    city: null,
  };

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const { tableData } = useGetCountryCities(values.country);

  const handleCountryChange = (event) => {
    const selectedCountryId = event.target.value;
    methods.setValue('country', selectedCountryId, { shouldValidate: true });
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      await register?.({ userName: `${data.first_name} ${data.family_name}`, ...data });
      router.push(paths.auth.verify(data.email));
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2.5}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="first_name" label="First name" />
          <RHFTextField name="family_name" label="Last name" />
        </Stack>

        <RHFTextField name="email" label="Email address" />
        <RHFTextField name="identification_num" label="Identification number" />
        <RHFTextField name="mobile_num1" label={t('mobile number')} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFSelect onChange={handleCountryChange} name="country" label={t('country')}>
            {countriesData?.map((country, idx) => (
              <MenuItem key={idx} value={country?._id}>
                {country?.name_english}
              </MenuItem>
            ))}
          </RHFSelect>
          <RHFSelect name="city" label="City">
            {tableData?.map((city, idx) => (
              <MenuItem key={idx} value={city?._id}>
                {city?.name_english}
              </MenuItem>
            ))}
          </RHFSelect>
          <RHFSelect name="gender" label="Gender">
            <MenuItem value="male">male</MenuItem>
            <MenuItem value="female">female</MenuItem>
          </RHFSelect>
        </Stack>
        <RHFTextField
          name="password"
          label="Password"
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
          label="Confirm Password"
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
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Create account
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
