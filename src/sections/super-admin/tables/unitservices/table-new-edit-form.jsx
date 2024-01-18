import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { MenuItem } from '@mui/material';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetCountries, useGetMedFamilies, useGetSymptoms } from 'src/api/tables';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFMultiSelect,
  RHFSelect,
  RHFAutocomplete,
} from 'src/components/hook-form';

import axios from 'axios';
import axiosHandler from 'src/utils/axios-handler';
import { endpoints } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';

const DefaultDoses = ['5 mg', '10 mg', '50 mg'];

// ----------------------------------------------------------------------

export default function CountriesNewEditForm({ currentSelected }) {
  const router = useRouter();

  const { user } = useAuthContext();

  const { tableData } = useGetSymptoms();
  const { countriesData } = useGetCountries();
  const { families } = useGetMedFamilies();

  const sideEffectsMultiSelect = tableData?.reduce((acc, data) => {
    acc.push({
      value: data._id,
      label: data.name_english || data.name,
    });
    return acc;
  }, []);
  console.log('multiii', sideEffectsMultiSelect.length > 0 && sideEffectsMultiSelect);
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
      side_effects: currentSelected?.side_effects?.map((disease) => disease._id) || [],
      family: currentSelected?.family?._id || '',
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      const address = await axios.get('https://geolocation-db.com/json/');
      if (currentSelected) {
        await axiosHandler({
          method: 'PATCH',
          path: endpoints.tables.medicine(currentSelected._id),
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
          path: endpoints.tables.medicines,
          data: { ip_address_user_creation: address.data.IPv4, user_creation: user._id, ...data },
        }); /// edit
      }
      reset();
      enqueueSnackbar(currentSelected ? 'Update success!' : 'Create success!');
      router.push(paths.superadmin.tables.medicines.root); /// edit
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
                options={DefaultDoses.map((option) => option)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
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
                {countriesData.map((country) => (
                  <MenuItem key={country._id} value={country._id}>
                    {country.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect name="family" label="family">
                {families.map((family) => (
                  <MenuItem key={family._id} value={family._id}>
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
