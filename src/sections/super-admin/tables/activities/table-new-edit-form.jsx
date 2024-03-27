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

import { useGetActiveUnitservices, useGetUSActiveDepartments } from 'src/api';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable }) {
  const router = useRouter();

  const { unitservicesData } = useGetActiveUnitservices();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name_arabic: Yup.string().required('Name is required'),
    name_english: Yup.string().required('Name is required'),
    unit_service: Yup.string().required('Unit Service is required'),
    department: Yup.string().nullable(),
    details: Yup.string(),
    details_arabic: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name_arabic: currentTable?.name_arabic || '',
      name_english: currentTable?.name_english || '',
      unit_service: currentTable?.unit_service?._id || null,
      department: currentTable?.department?._id || null,
      details: currentTable?.details || '',
      details_arabic: currentTable?.details_arabic || '',
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
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const { departmentsData } = useGetUSActiveDepartments(values.unit_service);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentTable) {
        await axiosInstance.patch(`${endpoints.activities.one(currentTable._id)}`, data);
      } else {
        await axiosInstance.post(`${endpoints.activities.all}`, data);
      }
      reset();
      router.push(paths.superadmin.tables.activities.root);
      enqueueSnackbar(currentTable ? 'Update success!' : 'Create success!');
    } catch (error) {
      console.error(error);
    }
  });

  /* eslint-disable */
  useEffect(() => {
    reset({
      name_arabic: currentTable?.name_arabic || '',
      name_english: currentTable?.name_english || '',
      unit_service: currentTable?.unit_service?._id || null,
      department: currentTable?.department?._id || null,
      details: currentTable?.details || '',
      details_arabic: currentTable?.details_arabic || '',
    });
  }, [currentTable]);
  /* eslint-enable */

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

              <RHFSelect name="unit_service" label="Unit Service">
                {unitservicesData.map((unit_service, idx) => (
                  <MenuItem lang="ar" key={idx} value={unit_service._id}>
                    {unit_service.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="department" label="Department">
                {departmentsData.map((department, idx) => (
                  <MenuItem lang="ar" key={idx} value={department._id}>
                    {department.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField name="details" label="Details" />
              <RHFTextField name="details_arabic" label="Details Arabic" />
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
