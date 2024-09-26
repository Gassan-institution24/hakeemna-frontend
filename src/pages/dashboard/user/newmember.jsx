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

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_SIGNUP } from 'src/config-global';
import { useLocales, useTranslate } from 'src/locales';
import { useGetCountries, useGetCountryCities } from 'src/api';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import FormProvider, { RHFSelect, RHFUpload, RHFTextField } from 'src/components/hook-form';

import Family from './imges/family.png';

export default function Create() {
  const { countriesData } = useGetCountries({ select: 'name_english name_arabic' });
  const { register } = useAuthContext();
  const { t } = useTranslate();
  const [identification, setIdentification] = useState();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const password = useBoolean();
  const RegisterSchema = Yup.object().shape({
    name_english: Yup.string().required('english name required'),
    name_arabic: Yup.string().required('arabic name required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), t('must be exactly as password')], 'Passwords must match')
      .min(8, `${t('must be at least')} 8`),
    scanned_identification: Yup.mixed().required(t('required field')),
    identification_num: Yup.string().required('Identification number is required'),
    birth_date: Yup.mixed().required('birth_date is required'),
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
    password: '',
    confirmPassword: '',
    scanned_identification: null,
    birth_date: '',
    identification_num: '',
    gender: '',
    country: null,
    city: null,
  };

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    watch,
    setValue,
    control,
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
  };
  const handleNationalityChange = (event) => {
    const selectedCountryId = event.target.value;
    methods.setValue('nationality', selectedCountryId, { shouldValidate: true });
  };
  const handleDrop = (acceptedFiles) => {
    setIdentification(acceptedFiles);
    if (acceptedFiles && acceptedFiles.length > 0) {
      const newFile = Object.assign(acceptedFiles[0], {
        preview: URL.createObjectURL(acceptedFiles[0]),
      });
      setValue('scanned_identification', newFile);
    }
  };
  const onSubmit = handleSubmit(async (data) => {
    try {
      data.email = data.email?.toLowerCase();
      const formData = new FormData();
      formData.append('identification', identification[0]);
      Object.keys(data).forEach((key) => {
        if (key !== 'scanned_identification') {
          if (Array.isArray(data[key])) {
            data[key].forEach((item, index) => {
              formData.append(`${key}[${index}]`, item);
            });
          } else {
            formData.append(key, data[key]);
          }
        }
      });
      await register?.({ userName: `${data.name_english}`, ...data });
      router.push(paths.auth.verify(data.email) || PATH_AFTER_SIGNUP);
    } catch (error) {
      console.error(error);
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
            <RHFTextField
              name="name_english"
              label={t('full name english')}
              onChange={handleEnglishInputChange}
            />
            <RHFTextField
              name="name_arabic"
              label={t('full name arabic')}
              onChange={handleArabicInputChange}
            />
          </Stack>

          <RHFTextField name="identification_num" label={t('Identification number')} />
          <Stack gap={1}>
            <Typography variant="caption" sx={{ color: 'warning.main' }}>
              {t('upload the photo with the identification number in the proof document')}
            </Typography>
            <RHFUpload name="scanned_identification" onDrop={handleDrop} />
          </Stack>
          <Controller
            name="birth_date"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                label={t('birth date')}
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
              <MenuItem lang="ar" key={idx} value={country?._id}>
                {curLangAr ? country?.name_arabic : country?.name_english}
              </MenuItem>
            ))}
          </RHFSelect>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFSelect onChange={handleCountryChange} name="country" label={t('country')}>
              {countriesData?.map((country, idx) => (
                <MenuItem lang="ar" key={idx} value={country?._id}>
                  {curLangAr ? country?.name_arabic : country?.name_english}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFSelect name="city" label={t('City')}>
              {tableData?.map((city, idx) => (
                <MenuItem lang="ar" key={idx} value={city?._id}>
                  {curLangAr ? city?.name_arabic : city?.name_english}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFSelect name="gender" label={t('Gender')}>
              <MenuItem lang="ar" value="male">
                {t('male')}
              </MenuItem>
              <MenuItem lang="ar" value="female">
                {t('female')}
              </MenuItem>
            </RHFSelect>
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
        <Stack sx={{ display: { md: 'block', xs: 'none' }, ml: 4, mt: 5 }}>
          <Typography variant="h3" sx={{ textAlign: 'center' }}>
            {t('Add Account')}
          </Typography>
          <Image src={Family} />
        </Stack>
      </Box>
    </FormProvider>
  );
}
