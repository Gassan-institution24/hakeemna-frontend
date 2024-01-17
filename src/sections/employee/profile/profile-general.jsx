import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import { MenuItem, Typography, TextField } from '@mui/material';
import FormProvider, { RHFTextField, RHFSelect, RHFUploadAvatar } from 'src/components/hook-form';
import { useGetCities, useGetCountries, useGetSpecialties, useGetUSTypes } from 'src/api/tables';
import axios, { endpoints, fetcher } from 'src/utils/axios';
import { fData } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function AccountGeneral({ employeeData, refetch }) {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [cities, setCities] = useState([]);
  const [companyLogo, setCompanyLog] = useState();

  const { enqueueSnackbar } = useSnackbar();

  const { countriesData } = useGetCountries();
  const { tableData } = useGetCities();
  const { unitserviceTypesData } = useGetUSTypes();
  const { specialtiesData } = useGetSpecialties();

  const { user } = useAuthContext();

  console.log('employeeData', employeeData);

  const UpdateUserSchema = Yup.object().shape({
    name_english: Yup.string().required('Name is required.'),
    country: Yup.string().required('Country is required.'),
    city: Yup.string().required('City is required.'),
    US_type: Yup.string().required('Unit service type is required.'),
    email: Yup.string().required('Email is required.'),
    sector_type: Yup.string().required('Sector type is required.'),
    speciality: Yup.string().required('Specialty is required.'),
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
        ? tableData.filter((data) => data?.country?._id === selectedCountry)
        : tableData
    );
  }, [tableData, selectedCountry]);

  const defaultValues = {
    name_english: employeeData?.name_english || '',
    country: employeeData?.country?._id || null,
    city: employeeData?.city?._id || null,
    US_type: employeeData?.US_type?._id || null,
    email: employeeData?.email || '',
    sector_type: employeeData?.sector_type || '',
    speciality: employeeData?.speciality?._id || null,
    identification_num: employeeData?.identification_num || '',
    address: employeeData?.address || '',
    web_page: employeeData?.web_page || '',
    phone: employeeData?.phone || '',
    mobile_num: employeeData?.mobile_num || '',
    introduction_letter: employeeData?.introduction_letter || '',
    location_gps: employeeData?.location_gps || '',
    company_logo: employeeData?.company_logo || '',
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('data', data);
      const formData = new FormData();
      if (companyLogo) {
        formData.append('company_logo_pic', companyLogo);
        await axios.patch(
          `${endpoints.tables.employee(employeeData._id)}/updatelogo`,
          formData
        );
      }
      await axios.patch(endpoints.tables.employee(employeeData._id), data);
      enqueueSnackbar('Update success!');
      console.info('DATA', data);
    } catch (error) {
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
        {/* img */}
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
                  max size of {fData(3145728)}
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
                disabled
                variant="filled"
                name="identification_num"
                label="ID number :"
              />
              <RHFTextField variant="filled" name="name_english" label="Name :" />
              <RHFTextField type="email" variant="filled" name="email" label="Email :" />
              <RHFTextField type="number" variant="filled" name="phone" label="Phone Number :" />
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
                label="Country"
                fullWidth
                name="country"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
                onChange={handleCountryChange}
              >
                {countriesData.map((country) => (
                  <MenuItem key={country._id} value={country._id}>
                    {country.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect
                label="City"
                fullWidth
                name="city"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {cities.map((city) => (
                  <MenuItem key={city._id} value={city._id}>
                    {city.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect
                label="Unit service type"
                fullWidth
                name="US_type"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {unitserviceTypesData.map((type) => (
                  <MenuItem value={type._id} key={type._id}>
                    {type.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect
                label="Speciality"
                fullWidth
                name="speciality"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {specialtiesData.map((specialty) => (
                  <MenuItem value={specialty._id} key={specialty._id}>
                    {specialty.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect
                label="Sector type"
                fullWidth
                name="sector_type"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="privet">Privet</MenuItem>
                <MenuItem value="charity">Charity</MenuItem>
              </RHFSelect>
              <RHFTextField name="web_page" label="Web page" />
              <RHFTextField type="number" name="mobile_num" label="Alternative mobile number" />
              <RHFTextField name="location_gps" label="Location GPS" />
            </Box>
            <RHFTextField multiline sx={{ mt: 3 }} rows={2} name="address" label="Address" />
            <RHFTextField
              multiline
              colSpan={14}
              rows={4}
              sx={{ mt: 3 }}
              onChange={handleEnglishInputChange}
              name="introduction_letter"
              label="Introduction letter"
            />

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
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
