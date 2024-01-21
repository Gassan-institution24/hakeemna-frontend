import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
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

import { useGetCountries, useGetCities, useGetInsuranceTypes } from 'src/api/tables';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

import axios from 'axios';
import axiosHandler from 'src/utils/axios-handler';
import { endpoints } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable }) {
  const router = useRouter();

  const { user } = useAuthContext();

  const { countriesData } = useGetCountries();
  const { insuranseTypesData } = useGetInsuranceTypes();
  const { tableData } = useGetCities();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name_arabic: Yup.string().required('Name is required'),
    name_english: Yup.string().required('Name is required'),
    country: Yup.string(),
    city: Yup.string().nullable(),
    type: Yup.string().nullable(),
    webpage: Yup.string(),
    phone: Yup.string(),
    address: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name_arabic: currentTable?.name_arabic || '',
      name_english: currentTable?.name_english || '',
      country: currentTable?.country?._id || null,
      city: currentTable?.city?._id || null,
      type: currentTable?.type?._id || null,
      webpage: currentTable?.webpage || '',
      phone: currentTable?.phone || '',
      address: currentTable?.address || '',
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      const address = await axios.get('https://geolocation-db.com/json/');
      if (currentTable) {
        await axiosHandler({
          method: 'PATCH',
          path: endpoints.tables.insuranceCo(currentTable._id),
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
          path: endpoints.tables.insuranceCos,
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
      router.push(paths.superadmin.tables.insurancecomapnies.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

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
                lang="ar"
                onChange={handleArabicInputChange}
                name="name_arabic"
                label="name arabic"
              />

              <RHFSelect name="country" label="Country">
                {countriesData.map((country) => (
                  <MenuItem key={country._id} value={country._id}>
                    {country.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="city" label="city">
                {tableData.map((city) => (
                  <MenuItem key={city._id} value={city._id}>
                    {city.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="type" label="type">
                {insuranseTypesData.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    {type.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField name="webpage" label="web page link" />
              <RHFTextField name="phone" label="phone no" />
              <RHFTextField name="address" label="address" />
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
