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
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentSelected }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewSchema = Yup.object().shape({
    unit_service_type: Yup.string(),
    country: Yup.string(),
    city: Yup.string(),
    sector: Yup.string(),
    commercial_name: Yup.string().required('required field'),
    province: Yup.string(),
    address: Yup.string(),
    phone_number_1: Yup.string(),
    Phone_number_2: Yup.string(),
    work_shift: Yup.string(),
    constitution_objective: Yup.string(),
    type_of_specialty_1: Yup.string(),
    type_of_specialty_2: Yup.string(),
    info: Yup.string(),
    email: Yup.string(),
    insurance: Yup.string(),
    subscribe_to: Yup.string(),
    social_network: Yup.string(),
    notes: Yup.string(),
    communication: Yup.string(),
  });

  const defaultValues = useMemo(
    /// edit
    () => ({
      unit_service_type: currentSelected?.unit_service_type || '',
      country: currentSelected?.country || '',
      city: currentSelected?.city || '',
      sector: currentSelected?.sector || '',
      commercial_name: currentSelected?.commercial_name || '',
      province: currentSelected?.province || '',
      address: currentSelected?.address || '',
      phone_number_1: currentSelected?.phone_number_1 || '',
      Phone_number_2: currentSelected?.Phone_number_2 || '',
      work_shift: currentSelected?.work_shift || '',
      constitution_objective: currentSelected?.constitution_objective || '',
      type_of_specialty_1: currentSelected?.type_of_specialty_1 || '',
      type_of_specialty_2: currentSelected?.type_of_specialty_2 || '',
      info: currentSelected?.info || '',
      email: currentSelected?.email || '',
      insurance: currentSelected?.insurance || '',
      subscribe_to: currentSelected?.subscribe_to || '',
      social_network: currentSelected?.social_network || '',
      notes: currentSelected?.notes || '',
      communication: currentSelected?.communication || '',
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
        await axiosInstance.patch(endpoints.companies.one(currentSelected._id), data); /// edit
      } else {
        await axiosInstance.post(endpoints.companies.all, data); /// edit
      }
      reset();
      enqueueSnackbar(currentSelected ? 'Update success!' : 'Create success!');
      router.push(paths.superadmin.tables.companies.root);
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
              <RHFTextField
                // onChange={handleEnglishInputChange}
                name="unit_service_type"
                label="unit_service_type"
              />
              <RHFTextField
                // onChange={handleEnglishInputChange}
                name="country"
                label="country"
              />
              <RHFTextField
                // onChange={handleEnglishInputChange}
                name="city"
                label="city"
              />
              <RHFTextField
                // onChange={handleEnglishInputChange}
                name="sector"
                label="sector"
              />
              <RHFTextField
                // onChange={handleEnglishInputChange}
                name="commercial_name"
                label="commercial_name"
              />
              <RHFTextField
                // onChange={handleEnglishInputChange}
                name="province"
                label="province"
              />
              <RHFTextField
                // onChange={handleEnglishInputChange}
                name="address"
                label="address"
              />
              <RHFTextField
                // onChange={handleEnglishInputChange}
                name="phone_number_1"
                label="phone_number_1"
              />
              <RHFTextField
                // onChange={handleEnglishInputChange}
                name="Phone_number_2"
                label="Phone_number_2"
              />
              <RHFTextField
                // onChange={handleEnglishInputChange}
                name="work_shift"
                label="work_shift"
              />
              <RHFTextField
                // onChange={handleEnglishInputChange}
                name="constitution_objective"
                label="constitution_objective"
              />
              <RHFTextField
                // onChange={handleEnglishInputChange}
                name="type_of_specialty_1"
                label="type_of_specialty_1"
              />
              <RHFTextField
                // onChange={handleEnglishInputChange}
                name="type_of_specialty_2"
                label="type_of_specialty_2"
              />
              <RHFTextField name="info" label="info" />
              <RHFTextField name="email" label="email" />
              <RHFTextField name="insurance" label="insurance" />
              <RHFTextField name="subscribe_to" label="subscribe to" />
              <RHFTextField name="social_network" label="social network" />
              <RHFTextField name="notes" label="notes" />
              <RHFTextField name="communication" label="communication" />
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
