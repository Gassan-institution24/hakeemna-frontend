import * as Yup from 'yup';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import LoadingButton from '@mui/lab/LoadingButton';

import axios, { endpoints } from 'src/utils/axios';

import { useTranslate, useLocales } from 'src/locales';
import { useGetCountries, useGetCountryCities } from 'src/api';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function EditPatient({ patient }) {
  const { enqueueSnackbar } = useSnackbar();
  const { countriesData } = useGetCountries({ select: 'name_english name_arabic' });
  const { t, i18n } = useTranslate();
  const { currentLang } = useLocales();
  const isArabic = currentLang.value === 'ar';
  const [em_phone, setEMphone] = useState(patient.mobile_num1);
  const [em_phone2, setEMphone2] = useState(patient.mobile_num2);
  const handleArabicInputChange = (event) => {
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_\-().]*$/;
    if (arabicRegex.test(event.target.value)) {
      methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };

  const handleEnglishInputChange = (event) => {
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%.()]*$/;
    if (englishRegex.test(event.target.value)) {
      methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };

  const UpdateUserSchema = Yup.object().shape({
    name_english: Yup.string(),
    name_arabic: Yup.string(),
    email: Yup.string(),
    height: Yup.string(),
    weight: Yup.string(),
    mobile_num1: Yup.string(),
    mobile_num2: Yup.string(),
    nationality: Yup.string().nullable(),
    country: Yup.string().nullable(),
    gender: Yup.string().nullable(),
    birth_date: Yup.mixed().nullable(),
    city: Yup.string().nullable(),
    address: Yup.string(),
    sport_exercises: Yup.string(),
    smoking: Yup.string(),
    identification_num: Yup.string(),
  });
  const DATAFORMAP = ['not smoker', 'light smoker', 'heavy smoker'];
  const SECDATAFORMAP = ['0', 'once a week', 'twice a week', '3-4 times a week', 'often'];

  const defaultValues = {
    name_english: patient?.name_english || '',
    name_arabic: patient?.name_arabic || '',
    email: patient?.email || '',
    gender: patient?.gender || '',
    birth_date: patient?.birth_date ? new Date(patient.birth_date) : null,
    height: patient?.height || '',
    weight: patient?.weight || '',
    mobile_num1: patient?.mobile_num1 || '',
    mobile_num2: patient?.mobile_num2 || '',
    nationality: patient?.nationality?._id || patient?.nationality || null,
    country: patient?.country?._id || patient?.country || null,
    city: patient?.city?._id || patient?.city || null,
    address: patient?.address || '',
    sport_exercises: patient?.sport_exercises || '',
    smoking: patient?.smoking || '',
    other_medication_notes: patient?.other_medication_notes || '',
    identification_num: patient?.identification_num || '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting },
  } = methods;

  const { tableData } = useGetCountryCities(watch().country, {
    select: 'name_english name_arabic',
  });

  const onSubmit = async (profileData) => {
    try {
      await axios.patch(`${endpoints.usPatients.one(patient?._id)}`, profileData);
      enqueueSnackbar(`${t('Profile updated successfully')}`, { variant: 'success' });
    } catch (error) {
      // eslint-disable-next-line no-nested-ternary
      enqueueSnackbar(typeof error === 'string' ? error : isArabic ? error.arabic_message : error.message, { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3, mx: { md: 15 } }}>
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
            name="name_english"
            label={t('name in english')}
            onChange={handleEnglishInputChange}
          />

          <RHFTextField
            name="name_arabic"
            label={t('Name in arabic')}
            onChange={handleArabicInputChange}
          />

          <RHFSelect
            label={t('nationality')}
            fullWidth
            name="nationality"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
          >
            {countriesData.map((country, idx) => (
              <MenuItem lang="ar" key={idx} value={country._id}>
                {isArabic ? country.name_arabic : country.name_english}
              </MenuItem>
            ))}
          </RHFSelect>
          {patient?.patient?.user === undefined && <RHFTextField name="identification_num" label={t('Identification number')} />}

          <RHFSelect
            label={t('residence country')}
            fullWidth
            name="country"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
          >
            {countriesData.map((country, idx) => (
              <MenuItem lang="ar" key={idx} value={country._id}>
                {isArabic ? country.name_arabic : country.name_english}
              </MenuItem>
            ))}
          </RHFSelect>

          <RHFSelect
            label={t('city')}
            fullWidth
            name="city"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
          >
            {tableData.map((city, idx) => (
              <MenuItem lang="ar" key={idx} value={city._id}>
                {isArabic ? city.name_arabic : city.name_english}
              </MenuItem>
            ))}
          </RHFSelect>

          <RHFTextField name="address" label={t('Address')} />

          <MuiTelInput
            label={t('Mobile Number')}
            forceCallingCode
            defaultCountry="JO"
            value={em_phone}
            onChange={(newPhone) => {
              matchIsValidTel(newPhone);
              setEMphone(newPhone);
              methods.setValue('mobile_num1', newPhone);
            }}
          />
          <MuiTelInput
            label={t('Alternative Mobile Number')}
            forceCallingCode
            defaultCountry="JO"
            value={em_phone2}
            onChange={(newPhone2) => {
              matchIsValidTel(newPhone2);
              setEMphone2(newPhone2);
              methods.setValue('mobile_num2', newPhone2);
            }}
          />
          <RHFTextField
            name="email"
            label={t('Email Address')}
            // onChange={handleArabicInputChange}
            disabled
          />
          
          <Controller
            name="birth_date"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                {...field}
                label={t('birth date')}
                sx={{ mb: 2 }}
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

          <RHFSelect
            label={t('gender')}
            fullWidth
            name="gender"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
          >
            {['male', 'female'].map((gender, idx) => (
              <MenuItem lang="ar" key={idx} value={gender}>
                {t(gender)}
              </MenuItem>
            ))}
          </RHFSelect>
          
          <RHFTextField
            name="height"
            label={
              <span>
                {t('Height')}
                <span style={{ color: 'green', fontWeight: 600 }}>/</span> {t('cm')}
              </span>
            }
          />
          <RHFTextField
            name="weight"
            label={
              <span>
                {t('Weight')}
                <span style={{ color: 'green', fontWeight: 600 }}>/</span> {t('kg')}
              </span>
            }
          />

          <RHFSelect
            label={t('Sport Exercises')}
            fullWidth
            name="sport_exercises"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
          >
            {SECDATAFORMAP.map((test, idx) => (
              <MenuItem lang="ar" value={test} key={idx}>
                {t(test)}
              </MenuItem>
            ))}
          </RHFSelect>

          <RHFSelect
            label={t('Smoking')}
            fullWidth
            name="smoking"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
          >
            {DATAFORMAP.map((test, idx) => (
              <MenuItem lang="ar" value={test} key={idx}>
                {t(test)}
              </MenuItem>
            ))}
          </RHFSelect>
          <RHFTextField name="other_medication_notes" label={t('More information')} />
          {patient?.patient?.user === undefined && <RHFTextField name="identification_num" label={t('ID Number')} />}
        </Box>

        <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" tabIndex={-1} variant="contained" loading={isSubmitting}>
            {t('Save Changes')}
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
EditPatient.propTypes = {
  patient: PropTypes.func,
};
