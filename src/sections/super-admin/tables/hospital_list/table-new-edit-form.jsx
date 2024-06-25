import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { MenuItem } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetCountries, useGetCountryCities } from 'src/api';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable }) {
  const router = useRouter();

  const { countriesData } = useGetCountries();
  const [selectedCountry, setSelectedCountry] = useState(currentTable?.country?._id || null);
  const [cities, setCities] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name_arabic: Yup.string().required('Name is required'),
    name_english: Yup.string().required('Name is required'),
    country: Yup.string(),
    city: Yup.string().nullable(),
    unit_service_type: Yup.string().nullable(),
    sector: Yup.string().nullable(),
    type_of_specialty_1: Yup.string().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      name_arabic: currentTable?.name_arabic || '',
      name_english: currentTable?.name_english || '',
      country: currentTable?.country?._id || null,
      city: currentTable?.city?._id || null,
      unit_service_type: currentTable?.unit_service_type || '',
      sector: currentTable?.sector || '',
      type_of_specialty_1: currentTable?.type_of_specialty_1 || '',
    }),
    [currentTable]
  );

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(NewUserSchema),
    defaultValues,
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

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const { tableData } = useGetCountryCities(watch().country);

  const handleCountryChange = (event) => {
    const selectedCountryId = event.target.value;
    methods.setValue('country', selectedCountryId, { shouldValidate: true });
    setSelectedCountry(selectedCountryId);
    // setCities(tableData.filter((data)=>data?.country?._id === event.target.value))
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentTable) {
        await axiosInstance.patch(endpoints.hospitals.one(currentTable._id), data);
      } else {
        await axiosInstance.post(endpoints.hospitals.all, data);
      }
      reset();
      // if (response.status.includes(200, 304)) {
      enqueueSnackbar(currentTable ? 'Update success!' : 'Create success!');
      // } else {
      //   enqueueSnackbar('Please try again later!', {
      //     variant: 'error',
      //   });
      // }
      router.push(paths.superadmin.tables.hospitallist.root);
    } catch (error) {
      console.error(error);
    }
  });

  /* eslint-disable */
  useEffect(() => {
    reset({
      name_arabic: currentTable?.name_arabic || '',
      name_english: currentTable?.name_english || '',
      country: currentTable?.country?._id || null,
      city: currentTable?.city?._id || null,
      unit_service_type: currentTable?.unit_service_type || '',
      sector: currentTable?.sector || '',
      type_of_specialty_1: currentTable?.type_of_specialty_1 || '',
    });
  }, [currentTable]);
  /* eslint-enable */

  useEffect(() => {
    setCities(
      selectedCountry
        ? tableData.filter((data) => data?.country?._id === selectedCountry)
        : tableData
    );
  }, [tableData, selectedCountry]);
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} maxWidth="md">
          <Card sx={{ p: 3 }}>
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
                lang="en"
                onChange={handleEnglishInputChange}
                name="name_english"
                label="name english"
              />
              <RHFTextField
                onChange={handleArabicInputChange}
                name="name_arabic"
                label="name arabic"
              />

              <RHFSelect onChange={handleCountryChange} name="country" label="country">
                {countriesData.map((country, idx) => (
                  <MenuItem lang="ar" key={idx} value={country._id}>
                    {country.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="city" label="City">
                {cities.map((city, idx) => (
                  <MenuItem lang="ar" key={idx} value={city._id}>
                    {city.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField
                name="unit_service_type"
                label="unit service type"
              />
              <RHFTextField
                name="sector"
                label="sector"
              />
              <RHFTextField
                name="type_of_specialty_1"
                label="specialty"
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" tabIndex={-1} variant="contained" loading={isSubmitting}>
                {!currentTable ? 'Create' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

TableNewEditForm.propTypes = {
  currentTable: PropTypes.object,
};
