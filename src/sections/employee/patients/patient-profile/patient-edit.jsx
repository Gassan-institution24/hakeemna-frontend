import * as Yup from 'yup';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTheme, useMediaQuery, MenuItem } from '@mui/material';

import axios, { endpoints } from 'src/utils/axios';

import { useLocales, useTranslate } from 'src/locales';
import { useGetCountries, useGetCountryCities } from 'src/api';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function EditPatient({ patient }) {
  const { enqueueSnackbar } = useSnackbar();
  const { countriesData } = useGetCountries({ select: 'name_english name_arabic' });
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const isArabic = currentLang.value === 'ar';
  const [em_phone, setEMphone] = useState(patient.mobile_num1);
  const [em_phone2, setEMphone2] = useState(patient.mobile_num2);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
    cloud_storage_link: Yup.string(),
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
    cloud_storage_link: patient?.cloud_storage_link || '',
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
      let errorMessage;
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (isArabic) {
        errorMessage = error.arabic_message;
      } else {
        errorMessage = error.message;
      }
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ 
        p: { xs: 2, sm: 3 }, 
        mx: 0, 
        my: { xs: 1, sm: 2 },
        width: '100%',
        borderRadius: 0 
      }}>
        <Box
          rowGap={{ xs: 2, sm: 3 }}
          columnGap={{ xs: 1, sm: 2 }}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
          sx={{ 
            width: '100%',
            px: 0, 
            '& .MuiFormControl-root, & .MuiTextField-root, & .MuiAutocomplete-root': {
              width: '100%'
            }
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
            name="nationality"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
            size={isMobile ? 'small' : 'medium'}
          >
            {countriesData.map((country) => (
              <MenuItem lang="ar" key={country._id} value={country._id}>
                {isArabic ? country.name_arabic : country.name_english}
              </MenuItem>
            ))}
          </RHFSelect>
          
          {patient?.patient?.user === undefined && (
            <RHFTextField
              name="identification_num"
              label={t('Personal identification number')}
              title={t(
                'The number must be written as it appears in the official document, including letters and symbols'
              )}
            />
          )}

          <RHFSelect
            label={t('residence country')}
            name="country"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
            size={isMobile ? 'small' : 'medium'}
          >
            {countriesData.map((country) => (
              <MenuItem lang="ar" key={country._id} value={country._id}>
                {isArabic ? country.name_arabic : country.name_english}
              </MenuItem>
            ))}
          </RHFSelect>

          <RHFSelect
            label={t('city')}
            name="city"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
            size={isMobile ? 'small' : 'medium'}
          >
            {tableData.map((city) => (
              <MenuItem lang="ar" key={city._id} value={city._id}>
                {isArabic ? city.name_arabic : city.name_english}
              </MenuItem>
            ))}
          </RHFSelect>

          <RHFTextField 
            name="address" 
            label={t('Address')} 
          />

          <Box sx={{ width: '100%' }}>
            <MuiTelInput
              label={t('Mobile Number')}
              forceCallingCode
              defaultCountry="JO"
              value={em_phone}
              onChange={(newPhone) => {
                const cleanedPhone = newPhone.replace(/\s/g, '');
                matchIsValidTel(cleanedPhone);
                setEMphone(cleanedPhone);
                methods.setValue('mobile_num1', cleanedPhone);
              }}
              size={isMobile ? 'small' : 'medium'}
              sx={{ width: '100%' }}
            />
          </Box>
          
          <Box sx={{ width: '100%' }}>
            <MuiTelInput
              label={t('Alternative Mobile Number')}
              forceCallingCode
              defaultCountry="JO"
              value={em_phone2}
              onChange={(newPhone2) => {
                const cleanedPhone = newPhone2.replace(/\s/g, '');
                matchIsValidTel(cleanedPhone);
                setEMphone2(cleanedPhone);
                methods.setValue('mobile_num2', cleanedPhone);
              }}
              size={isMobile ? 'small' : 'medium'}
              sx={{ width: '100%' }}
            />
          </Box>
          
          <RHFTextField
            name="email"
            label={t('Email Address')}
            disabled
          />

          <Controller
            name="birth_date"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                {...field}
                label={t('birth date')}
                sx={{ width: '100%' }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!error,
                    helperText: error?.message,
                    size: isMobile ? 'small' : 'medium',
                  },
                }}
              />
            )}
          />

          <RHFSelect
            label={t('gender')}
            name="gender"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
            size={isMobile ? 'small' : 'medium'}
          >
            {['male', 'female'].map((gender) => (
              <MenuItem lang="ar" key={gender} value={gender}>
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
            name="sport_exercises"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
            size={isMobile ? 'small' : 'medium'}
          >
            {SECDATAFORMAP.map((test) => (
              <MenuItem lang="ar" value={test} key={test}>
                {t(test)}
              </MenuItem>
            ))}
          </RHFSelect>

          <RHFSelect
            label={t('Smoking')}
            name="smoking"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
            size={isMobile ? 'small' : 'medium'}
          >
            {DATAFORMAP.map((test) => (
              <MenuItem lang="ar" value={test} key={test}>
                {t(test)}
              </MenuItem>
            ))}
          </RHFSelect>
          
          <Box 
            sx={{ 
              gridColumn: { xs: '1', sm: '1 / span 2' },
              width: '100%'
            }}
          >
            <RHFTextField
              name="other_medication_notes"
              label={t('More information')}
              multiline
              rows={isMobile ? 3 : 4}
            />
          </Box>
          
          <Box 
            sx={{ 
              gridColumn: { xs: '1', sm: '1 / span 2' },
              width: '100%'
            }}
          >
            <RHFTextField
              name="cloud_storage_link"
              label={t('cloud Storage link for patient data')}
              title={t(
                'If you store patient data (e.g. images, files) on the internet (e.g. Google Drive, etc.), here you can store a link to go directly to that file'
              )}
            />
          </Box>
        </Box>

        <Stack spacing={2} alignItems="flex-end" sx={{ mt: 3, width: '100%', px: 0 }}>
          <LoadingButton 
            type="submit" 
            tabIndex={-1} 
            variant="contained" 
            loading={isSubmitting}
            size={isMobile ? 'small' : 'large'}
            sx={{ 
              width: { xs: '100%', sm: 'auto' },
              py: isMobile ? 1 : 1.5,
              px: isMobile ? 2 : 4
            }}
          >
            {t('Save Changes')}
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}

EditPatient.propTypes = {
  patient: PropTypes.object.isRequired,
};