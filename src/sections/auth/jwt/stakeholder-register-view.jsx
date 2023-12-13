import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

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

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
import { useGetCities, useGetCountries, useGetSpecialties, useGetUSTypes } from 'src/api/tables';

// ----------------------------------------------------------------------

export default function JwtRegisterView() {
  const { register } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const [selectedCountry, setSelectedCountry] = useState('');

  const [cities, setCities] = useState([]);

  const { countriesData } = useGetCountries();

  const { tableData } = useGetCities();

  const { unitserviceTypesData } = useGetUSTypes();

  const { specialtiesData } = useGetSpecialties();

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const RegisterSchema = Yup.object().shape({
    name_arabic: Yup.string().required('name is required'),
    name_english: Yup.string().required('name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string().required('confirm Password is required'),
    identification_num: Yup.string().required('Identification number is required'),
    country: Yup.string().required('Country is required'),
    city: Yup.string().required('City is required'),
    US_type: Yup.string().required('Unit Service type is required'),
    speciality: Yup.string().nullable(),
    sector_type: Yup.string().required('Sector type is required'),
  });

  const defaultValues = {
    name_arabic: '',
    name_english: '',
    email: '',
    password: '',
    confirmPassword: '',
    identification_num: '',
    country: null,
    city: null,
    US_type: null,
    speciality: null,
    sector_type: '',
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
      await register?.({ role: 'admin', userName: data.name_english, ...data });

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

        <Link href={paths.auth.jwt.login} component={RouterLink} variant="subtitle2">
          Sign in
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
      <Stack spacing={2}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="name_english" label="Name in english" />
          <RHFTextField name="name_arabic" label="Name in arabic" />
        </Stack>

        <RHFTextField name="email" label="Email address" />
        <RHFTextField name="identification_num" label="Identification number" />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFSelect native onChange={handleCountryChange} name="country" label="Country">
            <option>{null}</option>
            {countriesData.map((country) => (
              <option key={country._id} value={country._id}>
                {country.name_english}
              </option>
            ))}
          </RHFSelect>
          <RHFSelect native name="city" label="City">
            <option>{null}</option>
            {cities.map((city) => (
              <option key={city._id} value={city._id}>
                {city.name_english}
              </option>
            ))}
          </RHFSelect>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFSelect native name="US_type" label="Unit Service Type">
            <option>{null}</option>
            {unitserviceTypesData.map((type) => (
              <option key={type._id} value={type._id}>
                {type.name_english}
              </option>
            ))}
          </RHFSelect>
          <RHFSelect native name="speciality" label="Speciality">
            <option>{null}</option>
            {specialtiesData.map((specialty) => (
              <option key={specialty._id} value={specialty._id}>
                {specialty.name_english}
              </option>
            ))}
          </RHFSelect>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFSelect native name="sector_type" label="Sector type">
            <option>{null}</option>
            <option value="public">Public</option>
            <option value="privet">Privet</option>
            <option value="charity">Charity</option>
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
