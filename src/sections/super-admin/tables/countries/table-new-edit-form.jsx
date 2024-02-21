import axios from 'axios';
import * as Yup from 'yup';
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import timezones from 'timezones-list';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import { Chip } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { endpoints } from 'src/utils/axios';
import axiosHandler from 'src/utils/axios-handler';

import { useAuthContext } from 'src/auth/hooks';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function CountriesNewEditForm({ currentSelected }) {
  const router = useRouter();

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const NewSchema = Yup.object().shape({
    name_arabic: Yup.string().required('Name is required'),
    name_english: Yup.string().required('Name is required'),
    time_zone: Yup.string().required('Time zone is required'),
  });

  const defaultValues = useMemo(
    /// edit
    () => ({
      name_arabic: currentSelected?.name_arabic || '',
      name_english: currentSelected?.name_english || '',
      time_zone: currentSelected?.time_zone || '',
    }),
    [currentSelected]
  );

  const methods = useForm({
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      const address = await axios.get('https://geolocation-db.com/json/');
      if (currentSelected) {
        await axiosHandler({
          method: 'PATCH',
          path: endpoints.tables.country(currentSelected._id),
          data: {
            modifications_nums: (currentSelected.modifications_nums || 0) + 1,
            ip_address_user_modification: address.data.IPv4,
            user_modification: user._id,
            ...data,
          },
        }); /// edit
      } else {
        await axiosHandler({
          method: 'POST',
          path: endpoints.tables.countries,
          data: { ip_address_user_creation: address.data.IPv4, user_creation: user._id, ...data },
        }); /// edit
      }
      reset();
      enqueueSnackbar(currentSelected ? 'Update success!' : 'Create success!');
      router.push(paths.superadmin.tables.countries.root);
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
              }} /// edit
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
              <RHFAutocomplete
                name="time_zone"
                label="Time zone"
                // disableCloseOnSelect
                options={timezones.map((option) => option.tzCode)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option} value={option}>
                    {option}
                  </li>
                )}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                      size="small"
                      color="info"
                      variant="soft"
                    />
                  ))
                }
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
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
