import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import { MenuItem } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetMedicines, useGetSpecialties } from 'src/api';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentSelected }) {
  const router = useRouter();

  const { specialtiesData } = useGetSpecialties({ select: 'name_english' });

  const [medicineSearch, setMedicineSearch] = useState('');
  const { medicinesData } = useGetMedicines({ search: medicineSearch, rowsPerPage: 100 });

  const { enqueueSnackbar } = useSnackbar();

  const NewSchema = Yup.object().shape({
    name_arabic: Yup.string().required('Name is required'),
    name_english: Yup.string().required('Name is required'),
    description: Yup.string(),
    description_arabic: Yup.string(),
    speciality: Yup.string().nullable(),
    medicines: Yup.array(),
  });

  const defaultValues = useMemo(
    () => ({
      name_arabic: currentSelected?.name_arabic || '',
      name_english: currentSelected?.name_english || '',
      description: currentSelected?.description || '',
      description_arabic: currentSelected?.description_arabic || '',
      speciality: currentSelected?.speciality?._id || null,
      medicines: currentSelected?.medicines || [],
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

  const handleArabicInputChange = (event) => {
    const arabicRegex = /^[؀-ۿ0-9\s!@#$%^&*_\-().]*$/;
    if (arabicRegex.test(event.target.value)) {
      methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };

  const handleEnglishInputChange = (event) => {
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%.()]*$/;
    if (englishRegex.test(event.target.value)) {
      methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        ...data,
        medicines: data.medicines?.map((m) => m._id || m) || [],
      };
      if (currentSelected) {
        await axiosInstance.patch(endpoints.medicinesCategories.one(currentSelected._id), payload);
      } else {
        await axiosInstance.post(endpoints.medicinesCategories.all, payload);
      }
      reset();
      enqueueSnackbar(currentSelected ? 'Update success!' : 'Create success!');
      router.push(paths.superadmin.tables.medicinesCategories.root);
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

              <RHFSelect name="speciality" label="speciality">
                {specialtiesData.map((specialty, idx) => (
                  <MenuItem lang="ar" key={idx} value={specialty._id}>
                    {specialty.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
            
              <RHFAutocomplete
                name="medicines"
                label="Search and select medicines"
                multiple
                disableCloseOnSelect
                options={medicinesData}
                getOptionLabel={(option) =>
                  option?.trade_name
                    ? `${option.trade_name}${option.scientific_name ? ` (${option.scientific_name})` : ''}`
                    : ''
                }
                isOptionEqualToValue={(option, value) =>
                  option._id === (value?._id || value)
                }
                onInputChange={(_, val) => setMedicineSearch(val)}
                renderOption={(props, option, { selected }) => (
                  <li {...props} key={option._id}>
                    <Checkbox checked={selected} sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2">{option.trade_name}</Typography>
                      {option.scientific_name && (
                        <Typography variant="caption" color="text.secondary">
                          {option.scientific_name}
                        </Typography>
                      )}
                    </Box>
                  </li>
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={option._id || index}
                      label={option.trade_name || option}
                      size="small"
                      {...getTagProps({ index })}
                    />
                  ))
                }
              />
            </Box>
            

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
            >
              <RHFTextField
                onChange={handleEnglishInputChange}
                sx={{ mt: 3 }}
                name="description"
                label="description"
                multiline
                rows={3}
              />
              <RHFTextField
                onChange={handleArabicInputChange}
                sx={{ mt: 3 }}
                name="description_arabic"
                label="description arabic"
                multiline
                rows={3}
              />
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
