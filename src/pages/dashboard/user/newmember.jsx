import * as Yup from 'yup';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box } from '@mui/system';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { MenuItem, Typography } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetCountries, useGetCountryCities } from 'src/api';

import Image from 'src/components/image';
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
    name_english: Yup.string().required('english name required'),
    name_arabic: Yup.string().required('arabic name required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .min(8, 'Confirm password must be at least 8 characters'),
    identification_num: Yup.string().required('Identification number is required'),
    birth_date: Yup.date().required('birth_date is required'),
    gender: Yup.string().required('Gender is required'),
    country: Yup.string().required('Country is required'),
    nationality: Yup.string().required('Nationality is required'),
    city: Yup.string().required('City is required'),
  });

  const defaultValues = {
    name_english: '',
    name_arabic: '',
    email: '',
    nationality: '',
    family_members: user?.patient?._id,
    password: '',
    confirmPassword: '',
    birth_date: '',
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
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const { tableData } = useGetCountryCities(values.country);

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
  const handleCountryChange = (event) => {
    const selectedCountryId = event.target.value;
    methods.setValue('country', selectedCountryId, { shouldValidate: true });
  };
  const handleNationalityChange = (event) => {
    const selectedCountryId = event.target.value;
    methods.setValue('nationality', selectedCountryId, { shouldValidate: true });
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      await register?.({ userName: `${data.name_english}`, ...data });
      router.push(paths.dashboard.user.exist);
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Box sx={{ display: 'flex', flexDirection: { md: 'row', xs: 'column' } }}>
        <Stack spacing={2.5} sx={{ width: { md: '50%', xs: '80%' }, ml: 5, mt: 5, mr: 15 }}>
          {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
          <Typography
            variant="h3"
            sx={{ textAlign: 'center', display: { md: 'none', xs: 'block' } }}
          >
            {t('Add Account')}
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="name_english" label={t("full name english")}  onChange={handleEnglishInputChange} />
            <RHFTextField name="name_arabic" label={t("full name arabic")} onChange={handleArabicInputChange}  />
          </Stack>

          <RHFTextField name="identification_num" label={t("Identification number")}/>
          <Controller
            name="birth_date"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                label={t('birth date')}
                // sx={{ flex: 1 }}
                value={new Date(values.birth_date ? values.birth_date : '')}
                onChange={(newValue) => {
                  field.onChange(newValue);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!error,
                    helperText: error?.message,
                  },
                }}
              />
            )}
          />
               <RHFSelect onChange={handleNationalityChange} name="nationality" label={t('nationality')}>
              {countriesData?.map((country, idx) => (
                <MenuItem lang="ar" key={idx}  value={country?._id}>
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
            <RHFSelect name="city" label={t("City")}>
              {tableData?.map((city, idx) => (
                <MenuItem lang="ar" key={idx} value={city?._id}>
                  {city?.name_english}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFSelect name="gender" label={t("Gender")}>
              <MenuItem lang="ar" value="male">
                {t('male')}
              </MenuItem>
              <MenuItem lang="ar" value="female">
                {t('female')}
              </MenuItem>
            </RHFSelect>
          </Stack>
          <RHFTextField name="email" label={t("Email address")} />

          <RHFTextField
            name="password"
            label={t("Password")}
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
            label={t("Confirm Password")}
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
            {t('Create account')}
          </LoadingButton>
        </Stack>
        <Stack sx={{ display: { md: 'block', xs: 'none' }, ml: 10, mt: 5 }}>
          <Typography variant="h3" sx={{ textAlign: 'center' }}>
            {t('Add Account')}
          </Typography>
          <Image src="https://www.sender.net/wp-content/uploads/2022/07/best-newsletter-software.webp" />
        </Stack>
      </Box>
    </FormProvider>
  );
}
