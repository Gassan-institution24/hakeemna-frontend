import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_SIGNUP } from 'src/config-global';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetCountries,
  // useGetSpecialties,
  useGetCountryCities,
  // useGetActiveUSTypes,
} from 'src/api';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function JwtRegisterView() {
  const { register } = useAuthContext();

  const router = useRouter();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [errorMsg, setErrorMsg] = useState('');

  // const [selectedCountry, setSelectedCountry] = useState('');

  // const [cities, setCities] = useState([]);

  const { countriesData } = useGetCountries({ select: 'name_english name_arabic' });

  // const { unitserviceTypesData } = useGetActiveUSTypes();

  // const { specialtiesData } = useGetSpecialties();

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
    // US_type: Yup.string().required('unit of service type is required'),
    // speciality: Yup.string().nullable(),
    // sector_type: Yup.string().required('Sector type is required'),
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
    // US_type: null,
    // speciality: null,
    // sector_type: '',
  };

  const methods = useForm({
    mode: 'all',
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

  const { tableData } = useGetCountryCities(values.country, { select: 'name_english name_arabic' });

  const handleArabicInputChange = (event) => {
    // Validate the input based on Arabic language rules
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_\-().]*$/; // Range for Arabic characters

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

  const handleCountryChange = (event) => {
    const selectedCountryId = event.target.value;
    methods.setValue('country', selectedCountryId, { shouldValidate: true });
    // setSelectedCountry(selectedCountryId);
    // setCities(tableData.filter((data)=>data?.country?._id === event.target.value))
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      await register?.({
        role: 'stakeholder',
        userName: data.name_english,
        ...data,
      });

      router.push(paths.auth.verify(data.email) || returnTo || PATH_AFTER_SIGNUP);
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });
  // useEffect(() => {
  //   setCities(
  //     selectedCountry
  //       ? tableData.filter((data) => data?.country?._id === selectedCountry)
  //       : tableData
  //   );
  // }, [tableData, selectedCountry]);
  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
      <Typography variant="h4">{t('Get started absolutely free')}</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2"> {t('Already have an account?')} </Typography>

        <Link href={paths.auth.login} component={RouterLink} variant="subtitle2">
          {t('login')}
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
      {t('By signing up, I agree to ')}
      <Link underline="always" color="text.primary">
        {t('Terms of Service')}
      </Link>
      {t('and ')}
      <Link underline="always" color="text.primary">
        {t('Privacy Policy')}
      </Link>
      .
    </Typography>
  );

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField
            onChange={handleEnglishInputChange}
            name="name_english"
            label={t('name in english')}
          />
          <RHFTextField
            onChange={handleArabicInputChange}
            name="name_arabic"
            label={t('Name in arabic')}
          />
        </Stack>

        <RHFTextField name="email" label={t('Email address')} />
        <RHFTextField name="identification_num" label={t('Identification number')} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFSelect onChange={handleCountryChange} name="country" label={t('country')}>
            {countriesData.map((country, idx) => (
              <MenuItem lang="ar" key={idx} value={country._id}>
                {curLangAr ? country.name_arabic : country.name_english}
              </MenuItem>
            ))}
          </RHFSelect>
          <RHFSelect name="city" label={t('City')}>
            {tableData.map((city, idx) => (
              <MenuItem lang="ar" key={idx} value={city._id}>
                {curLangAr ? city.name_arabic : city.name_english}
              </MenuItem>
            ))}
          </RHFSelect>
        </Stack>
        {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}> */}
        {/* <RHFSelect name="US_type" label="unit of service Type">
            {unitserviceTypesData.map((type, idx) => (
              <MenuItem lang="ar" key={idx} value={type._id}>
                {type.name_english}
              </MenuItem>
            ))}
          </RHFSelect> */}
        {/* <RHFSelect name="speciality" label="Speciality">
            {specialtiesData.map((specialty, idx) => (
              <MenuItem lang="ar" key={idx} value={specialty._id}>
                {specialty.name_english}
              </MenuItem>
            ))}
          </RHFSelect> */}
        {/* </Stack> */}
        {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFSelect name="sector_type" label="Sector type">
            <MenuItem lang="ar" value="public">
              Public
            </MenuItem>
            <MenuItem lang="ar" value="private">
              private
            </MenuItem>
            <MenuItem lang="ar" value="charity">
              Charity
            </MenuItem>
          </RHFSelect>
        </Stack> */}

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
