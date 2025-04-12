import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFDatePicker } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentSelected }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    phone: Yup.string(),
    city: Yup.string(),
    notes: Yup.string(),
    communication_date: Yup.date().nullable(),
  });

  const defaultValues = useMemo(
    /// edit
    () => ({
      name: currentSelected?.name || '',
      phone: currentSelected?.phone || '',
      city: currentSelected?.city || '',
      notes: currentSelected?.notes || '',
      communication_date: currentSelected?.communication_date || null,
    }),
    [currentSelected]
  );

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(NewSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // const handleArabicInputChange = (event) => {
  //   // Validate the input based on Arabic language rules
  //   const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_\-().]*$/; // Range for Arabic characters

  //   if (arabicRegex.test(event.target.value)) {
  //     methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
  //   }
  // };

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentSelected) {
        await axiosInstance.patch(endpoints.doctors.one(currentSelected._id), data); /// edit
      } else {
        await axiosInstance.post(endpoints.doctors.all, data); /// edit
      }
      reset();
      enqueueSnackbar(currentSelected ? 'Update success!' : 'Create success!');
      router.push(paths.superadmin.tables.doctors.root);
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
              }} /// edit
            >
              <RHFTextField name="name" label="name" />
              <RHFTextField name="phone" label="phone" />
              <RHFTextField name="city" label="city" />
              <RHFTextField name="notes" label="notes" />
              <RHFDatePicker name="communication_date" label="communication_date" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" tabIndex={-1} variant="contained" loading={isSubmitting}>
                {!currentSelected ? 'Create One' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

TableNewEditForm.propTypes = {
  currentSelected: PropTypes.object,
};
