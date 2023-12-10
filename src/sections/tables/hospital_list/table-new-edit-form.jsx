import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useMemo,useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetCountries, useGetCities } from 'src/api/tables';
import { endpoints } from 'src/utils/axios';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import axiosHandler from 'src/utils/axios-handler';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable }) {
  const router = useRouter();
  console.log('currr',currentTable)
  const { countriesData } = useGetCountries();
  const { tableData } = useGetCities();
  const [selectedCountry, setSelectedCountry] = useState(
    currentTable?.country?._id || null
  );
  const [cities,setCities]= useState([])
  const { enqueueSnackbar } = useSnackbar();
  console.log('test',cities)

  const NewUserSchema = Yup.object().shape({
    name_arabic: Yup.string().required('Name is required'),
    name_english: Yup.string().required('Name is required'),
    country: Yup.string(),
    city: Yup.string().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      name_arabic: currentTable?.name_arabic || '',
      name_english: currentTable?.name_english || '',
      country: currentTable?.country?._id || null,
      city: currentTable?.city?._id || null,
    }),
    [currentTable]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleCountryChange = (event) => {
    const selectedCountryId = event.target.value;
    methods.setValue('country', selectedCountryId, { shouldValidate: true })
    setSelectedCountry(selectedCountryId);
    // setCities(tableData.filter((data)=>data?.country?._id === event.target.value))
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      let response;
      if (currentTable) {
        response = await axiosHandler({
          method: 'PATCH',
          path: endpoints.tables.hospital(currentTable._id),
          data,
        });
      } else {
        response = await axiosHandler({
          method: 'POST',
          path: endpoints.tables.hospitals,
          data,
        });
      }
      reset();
      // if (response.status.includes(200, 304)) {
        enqueueSnackbar(currentTable ? 'Update success!' : 'Create success!');
      // } else {
      //   enqueueSnackbar('Please try again later!', {
      //     variant: 'error',
      //   });
      // }
      router.push(paths.superadmin.tables.hospitallist.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });
  useEffect(()=>{
    setCities(selectedCountry?tableData.filter((data)=>data?.country?._id === selectedCountry):tableData)
  },[tableData,selectedCountry])
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

              <RHFSelect native onChange={handleCountryChange} name="country" label="Country">
                <option> </option>
                {countriesData.map((country) => (
                  <option key={country._id} value={country._id}>
                    {country.name_english}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect native name="city" label="City">
                <option> </option>
                {cities.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.name_english}
                  </option>
                ))}
              </RHFSelect>
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
