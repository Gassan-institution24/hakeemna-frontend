import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { MenuItem, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { fData } from 'src/utils/format-number';
import axios, { endpoints } from 'src/utils/axios';

import { socket } from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetCities,
  useGetUSTypes,
  useGetCountries,
  useGetUnitservice,
  useGetSpecialties,
} from 'src/api';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function AccountGeneral({ unitServiceData }) {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [cities, setCities] = useState([]);
  const [companyLogo, setCompanyLog] = useState();

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const { data, refetch } = useGetUnitservice(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service?._id
  );
  const { countriesData } = useGetCountries();
  const { tableData } = useGetCities();
  const { unitserviceTypesData } = useGetUSTypes();
  const { specialtiesData } = useGetSpecialties();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  // console.log('unitServiceData', data);

  const UpdateUserSchema = Yup.object().shape({
    name_english: Yup.string().required('Name is required.'),
    name_arabic: Yup.string().required('Name is required.'),
    country: Yup.string().required('Country is required.'),
    city: Yup.string().required('City is required.'),
    US_type: Yup.string().required('Unit service type is required.'),
    email: Yup.string().required('Email is required.'),
    sector_type: Yup.string().required('Sector type is required.'),
    speciality: Yup.string(),
    identification_num: Yup.string().required('ID number is required.'),
    address: Yup.string(),
    web_page: Yup.string(),
    phone: Yup.string().required('Phone number is required.'),
    mobile_num: Yup.string(),
    introduction_letter: Yup.string(),
    location_gps: Yup.string(),
    company_logo: Yup.mixed(),
  });

  const handleCountryChange = (event) => {
    const selectedCountryId = event.target.value;
    methods.setValue('country', selectedCountryId, { shouldValidate: true });
    setSelectedCountry(selectedCountryId);
  };

  useEffect(() => {
    setCities(
      selectedCountry
        ? tableData.filter((info) => info?.country?._id === selectedCountry)
        : tableData
    );
  }, [tableData, selectedCountry]);

  const defaultValues = {
    name_english: data?.name_english || '',
    name_arabic: data?.name_arabic || '',
    country: data?.country._id || null,
    city: data?.city._id || null,
    US_type: data?.US_type?._id || null,
    email: data?.email || '',
    sector_type: data?.sector_type || '',
    speciality: data?.speciality?._id || null,
    identification_num: data?.identification_num || '',
    address: data?.address || '',
    web_page: data?.web_page || '',
    phone: data?.phone || '',
    mobile_num: data?.mobile_num || '',
    introduction_letter: data?.introduction_letter || '',
    location_gps: data?.location_gps || '',
    company_logo: data?.company_logo || '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });
  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = getValues();

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
          `${endpoints.tables.unitservice(
            user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service
              ._id
          )}/updatelogo`,
          formData
        );
        socket.emit('updated', {
          user,
          link: paths.unitservice.profile.root,
          msg: `uploaded logo to service unit profile`,
        });
      }
      await axios.patch(
        endpoints.tables.unitservice(
          user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id
        ),
        dataToSend
      );
      enqueueSnackbar('Update success!');
      socket.emit('updated', {
        user,
        link: paths.unitservice.profile.root,
        msg: `updated the service unit profile`,
      });
      refetch();
      console.info('DATA', dataToSend);
    } catch (error) {
      socket.emit('error', { error, user, location: window.location.href });
      enqueueSnackbar('Update failed!', { variant: 'error' });
      console.error(error);
    }
  });

  const handleEnglishInputChange = (event) => {
    // Validate the input based on English language rules
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%]*$/; // Only allow letters and spaces

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
              <RHFTextField
                lang="ar"
                disabled
                variant="filled"
                name="identification_num"
                label={`${t('ID number')} :`}
              />
              <RHFTextField
                lang="ar"
                variant="filled"
                name="name_english"
                label={`${t('name')} :`}
              />
              <RHFTextField
                lang="ar"
                variant="filled"
                name="name_arabic"
                label={`${t('name arabic')} :`}
              />
              <RHFTextField
                lang="ar"
                type="email"
                variant="filled"
                name="email"
                label={`${t('email')} :`}
              />
              <RHFTextField
                lang="ar"
                type="number"
                variant="filled"
                name="phone"
                label={`${t('phone')} :`}
              />
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
                label={t('country')}
                fullWidth
                name="country"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
                onChange={handleCountryChange}
              >
                {countriesData.map((country) => (
                  <MenuItem key={country._id} value={country._id}>
                    {curLangAr ? country.name_arabic : country.name_english}
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
                {cities.map((city) => (
                  <MenuItem key={city._id} value={city._id}>
                    {curLangAr ? city.name_arabic : city.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect
                label={t('unit service type')}
                fullWidth
                name="US_type"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {unitserviceTypesData.map((type) => (
                  <MenuItem value={type._id} key={type._id}>
                    {curLangAr ? type.name_arabic : type.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect
                label={`${t('specialty')} *`}
                fullWidth
                name="speciality"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {specialtiesData.map((specialty) => (
                  <MenuItem value={specialty._id} key={specialty._id}>
                    {curLangAr ? specialty.name_arabic : specialty.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect
                label={t('sector type')}
                fullWidth
                name="sector_type"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                <MenuItem value="public">{t('Public')}</MenuItem>
                <MenuItem value="privet">{t('Privet')}</MenuItem>
                <MenuItem value="charity">{t('Charity')}</MenuItem>
              </RHFSelect>
              <RHFTextField lang="ar" name="web_page" label={t('webpage')} />
              <RHFTextField
                lang="ar"
                type="number"
                name="mobile_num"
                label={t('alternative mobile number')}
              />
              <RHFTextField lang="ar" name="location_gps" label={t('location GPS')} />
            </Box>
            <RHFTextField
              lang="ar"
              multiline
              sx={{ mt: 3 }}
              rows={2}
              name="address"
              label={t('address')}
            />
            <RHFTextField
              lang="ar"
              multiline
              colSpan={14}
              rows={4}
              sx={{ mt: 3 }}
              onChange={handleEnglishInputChange}
              name="introduction_letter"
              label={t('introduction letter')}
            />

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
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
