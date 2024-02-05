import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { Button, MenuItem } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
import { useGetCities, useGetCountries } from 'src/api/tables';

// ----------------------------------------------------------------------

export default function JwtRegisterView() {
  const { register } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const [selectedCountry, setSelectedCountry] = useState('');

  const [cities, setCities] = useState([]);

  const { countriesData } = useGetCountries();

  const { tableData } = useGetCities();

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const RegisterSchema = Yup.object().shape({
    first_name: Yup.string().required('First name required'),
    last_name: Yup.string().required('Last name required'),
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
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile_num1: '',
    identification_num: '',
    gender: '',
    country: null,
    city: null,
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleCountryChange = (event) => {
    const selectedCountryId = event.target.value;
    methods.setValue('country', selectedCountryId, { shouldValidate: true });
    setSelectedCountry(selectedCountryId);
    // setCities(tableData.filter((data)=>data?.country?._id === event.target.value))
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data);
      await register?.({ userName: `${data.first_name} ${data.last_name}`, ...data });

      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });
  useEffect(() => {
    setCities(
      selectedCountry
        ? tableData.filter((data) => data?.country?._id === selectedCountry)
        : tableData
    );
  }, [tableData, selectedCountry]);
  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
      <Typography variant="h4">Get started absolutely free</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2"> Already have an account? </Typography>

        <Link href={paths.auth.login} component={RouterLink} variant="subtitle2">
          Sign in
        </Link>
      </Stack>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2"> I am unit services </Typography>
        <Link href={paths.auth.registersu} component={RouterLink} variant="subtitle2">
          Sign up
        </Link>
      </Stack>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        color: 'text.secondary',
        mt: 2.5,
        typography: 'caption',
        textAlign: 'center',
      }}
    >
      {'By signing up, I agree to '}
      <Link underline="always" color="text.primary">
        Terms of Service
      </Link>
      {' and '}
      <Link underline="always" color="text.primary">
        Privacy Policy
      </Link>
      .
    </Typography>
  );

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2.5}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="first_name" label="First name" />
          <RHFTextField name="last_name" label="Last name" />
        </Stack>

        <RHFTextField name="email" label="Email address" />
        <RHFTextField name="identification_num" label="Identification number" />
        <RHFTextField name="mobile_num1" label="Mobile number" />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFSelect onChange={handleCountryChange} name="country" label="Country">
            {countriesData?.map((country) => (
              <MenuItem key={country?._id} value={country?._id}>
                {country?.name_english}
              </MenuItem>
            ))}
          </RHFSelect>
          <RHFSelect name="city" label="City">
            {cities?.map((city) => (
              <MenuItem key={city?._id} value={city?._id}>
                {city?.name_english}
              </MenuItem>
            ))}
          </RHFSelect>
          <RHFSelect name="gender" label="Gender">
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
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

  return (
    <>
      {renderHead}

      {renderForm}

      {renderTerms}
    </>
  );
}
