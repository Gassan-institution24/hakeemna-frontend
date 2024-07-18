import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { MenuItem } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetSymptoms, useGetCountries, useGetMedFamilies } from 'src/api';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFMultiSelect,
  RHFAutocomplete,
} from 'src/components/hook-form';

const DefaultDoses = ['5 mg', '10 mg', '50 mg'];

// ----------------------------------------------------------------------

export default function CountriesNewEditForm({ currentSelected }) {
  const router = useRouter();

  const { tableData } = useGetSymptoms();
  const { countriesData } = useGetCountries({ select: 'name_english' });
  const { families } = useGetMedFamilies();

  const sideEffectsMultiSelect = tableData?.reduce((acc, data) => {
    acc.push({
      value: data._id,
      label: data.name_english || data.name,
    });
    return acc;
  }, []);

  const { enqueueSnackbar } = useSnackbar();

  const NewSchema = Yup.object().shape({
    country: Yup.string().required('country is required'),
    trade_name: Yup.string().required('trade_name is required'),
    concentrations: Yup.array(),
    agent: Yup.string(),
    price_1: Yup.string(),
    price_2: Yup.string(),
    ATCCODE: Yup.string(),
    packaging: Yup.string(),
    scientific_name: Yup.string().required('scientific_name is required'),
    barcode: Yup.string(),
    family: Yup.string().required('family is required'),
    side_effects: Yup.array(),
  });

  const defaultValues = useMemo(
    /// edit
    () => ({
      country: currentSelected?.country?._id || '',
      trade_name: currentSelected?.trade_name || '',
      concentrations: currentSelected?.concentrations || [],
      agent: currentSelected?.agent || '',
      price_1: currentSelected?.price_1 || '',
      price_2: currentSelected?.price_2 || '',
      ATCCODE: currentSelected?.ATCCODE || '',
      packaging: currentSelected?.packaging || '',
      scientific_name: currentSelected?.scientific_name || '',
      barcode: currentSelected?.barcode || '',
      side_effects: currentSelected?.side_effects?.map((disease, idx) => disease._id) || [],
      family: currentSelected?.family?._id || '',
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentSelected) {
        await axiosInstance.patch(endpoints.medicines.one(currentSelected._id), data); /// edit
      } else {
        await axiosInstance.post(endpoints.medicines.all, data); /// edit
      }
      reset();
      enqueueSnackbar(currentSelected ? 'Update success!' : 'Create success!');
      router.push(paths.superadmin.tables.medicines.root); /// edit
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
              <RHFTextField name="trade_name" label="trade name" />
              <RHFTextField name="scientific_name" label="scientific name" />
            </Box>

            <Box
              sx={{ my: 2 }}
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >
              <RHFAutocomplete
                name="concentrations"
                label="concentrations"
                placeholder="+ concentration"
                multiple
                freeSolo
                options={DefaultDoses.map((option, idx) => option)}
                getOptionLabel={(option) => option}
                renderOption={(props, option, idx) => (
                  <li lang='ar' {...props} key={idx}>
                    {option}
                  </li>
                )}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={index}
                      label={option}
                      size="small"
                      color="info"
                      variant="soft"
                    />
                  ))
                }
              />
            </Box>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }} /// edit
            >
              <RHFTextField name="agent" label="agent" />
              <RHFTextField name="price_1" label="price_1" />
              <RHFTextField name="price_2" label="price_2" />
              <RHFTextField name="ATCCODE" label="ATCCODE" />
              <RHFTextField name="packaging" label="packaging" />
              <RHFTextField name="barcode" label="barcode" />
            </Box>
            <Box
              sx={{ my: 3 }}
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >
              <RHFSelect name="country" label="country">
                {countriesData.map((country, idx) => (
                  <MenuItem lang="ar" key={idx} value={country._id}>
                    {country.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect name="family" label="family">
                {families.map((family, idx) => (
                  <MenuItem lang="ar" key={idx} value={family._id}>
                    {family.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>

              {sideEffectsMultiSelect.length > 0 && (
                <RHFMultiSelect
                  checkbox
                  name="side_effects"
                  label="side_effects"
                  options={sideEffectsMultiSelect}
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
