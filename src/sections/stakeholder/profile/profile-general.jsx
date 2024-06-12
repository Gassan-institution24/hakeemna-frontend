import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useCallback } from 'react';
import { matchIsValidTel } from 'mui-tel-input';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import { MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import axios, { endpoints } from 'src/utils/axios';

import { useLocales, useTranslate } from 'src/locales';
import {
  useGetCountries,
  useGetCountryCities,
} from 'src/api';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFPhoneNumber,
  RHFUploadAvatar,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function AccountGeneral({ employeeData, refetch }) {
  const { enqueueSnackbar } = useSnackbar();

  const { countriesData } = useGetCountries();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const UpdateUserSchema = Yup.object().shape({
    email: Yup.string().required(t('required field')),
    name_english: Yup.string()
      .required(t('required field')),
    name_arabic: Yup.string()
      .required(t('required field')),
    country: Yup.string().required(t('required field')),
    city: Yup.string().nullable(),
    identification_num: Yup.string()
      .required(t('required field'))
      .min(8, `${t('must be at least')} 8`)
      .max(15, `${t('must be at most')} 15`),
    tax_num: Yup.string(),
    address: Yup.string(),
    web_page: Yup.string(),
    phone: Yup.string()
      .required(t('required field'))
      .test('is-valid-phone', t('Invalid phone number'), (value) => matchIsValidTel(value)),
    mobile_num: Yup.string(),
    // gender: Yup.string().required(t('required field')),
    // birth_date: Yup.date().required(t('required field')),
  });

  const defaultValues = {
    email: employeeData?.email || '',
    name_english: employeeData?.name_english || '',
    name_arabic: employeeData?.name_arabic || '',
    country: employeeData?.country?._id || '',
    city: employeeData?.city?._id || '',
    identification_num: employeeData?.identification_num || '',
    tax_num: employeeData?.tax_num || '',
    address: employeeData?.address || '',
    web_page: employeeData?.web_page || '',
    phone: employeeData?.phone || '',
    mobile_num: employeeData?.mobile_num || '',
    // gender: employeeData?.gender || '',
    // birth_date: employeeData?.birth_date || null,
    picture: employeeData?.picture || null,
  };
  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });
  const {
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = methods;

  const { tableData } = useGetCountryCities(watch().country);
  useEffect(() => {
    if (Object.keys(errors).length) {
      Object.keys(errors).forEach((key, idx) =>
        enqueueSnackbar(`${key}: ${errors?.[key]?.message || 'error'}`, { variant: 'error' })
      );
    }
  }, [errors, enqueueSnackbar]);

  const values = watch();

  const handleDrop = useCallback(
    async (name, acceptedFiles) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        // setValue(name, newFile, { shouldValidate: true });
        try {
          const formData = new FormData();
          formData.append(name, newFile);
          await axios.patch(
            endpoints.stakeholder.one(employeeData._id),
            // ...data,
            formData
          );
          enqueueSnackbar(t('updated successfully!'));
          refetch();
        } catch (error) {
          // error emitted in backend
          enqueueSnackbar(
            curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
            {
              variant: 'error',
            }
          );
          console.error(error);
        }
      }
    },
    // eslint-disable-next-line
    [setValue, curLangAr, employeeData, enqueueSnackbar, refetch, values, t]
  );

  const onSubmit = handleSubmit(async (data) => {
    try {
      const dataToSubmit = data;
      delete dataToSubmit.company_logo;
      await axios.patch(endpoints.stakeholder.one(employeeData._id), dataToSubmit);
      enqueueSnackbar(t('updated successfully!'));
      refetch();
    } catch (error) {
      // error emitted in backend
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
      console.error(error);
    }
  });

  const handleEnglishInputChange = (event) => {
    // Validate the input based on English language rules
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%.()]*$/; // Only allow letters and spaces

    if (englishRegex.test(event.target.value)) {
      methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };

  const handleArabicInputChange = (event) => {
    // Validate the input based on Arabic language rules
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_\-()]*$/; // Range for Arabic characters

    if (arabicRegex.test(event.target.value)) {
      methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* img */}
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 5, height: { md: '100%' }, pb: { xs: 5 }, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              maxSize={3145728}
              name="company_logo"
              onDrop={(acceptedFiles) => handleDrop('company_logo', acceptedFiles)}
            />
            <Box
              rowGap={3}
              columnGap={2}
              sx={{ mt: 5 }}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >
              <RHFTextField
                variant="filled"
                name="name_english"
                onChange={handleEnglishInputChange}
                label={`${t('Full name in English')} *`}
              />
              <RHFTextField
                variant="filled"
                name="name_arabic"
                onChange={handleArabicInputChange}
                label={t('Full name in Arabic')}
              />
              <RHFTextField
                // disabled
                variant="filled"
                name="identification_num"
                label={`${t('ID number')} :`}
                // value={values.identification_num}
              />
              <TextField
                // disabled
                type="email"
                variant="filled"
                name="email"
                label={`${t('email')} :`}
                value={values.email}
              />
              <RHFPhoneNumber name="phone" label={t('phone number')} />
            </Box>
          </Card>
        </Grid>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 3, pt: 5 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFSelect
                label={`${t('country')} *`}
                fullWidth
                name="country"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {countriesData.map((country, idx) => (
                  <MenuItem lang="ar" key={idx} value={country._id}>
                    {curLangAr ? country.name_arabic : country.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect
                label={`${t('city')} *`}
                fullWidth
                name="city"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {tableData.map((city, idx) => (
                  <MenuItem lang="ar" key={idx} value={city._id}>
                    {curLangAr ? city.name_arabic : city.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField type="number" name="tax_num" label={t('tax number')} />
              <RHFPhoneNumber name="mobile_num" label={t('alternative mobile number')} />
              {/* <RHFSelect
                label={`${t('gender')} *`}
                fullWidth
                name="gender"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                <MenuItem lang="ar" value="male">
                  {t('male')}
                </MenuItem>
                <MenuItem lang="ar" value="female">
                  {t('female')}
                </MenuItem>
              </RHFSelect>
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
              /> */}
              <RHFTextField name="web_page" label={t('web page')} />
            </Box>
            <RHFTextField multiline sx={{ mt: 3 }} rows={2} name="address" label={t('address')} />
            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" tabIndex={-1} variant="contained" loading={isSubmitting}>
                {t('save changes')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
AccountGeneral.propTypes = {
  employeeData: PropTypes.object,
  refetch: PropTypes.func,
};
