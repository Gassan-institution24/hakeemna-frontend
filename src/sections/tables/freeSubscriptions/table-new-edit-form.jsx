import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetCountries, useGetCities, useGetSpecialties, useGetUSTypes } from 'src/api/tables';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import axiosHandler from 'src/utils/axios-handler';
import { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable }) {
  const router = useRouter();

  const { countriesData } = useGetCountries();
  const { unitserviceTypesData } = useGetUSTypes();
  const { tableData } = useGetCities();
  const { specialtiesData } = useGetSpecialties();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name_arabic: Yup.string().required('Name is required'),
    name_english: Yup.string().required('Name is required'),
    country: Yup.string().nullable(),
    city: Yup.string().nullable(),
    US_type: Yup.string().nullable(),
    speciality: Yup.string().nullable(),
    offer_date: Yup.date().nullable(),
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
  console.log('currrrent',currentTable);
  console.log(defaultValues);

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log('dataaaaa', data);
    try {
      if (currentTable) {
        await axiosHandler({
          method: 'PATCH',
          path: endpoints.tables.freesubscription(currentTable._id),
          data,
        });
      } else {
        await axiosHandler({ method: 'POST', path: endpoints.tables.freesubscriptions, data });
      }
      reset();
      enqueueSnackbar(currentTable ? 'Update success!' : 'Create success!');
      router.push(paths.superadmin.tables.freesub.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

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
              <RHFTextField name="name_english" label="name english" />
              <RHFTextField name="name_arabic" label="name arabic" />

              <RHFSelect native name="country" label="Country">
                <option> </option>
                {countriesData.map((country) => (
                  <option key={country._id} value={country._id}>
                    {country.name_english}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect native name="city" label="city">
                <option> </option>
                {tableData.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.name_english}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect native name="US_type" label="US_type">
                <option> </option>
                {unitserviceTypesData.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.name_english}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect native name="speciality" label="speciality">
                <option> </option>
                {specialtiesData.map((speciality) => (
                  <option key={speciality._id} value={speciality._id}>
                    {speciality.name_english}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect native name="general" label="Is it General?">
                <option> </option>
                <option value>Yes </option>
                <option value={false}>No </option>
              </RHFSelect>
              <DatePicker
                name="offer_date"
                label="offer date"
                onChange={(date) => methods.setValue('offer_date', date, { shouldValidate: true })}
                // Parse the UTC date string to a JavaScript Date object
                value={methods.getValues('offer_date') ? new Date(methods.getValues('offer_date')) : null}
              />
              <RHFTextField type="number" name="period_in_months" label="period in months" />
              <RHFTextField name="concept" label="concept" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentTable ? 'Create User' : 'Save Changes'}
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
