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

import { useGetSymptoms, useGetCategories } from 'src/api';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFMultiSelect } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function CountriesNewEditForm({ currentSelected }) {
  const router = useRouter();

  const { categories } = useGetCategories();

  const { tableData } = useGetSymptoms();

  const symptomsMultiSelect = tableData?.reduce((acc, data) => {
    acc.push({
      value: data._id,
      label: data.name_english || data.name,
    });
    return acc;
  }, []);

  const { enqueueSnackbar } = useSnackbar();

  const NewSchema = Yup.object().shape({
    name_english: Yup.string().required('Name is required'),
    name_arabic: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    description_arabic: Yup.string().required('Description is required'),
    category: Yup.string().required('Description is required'),
    symptoms: Yup.array(),
  });

  const defaultValues = useMemo(
    /// edit
    () => ({
      name_arabic: currentSelected?.name_arabic || '',
      name_english: currentSelected?.name_english || '',
      description: currentSelected?.description || '',
      description_arabic: currentSelected?.description_arabic || '',
      category: currentSelected?.category?._id || '',
      symptoms: currentSelected?.symptoms?.map((disease, idx) => disease._id) || [],
    }),
    [currentSelected]
  );

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(NewSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

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

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentSelected) {
        await axiosInstance.patch(endpoints.diseases.one(currentSelected._id), data); /// edit
      } else {
        await axiosInstance.post(endpoints.diseases.all, data); /// edit
      }
      reset();
      enqueueSnackbar(currentSelected ? 'Update success!' : 'Create success!');
      router.push(paths.superadmin.tables.diseases.root); /// edit
    } catch (error) {
      console.error(error);
    }
  });

  /* eslint-disable */
  useEffect(() => {
    reset({
      name_arabic: currentSelected?.name_arabic || '',
      name_english: currentSelected?.name_english || '',
      description: currentSelected?.description || '',
      description_arabic: currentSelected?.description_arabic || '',
      category: currentSelected?.category?._id || '',
      symptoms: currentSelected?.symptoms?.map((disease, idx) => disease._id) || [],
    });
  }, [currentSelected]);
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
              }} /// edit
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
            </Box>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >
              <RHFTextField
                lang="en"
                onChange={handleEnglishInputChange}
                sx={{ mt: 3 }}
                name="description"
                label="description"
                multiline
                colSpan={14}
                rows={3}
              />
              <RHFTextField
                onChange={handleArabicInputChange}
                sx={{ mt: 3 }}
                name="description_arabic"
                label="description arabic"
                multiline
                colSpan={14}
                rows={3}
              />

              <RHFSelect name="category" label="category">
                {categories.map((category, idx) => (
                  <MenuItem lang="ar" key={idx} value={category._id}>
                    {category.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>

              {symptomsMultiSelect && (
                <RHFMultiSelect
                  checkbox
                  name="symptoms"
                  label="Symptoms"
                  options={symptomsMultiSelect}
                />
              )}
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

CountriesNewEditForm.propTypes = {
  currentSelected: PropTypes.object,
};
