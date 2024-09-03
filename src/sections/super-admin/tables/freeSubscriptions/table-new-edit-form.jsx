import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { MenuItem } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { DatePicker } from '@mui/x-date-pickers';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import {
  useGetCountries,
  useGetSpecialties,
  useGetCountryCities,
  useGetActiveUSTypes,
} from 'src/api';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable }) {
  const router = useRouter();

  const { countriesData } = useGetCountries({ select: 'name_english' });
  const { unitserviceTypesData } = useGetActiveUSTypes();
  const { specialtiesData } = useGetSpecialties({ select: 'name_english name_arabic' });

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name_arabic: Yup.string().required('Name is required'),
    name_english: Yup.string().required('Name is required'),
    country: Yup.string().nullable(),
    city: Yup.string().nullable(),
    US_type: Yup.string().nullable(),
    speciality: Yup.string().nullable(),
    offer_date: Yup.mixed().nullable(),
    period_in_months: Yup.number(),
    concept: Yup.string(),
    general: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name_arabic: currentTable?.name_arabic || '',
      name_english: currentTable?.name_english || '',
      country: currentTable?.country?._id || null,
      city: currentTable?.city?._id || null,
      US_type: currentTable?.US_type?._id || null,
      speciality: currentTable?.speciality?._id || null,
      offer_date: currentTable?.offer_date || null,
      period_in_months: currentTable?.period_in_months || 0,
      concept: currentTable?.concept || '',
      general: currentTable?.general || false,
    }),
    [currentTable]
  );

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });
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

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { tableData } = useGetCountryCities(watch().country, { select: 'name_english' });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentTable) {
        await axiosInstance.patch(endpoints.free_subscriptions.one(currentTable._id), data);
      } else {
        await axiosInstance.post(endpoints.free_subscriptions.all, data);
      }
      reset();
      enqueueSnackbar(currentTable ? 'Update success!' : 'Create success!');
      router.push(paths.superadmin.tables.freesub.root);
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

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
                onChange={handleEnglishInputChange}
                name="name_english"
                label="name english"
              />
              <RHFTextField
                onChange={handleArabicInputChange}
                name="name_arabic"
                label="name arabic"
              />

              <RHFSelect name="country" label="country">
                {countriesData.map((country, idx) => (
                  <MenuItem lang="ar" key={idx} value={country._id}>
                    {country.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="city" label="city">
                {tableData.map((city, idx) => (
                  <MenuItem lang="ar" key={idx} value={city._id}>
                    {city.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="US_type" label="US_type">
                {unitserviceTypesData.map((type, idx) => (
                  <MenuItem lang="ar" key={idx} value={type._id}>
                    {type.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFAutocomplete
                name="speciality"
                label="speciality"
                options={specialtiesData.map((speciality) => speciality._id)}
                getOptionLabel={(option) =>
                  specialtiesData.find((one) => one._id === option)?.name_english
                }
                renderOption={(props, option, idx) => (
                  <li lang="ar" {...props} key={idx} value={option}>
                    {specialtiesData.find((one) => one._id === option)?.name_english}
                  </li>
                )}
              />
              <RHFSelect name="general" label="Is it General?">
                <MenuItem lang="ar" value>
                  Yes{' '}
                </MenuItem>
                <MenuItem lang="ar" value={false}>
                  No{' '}
                </MenuItem>
              </RHFSelect>
              <DatePicker
                name="offer_date"
                label="offer date"
                onChange={(date) => methods.setValue('offer_date', date, { shouldValidate: true })}
                // Parse the UTC date string to a JavaScript Date object
                value={
                  methods.getValues('offer_date') ? new Date(methods.getValues('offer_date')) : null
                }
              />
              <RHFTextField type="number" name="period_in_months" label="period in months" />
              <RHFTextField name="concept" label="concept" />
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
