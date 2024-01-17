import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { MenuItem } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetCountries, useGetCities } from 'src/api/tables';
import { endpoints } from 'src/utils/axios';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

import axios from 'axios';
import axiosHandler from 'src/utils/axios-handler';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable }) {
  const router = useRouter();

  const { user } = useAuthContext();

  console.log('currr', currentTable);
  const { countriesData } = useGetCountries();
  const { tableData } = useGetCities();
  const [selectedCountry, setSelectedCountry] = useState(currentTable?.country?._id || null);
  const [cities, setCities] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  console.log('test', cities);

  const NewUserSchema = Yup.object().shape({
    name_arabic: Yup.string().required('Name is required'),
    name_english: Yup.string().required('Name is required'),
    country: Yup.string(),
    city: Yup.string().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      name_arabic: currentTable?.name_arabic || '',
      name_english: currentTable?.name_english || '',
      country: currentTable?.country?._id || null,
      city: currentTable?.city?._id || null,
    }),
    [currentTable]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });
  const handleArabicInputChange = (event) => {
    // Validate the input based on Arabic language rules
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_-]*$/; // Range for Arabic characters

    if (arabicRegex.test(event.target.value)) {
      methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };

  const handleEnglishInputChange = (event) => {
    // Validate the input based on English language rules
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%]*$/; // Only allow letters and spaces

    if (englishRegex.test(event.target.value)) {
      methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleCountryChange = (event) => {
    const selectedCountryId = event.target.value;
    methods.setValue('country', selectedCountryId, { shouldValidate: true });
    setSelectedCountry(selectedCountryId);
    // setCities(tableData.filter((data)=>data?.country?._id === event.target.value))
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const address = await axios.get('https://geolocation-db.com/json/');
      if (currentTable) {
        await axiosHandler({
          method: 'PATCH',
          path: endpoints.tables.hospital(currentTable._id),
          data: {
            modifications_nums: (currentTable.modifications_nums || 0) + 1,
            ip_address_user_modification: address.data.IPv4,
            user_modification: user._id,
            ...data,
          },
        });
      } else {
        await axiosHandler({
          method: 'POST',
          path: endpoints.tables.hospitals,
          data: { ip_address_user_creation: address.data.IPv4, user_creation: user._id, ...data },
        });
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
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });
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
        <Grid xs={12} md={8}>
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
                lang="ar"
                onChange={handleArabicInputChange}
                name="name_arabic"
                label="name arabic"
              />

              <RHFSelect onChange={handleCountryChange} name="country" label="Country">
                {countriesData.map((country) => (
                  <MenuItem key={country._id} value={country._id}>
                    {country.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="city" label="City">
                {cities.map((city) => (
                  <MenuItem key={city._id} value={city._id}>
                    {city.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
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
