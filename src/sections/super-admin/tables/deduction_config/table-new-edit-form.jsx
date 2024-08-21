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

  const { countriesData } = useGetCountries({ select: 'name_english' });

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name_arabic: Yup.string().required('Name is required'),
    name_english: Yup.string().required('Name is required'),
    country: Yup.string().required('country is required'),
    city: Yup.string().nullable(),
    type: Yup.string(),
    percentage: Yup.number(),
    amount: Yup.number(),
    Comment: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name_arabic: currentTable?.name_arabic || '',
      name_english: currentTable?.name_english || '',
      country: currentTable?.country?._id || null,
      city: currentTable?.city?._id || null,
      type: currentTable?.type || '',
      percentage: currentTable?.percentage || 0,
      amount: currentTable?.amount || 0,
      Comment: currentTable?.Comment || '',
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
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = methods.watch();

  const { tableData } = useGetCountryCities(values.country, { select: 'name_english' });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentTable) {
        await axiosInstance.patch(`${endpoints.deductions.one(currentTable._id)}`, data);
      } else {
        await axiosInstance.post(`${endpoints.deductions.all}`, data);
      }
      reset();
      enqueueSnackbar(currentTable ? 'Update success!' : 'Create success!');
      router.push(paths.superadmin.tables.deductionconfig.root);
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
                {countriesData.map((one, idx) => (
                  <MenuItem lang="ar" key={idx} value={one._id}>
                    {one.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="city" label="city">
                {tableData.map((one, idx) => (
                  <MenuItem lang="ar" key={idx} value={one._id}>
                    {one.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="type" label="Type">
                <MenuItem lang="ar" value="from income">
                  from income{' '}
                </MenuItem>
                <MenuItem lang="ar" value="from sales">
                  from sales{' '}
                </MenuItem>
              </RHFSelect>
              <RHFTextField type="number" name="percentage" label="percentage %" />
              <RHFTextField type="number" name="amount" label="amount $" />
              <RHFTextField name="Comment" label="Comment" />
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
