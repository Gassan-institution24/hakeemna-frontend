import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { matchIsValidTel } from 'mui-tel-input';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { MenuItem } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_SIGNUP } from 'src/config-global';
import { useGetCountries, useGetCountryCities } from 'src/api';

import Iconify from 'src/components/iconify';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFDatePicker,
  RHFPhoneNumber,
} from 'src/components/hook-form';

import Form from './form.png';
// ----------------------------------------------------------------------

export default function JwtRegisterView() {
  const { register } = useAuthContext();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { t } = useTranslate();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  // const [selectedCountry, setSelectedCountry] = useState('');

  // const [cities, setCities] = useState([]);

  const { countriesData } = useGetCountries();

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const RegisterSchema = Yup.object().shape({
    name_english: Yup.string()
      .required('Englis name is required')
      .test('at-least-three-words', t('must be at least three words'), (value) => {
        if (!value) return false; // If no value, fail the validation
        const words = value.trim().split(/\s+/); // Split the input by spaces
        return words.length >= 3; // Return true if there are at least three words
      }),
    name_arabic: Yup.string()
      .required('Arabic name is required')
      .test('at-least-three-words', t('must be at least three words'), (value) => {
        if (!value) return false; // If no value, fail the validation
        const words = value.trim().split(/\s+/); // Split the input by spaces
        return words.length >= 3; // Return true if there are at least three words
      }),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .min(8, 'Confirm password must be at least 8 characters'),
    identification_num: Yup.string().required('Identification number is required'),
    mobile_num1: Yup.string()
      .required('Mobile number is required')
      .test('is-valid-phone', t('Invalid phone number'), (value) => matchIsValidTel(value)),
    gender: Yup.string().required('Gender is required'),
    birth_date: Yup.date()
      .required('birth date is required')
      .test('is-adult', 'You must be at least 18 years old', (value) => {
        const oldage = new Date();
        const minDate = new Date(oldage.getFullYear() - 18, oldage.getMonth(), oldage.getDate());
        return value <= minDate;
      }),
    nationality: Yup.string().required('Nationality is required'),
    country: Yup.string().required('Country is required'),
    city: Yup.string().required('City is required'),
  });

  const defaultValues = {
    name_english: '',
    name_arabic: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile_num1: '',
    identification_num: '',
    gender: '',
    birth_date: today,
    country: null,
    nationality: null,
    city: null,
  };

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const { tableData } = useGetCountryCities(values.country);

  const handleCountryChange = (event) => {
    const selectedCountryId = event.target.value;
    methods.setValue('country', selectedCountryId, { shouldValidate: true });
    // setSelectedCountry(selectedCountryId);
    // setCities(tableData.filter((data)=>data?.country?._id === event.target.value))
  };

  const handleArabicInputChange = (event) => {
    // Validate the input based on Arabic language rules
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_\-()]*$/; // Range for Arabic characters
    if (arabicRegex.test(event.target.value)) {
      methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };

  const handleEnglishInputChange = (event) => {
    // Validate the input based on English language rules
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%.()]*$/; // Only allow letters and spaces

    if (englishRegex.test(event.target.value)) {
      methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };
  const onSubmit = handleSubmit(async (data) => {
    try {
      await register?.({ userName: `${data.name_english} ${data.name_arabic}`, ...data });
      router.push(paths.auth.verify(data.email) || returnTo || PATH_AFTER_SIGNUP);
    } catch (error) {
      console.error(error);
      // reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
      <Typography variant="h4">{t('Get started absolutely free')}</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2"> {t('Already have an account?')} </Typography>

        <Link href={paths.auth.login} component={RouterLink} variant="subtitle2">
          {t('login')}
        </Link>
      </Stack>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">
          {' '}
          {t('I am a ')}{' '}
          <Link href={paths.auth.registersu} component={RouterLink} variant="subtitle2">
            {t('services provider')}
          </Link>
        </Typography>
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
      <Link underline="always" color="success.main">
        {t('Terms of Service ')}
      </Link>
      {t('and ')}
      <Link underline="always" color="success.main">
        {t('Privacy Policy')}
      </Link>
      .
    </Typography>
  );

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2.5}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField
            name="name_english"
            label={t('name in english')}
            onChange={handleEnglishInputChange}
          />
          <RHFTextField
            name="name_arabic"
            label={t('name in arabic')}
            onChange={handleArabicInputChange}
          />
        </Stack>

        <RHFTextField name="identification_num" label={t('Identification number')} />
        <RHFPhoneNumber name="mobile_num1" label={t('mobile number')} />
        <RHFSelect name="nationality" label={t('nationality')}>
          {countriesData?.map((country, idx) => (
            <MenuItem lang="ar" key={idx} value={country?._id}>
              {country?.name_english}
            </MenuItem>
          ))}
        </RHFSelect>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFSelect onChange={handleCountryChange} name="country" label={t('country')}>
            {countriesData?.map((country, idx) => (
              <MenuItem lang="ar" key={idx} value={country?._id}>
                {country?.name_english}
              </MenuItem>
            ))}
          </RHFSelect>
          <RHFSelect name="city" label={t('City')}>
            {tableData?.map((city, idx) => (
              <MenuItem lang="ar" key={idx} value={city?._id}>
                {city?.name_english}
              </MenuItem>
            ))}
          </RHFSelect>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFSelect name="gender" label={t('Gender')}>
            <MenuItem lang="ar" value="male">
              {t('male')}
            </MenuItem>
            <MenuItem lang="ar" value="female">
              {t('female')}
            </MenuItem>
          </RHFSelect>
          <RHFDatePicker name="birth_date" label={t('Date of birth')} />
        </Stack>

        <RHFTextField name="email" label={t('Email address')} />
        <RHFTextField
          name="password"
          label={t('Password')}
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
          label={t('Confirm Password')}
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
          {t('create account')}
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

// {/* <Stack
// sx={{
//   backgroundImage: `url(${Form})`,
//   backgroundSize: 'cover',
//   backgroundPosition: 'center',
// }}
// > */}
