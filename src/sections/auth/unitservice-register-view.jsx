import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Step from '@mui/material/Step';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import { Box, MenuItem } from '@mui/material';
import StepLabel from '@mui/material/StepLabel';
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

const steps = ['Service unit', 'Employee', 'Account'];

export default function JwtRegisterView() {
  const { register } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [page, setPage] = useState(0);
  const [cities, setCities] = useState([]);

  const { countriesData } = useGetCountries();
  const { tableData } = useGetCities();
  const { unitserviceTypesData } = useGetUSTypes();
  const { specialtiesData } = useGetSpecialties();

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const RegisterSchema = Yup.object().shape({
    us_name_arabic: Yup.string().required('name is required'),
    us_name_english: Yup.string().required('name is required'),
    us_email: Yup.string()
      .required('Email is required')
      .email('Email must be a valid email address'),
    us_identification_num: Yup.string().required('Identification number is required'),
    us_country: Yup.string().required('Country is required'),
    us_city: Yup.string().required('City is required'),
    US_type: Yup.string().required('Unit Service type is required'),
    us_speciality: Yup.string().nullable(),
    us_sector_type: Yup.string().required('Sector type is required'),
    us_phone: Yup.string().required('Phone number is required'),

    em_first_name: Yup.string().required('name is required'),
    em_second_name: Yup.string().required('name is required'),
    em_family_name: Yup.string().required('name is required'),
    em_nationality: Yup.string().required('Nationality is required'),
    em_identification_num: Yup.string().required('Identification number is required'),
    em_profrssion_practice_num: Yup.string().required('Prefession practice number is required'),
    em_phone: Yup.string().required('Phone number is required'),
    em_speciality: Yup.string().nullable(),

    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().min(8, 'Password is required'),
    confirmPassword: Yup.string().min(8, 'confirm Password is required'),
  });

  const defaultValues = {
    us_name_arabic: '',
    us_name_english: '',
    us_email: '',
    us_identification_num: '',
    us_country: null,
    us_city: null,
    US_type: null,
    us_speciality: null,
    us_sector_type: '',
    us_phone: '',
    em_first_name: '',
    em_second_name: '',
    em_family_name: '',
    em_nationality: null,
    em_identification_num: '',
    em_profrssion_practice_num: '',
    em_phone: '',
    em_speciality: null,
    email: '',
    password: '',
    confirmPassword: '',
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

  const handleArabicInputChange = (event) => {
    // Validate the input based on Arabic language rules
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_-]*$/; // Range for Arabic characters

    if (arabicRegex.test(event.target.value)) {
      methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };

  const handleEnglishInputChange = (event) => {
    // Validate the input based on English language rules
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%]*$/; // Only allow letters and spaces

    if (englishRegex.test(event.target.value)) {
      methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };

  const handleCountryChange = (event) => {
    const selectedCountryId = event.target.value;
    methods.setValue('us_country', selectedCountryId, { shouldValidate: true });
    setSelectedCountry(selectedCountryId);
    // setCities(tableData.filter((data)=>data?.country?._id === event.target.value))
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data);
      await register?.({
        role: 'admin',
        userName: `${data.em_first_name} ${data.em_family_name}`,
        ...data,
      });

      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      console.error(error);
      // reset();
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
    <Stack spacing={2} sx={{ mb: 3, position: 'relative' }}>
      <Typography variant="h4">Sign up as service unit</Typography>
      <Stack direction="row" spacing={0.5}>
        <Typography sx={{ mb: 3 }} variant="body2">
          {' '}
          Already have an account?{' '}
        </Typography>
        <Link href={paths.auth.login} component={RouterLink} variant="subtitle2">
          Sign in
        </Link>
      </Stack>
      <Stepper activeStep={page}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Stack>
  );

  const renderTerms = (
    <>
      <Box sx={{ display: 'flex' }}>
        <Button
          color="inherit"
          disabled={page === 0}
          onClick={() => setPage((prev) => prev - 1)}
          sx={{ m: 1 }}
        >
          Back
        </Button>
      </Box>
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
      </Typography>
    </>
  );

  const renderForm = (
    <Stack spacing={2}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      {/* <Alert severity="info">Service unit information</Alert> */}
      <RHFTextField
        lang="en"
        onChange={handleEnglishInputChange}
        name="us_name_english"
        label="Name in english"
      />
      <RHFTextField
        lang="ar"
        onChange={handleArabicInputChange}
        name="us_name_arabic"
        label="Name in arabic"
      />
      {/* <RHFTextField type='number' name="us_phone" label="Phone number" /> */}
      <RHFTextField name="us_identification_num" label="Identification number" />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField name="us_email" label="Email address" />
        <RHFTextField type="us_number" name="phone" label="Phone number" />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFSelect onChange={handleCountryChange} name="us_country" label="Country">
          {countriesData.map((country) => (
            <MenuItem key={country._id} value={country._id}>
              {country.name_english}
            </MenuItem>
          ))}
        </RHFSelect>
        <RHFSelect name="us_city" label="City">
          {cities.map((city) => (
            <MenuItem key={city._id} value={city._id}>
              {city.name_english}
            </MenuItem>
          ))}
        </RHFSelect>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFSelect name="US_type" label="Unit Service Type">
          {unitserviceTypesData.map((type) => (
            <MenuItem key={type._id} value={type._id}>
              {type.name_english}
            </MenuItem>
          ))}
        </RHFSelect>
        <RHFSelect name="us_speciality" label="Speciality">
          {specialtiesData.map((specialty) => (
            <MenuItem key={specialty._id} value={specialty._id}>
              {specialty.name_english}
            </MenuItem>
          ))}
        </RHFSelect>
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFSelect name="us_sector_type" label="Sector type">
          <MenuItem value="public">Public</MenuItem>
          <MenuItem value="privet">Privet</MenuItem>
          <MenuItem value="charity">Charity</MenuItem>
        </RHFSelect>
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        variant="contained"
        onClick={() => setPage((prev) => prev + 1)}
      >
        Next Step <Iconify width={20} className="arrow" icon="eva:arrow-ios-forward-fill" />
      </LoadingButton>
    </Stack>
  );
  const renderFormEmployee = (
    <Stack spacing={2}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      {/* <Alert severity="info">Employee information</Alert> */}

      <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        }}
      >
        <RHFTextField
          lang="en"
          onChange={handleEnglishInputChange}
          name="em_first_name"
          label="First name"
        />
        <RHFTextField
          lang="en"
          onChange={handleEnglishInputChange}
          name="em_second_name"
          label="Second name"
        />
        <RHFTextField
          lang="en"
          onChange={handleEnglishInputChange}
          name="em_family_name"
          label="Family name"
        />
        <RHFSelect name="em_speciality" label="Speciality">
          {specialtiesData.map((specialty) => (
            <MenuItem key={specialty._id} value={specialty._id}>
              {specialty.name_english}
            </MenuItem>
          ))}
        </RHFSelect>
      </Box>
      <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(1, 1fr)',
        }}
      >
        <RHFSelect name="em_nationality" label="Nationality">
          {countriesData.map((country) => (
            <MenuItem key={country._id} value={country._id}>
              {country.name_english}
            </MenuItem>
          ))}
        </RHFSelect>
        <RHFTextField name="em_identification_num" label="Identification number" />
        <RHFTextField name="em_profrssion_practice_num" label="Profrssion practice number" />
        <RHFTextField name="em_phone" label="Phone number" />
      </Box>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        variant="contained"
        onClick={() => setPage((prev) => prev + 1)}
      >
        Next Step <Iconify width={20} className="arrow" icon="eva:arrow-ios-forward-fill" />
      </LoadingButton>
    </Stack>
  );
  const renderFormAuth = (
    <Stack spacing={2}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      {/* <Alert severity="info">Sign in information</Alert> */}
      <RHFTextField name="email" label="Email address" />
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
  );

  return (
    <>
      {renderHead}
      <FormProvider methods={methods} onSubmit={onSubmit}>
        {page === 0 && renderForm}
        {page === 1 && renderFormEmployee}
        {page === 2 && renderFormAuth}
      </FormProvider>
      {renderTerms}
    </>
  );
}
