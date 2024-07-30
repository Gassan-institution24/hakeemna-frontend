import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { matchIsValidTel } from 'mui-tel-input';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import { Chip, Divider, MenuItem, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { fData } from 'src/utils/format-number';
import axios, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetCountries,
  useGetUnitservice,
  // useGetSpecialties,
  useGetCountryCities,
  useGetActiveUSTypes,
} from 'src/api';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFCheckbox,
  // RHFSelect,
  RHFTextField,
  RHFTimePicker,
  RHFPhoneNumber,
  RHFAutocomplete,
  RHFUploadAvatar,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function AccountGeneral({ unitServiceData }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const daysOfWeek = [
    t('sunday'),
    t('monday'),
    t('tuesday'),
    t('wednesday'),
    t('thursday'),
    t('friday'),
    t('saturday'),
  ];

  const [companyLogo, setCompanyLog] = useState();

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const { data, refetch } = useGetUnitservice(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service?._id
  );
  const { countriesData } = useGetCountries({ select: 'name_english name_arabic' });
  const { unitserviceTypesData } = useGetActiveUSTypes();
  // const { specialtiesData } = useGetSpecialties();

  const UpdateUserSchema = Yup.object().shape({
    name_english: Yup.string().required(t('required field')),
    name_arabic: Yup.string().required(t('required field')),
    country: Yup.string().required(t('required field')),
    city: Yup.string().required(t('required field')),
    US_type: Yup.string().required(t('required field')),
    email: Yup.string(),
    sector_type: Yup.string(),
    // speciality: Yup.string(),
    identification_num: Yup.string().required(t('required field')),
    address: Yup.string(),
    web_page: Yup.string(),
    work_days: Yup.array(),
    work_start_time: Yup.date(),
    work_end_time: Yup.date(),
    phone: Yup.string()
      .required(t('required field'))
      .test('is-valid-phone', t('Invalid phone number'), (value) => matchIsValidTel(value)),
    mobile_num: Yup.string(),
    introduction_letter: Yup.string(),
    arabic_introduction_letter: Yup.string(),
    location_gps: Yup.string(),
    company_logo: Yup.mixed(),
    facebook: Yup.mixed(),
    instagram: Yup.mixed(),
    other: Yup.mixed(),
    has_tax: Yup.bool(),
    has_deduction: Yup.bool(),
  });

  // const handleCountryChange = (event) => {
  //   const selectedCountryId = event.target.value;
  //   methods.setValue('country', selectedCountryId, { shouldValidate: true });
  //   setSelectedCountry(selectedCountryId);
  // };

  // useEffect(() => {
  //   setCities(
  //     selectedCountry
  //       ? tableData.filter((info) => info?.country?._id === selectedCountry)
  //       : tableData
  //   );
  // }, [tableData, selectedCountry]);

  const defaultValues = {
    name_english: data?.name_english || '',
    name_arabic: data?.name_arabic || '',
    country: data?.country._id || null,
    city: data?.city._id || null,
    US_type: data?.US_type?._id || null,
    email: data?.email || '',
    sector_type: data?.sector_type || '',
    // speciality: data?.speciality?._id || null,
    identification_num: data?.identification_num || '',
    address: data?.address || '',
    web_page: data?.web_page || '',
    work_days: data?.work_days || [],
    work_start_time: data?.work_start_time || null,
    work_end_time: data?.work_end_time || null,
    phone: data?.phone || '',
    mobile_num: data?.mobile_num || '',
    introduction_letter: data?.introduction_letter || '',
    arabic_introduction_letter: data?.arabic_introduction_letter || '',
    location_gps: data?.location_gps || '',
    company_logo: data?.company_logo || '',
    facebook: data?.facebook || '',
    instagram: data?.instagram || '',
    other: data?.other || '',
    has_tax: data?.has_tax || false,
    has_deduction: data?.has_deduction || false,
  };

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });
  const {
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (Object.keys(errors).length) {
      Object.keys(errors).forEach((key, idx) =>
        enqueueSnackbar(`${key}: ${errors?.[key]?.message || 'error'}`, { variant: 'error' })
      );
    }
  }, [errors, enqueueSnackbar]);

  const values = watch();
  const { tableData } = useGetCountryCities(watch().country, {
    select: 'name_english name_arabic',
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setCompanyLog(file);
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('company_logo', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const onSubmit = handleSubmit(async (dataToSend) => {
    try {
      const formData = new FormData();
      if (companyLogo) {
        formData.append('company_logo_pic', companyLogo);
        await axios.patch(
          `${endpoints.unit_services.one(
            user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service
              ._id
          )}/updatelogo`,
          formData
        );
        socket.emit('updated', {
          user,
          link: paths.unitservice.profile.root,
          msg: `uploaded logo to unit of service profile`,
        });
      }
      await axios.patch(
        endpoints.unit_services.one(
          user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id
        ),
        dataToSend
      );
      enqueueSnackbar(t('updated successfully!'));
      socket.emit('updated', {
        user,
        link: paths.unitservice.profile.root,
        msg: `updated the unit of service profile`,
      });
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

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 5, height: { md: '100%' }, pb: { xs: 5 }, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  {t('max size of')} {fData(3145728)}
                </Typography>
              }
              maxSize={3145728}
              name="company_logo"
              onDrop={handleDrop}
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
              <TextField
                // disabled
                variant="filled"
                name="identification_num"
                value={values.identification_num}
                label={`${t('ID number')}* :`}
              />
              <TextField
                variant="filled"
                name="name_english"
                value={values.name_english}
                label={`${t('name english')}* :`}
              />
              <TextField
                variant="filled"
                name="name_arabic"
                value={values.name_arabic}
                label={`${t('name arabic')}* :`}
              />
              <RHFTextField
                type="email"
                variant="filled"
                name="email"
                label={`${t('institution email')}* :`}
              />
              <RHFPhoneNumber name="phone" label={t('phone number')} />
                <Divider />
              <Stack alignItems="flex-start" gap={1} >
                <Typography variant='subtitle1'>{t('finantial information')}</Typography>
                <RHFCheckbox
                  name="has_tax"
                  onChange={() => setValue('has_tax', !values.has_tax)}
                  label={t('subject to sales tax')}
                />
                <RHFCheckbox
                  name="has_deduction"
                  onChange={() => setValue('has_deduction', !values.has_deduction)}
                  label={t('subject to deductions - income tax or doctors syndicate')}
                />
              </Stack>
              {/* <RHFTextField
                
                type="number"
                variant="filled"
                name="phone"
                label={`${t('phone')} :`}
              /> */}
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
              <TextField
                select
                label={`${t('country')} *`}
                disabled
                fullWidth
                name="country"
                value={values.country}
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              // onChange={handleCountryChange}
              >
                {countriesData.map((country, idx) => (
                  <MenuItem lang="ar" key={idx} value={country._id}>
                    {curLangAr ? country.name_arabic : country.name_english}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label={`${t('city')} *`}
                disabled
                fullWidth
                name="city"
                InputLabelProps={{ shrink: true }}
                value={values.city}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {tableData.map((city, idx) => (
                  <MenuItem lang="ar" key={idx} value={city._id}>
                    {curLangAr ? city.name_arabic : city.name_english}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label={`${t('unit of service type')} *`}
                fullWidth
                disabled
                name="US_type"
                InputLabelProps={{ shrink: true }}
                value={values.US_type}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {unitserviceTypesData.map((type, idx) => (
                  <MenuItem lang="ar" value={type._id} key={idx}>
                    {curLangAr ? type.name_arabic : type.name_english}
                  </MenuItem>
                ))}
              </TextField>

              {/* <RHFSelect
                label={`${t('specialty')} *`}
                fullWidth
                name="speciality"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {specialtiesData.map((specialty, idx) => (
                  <MenuItem lang="ar" value={specialty._id} key={idx}>
                    {curLangAr ? specialty.name_arabic : specialty.name_english}
                  </MenuItem>
                ))}
              </RHFSelect> */}
              <TextField
                disabled
                select
                label={t('sector type')}
                fullWidth
                name="sector_type"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
                value={values.sector_type}
              >
                <MenuItem lang="ar" value="public">
                  {t('Public')}
                </MenuItem>
                <MenuItem lang="ar" value="private">
                  {t('private')}
                </MenuItem>
                <MenuItem lang="ar" value="charity">
                  {t('Charity')}
                </MenuItem>
              </TextField>
              <RHFPhoneNumber name="mobile_num" label={t('alternative mobile number')} />
              <RHFTextField name="web_page" label={t('webpage')} />
              <RHFTimePicker name="work_start_time" label={t('work start time')} />
              <RHFTimePicker
                name="work_end_time"
                label={t('work end time')}
                helperText={t(
                  'choose 12 am for both start and end time if you are working 24 hours'
                )}
              />
              <RHFTextField name="location_gps" label={t('location GPS')} />
              <RHFTextField name="facebook" label={t('facebook url')} />
              <RHFTextField name="instagram" label={t('instagram url')} />
              <RHFTextField name="other" label={t('other social media')} />
            </Box>
            <RHFAutocomplete
              sx={{ mt: 3 }}
              name="work_days"
              label={`${t('work days')} *`}
              multiple
              disableCloseOnSelect
              options={daysOfWeek.filter(
                (option) => !values.work_days.some((item) => option === item)
              )}
              getOptionLabel={(option) => option}
              renderOption={(props, option, idx) => (
                <li lang="ar" {...props} key={idx} value={option}>
                  {option}
                </li>
              )}
              // onChange={(event, newValue) => {
              //   // setSelectedEmployees(newValue);
              //   methods.setValue('work_days', newValue, { shouldValidate: true });
              // }}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={index}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            />
            <RHFTextField multiline sx={{ mt: 3 }} rows={2} name="address" label={t('address')} />
            <RHFTextField
              multiline
              colSpan={14}
              rows={4}
              sx={{ mt: 3 }}
              onChange={handleEnglishInputChange}
              name="introduction_letter"
              label={t('introduction letter in english')}
            />
            <RHFTextField
              multiline
              colSpan={14}
              rows={4}
              sx={{ mt: 3 }}
              onChange={handleArabicInputChange}
              name="arabic_introduction_letter"
              label={t('introduction letter in arabic')}
            />

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
  unitServiceData: PropTypes.object,
  // refetch: PropTypes.func,
};
