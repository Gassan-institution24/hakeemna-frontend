import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetCountries,useGetCities,useGetInsuranceTypes } from 'src/api/tables';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFTextField,
} from 'src/components/hook-form';
import axiosHandler from 'src/utils/axios-handler';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable }) {
  const router = useRouter();

  const {countriesData}=useGetCountries()
  const {insuranseTypesData}=useGetInsuranceTypes()
  const {tableData}=useGetCities()

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name_arabic: Yup.string().required('Name is required'),
    name_english: Yup.string().required('Name is required'),
    country: Yup.string(),
    city: Yup.string().nullable(),
    type: Yup.string().nullable(),
    webpage: Yup.string(),
    phone: Yup.string(),
    address: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name_arabic: currentTable?.name_arabic || '',
      name_english: currentTable?.name_english || '',
      country: currentTable?.country?._id || null,
      city: currentTable?.city?._id || null,
      type: currentTable?.type?._id || null,
      webpage: currentTable?.webpage || '',
      phone: currentTable?.phone || '',
      address: currentTable?.address || '',
    }),
    [currentTable]
    );
    console.log(currentTable)
    console.log(defaultValues)

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if(currentTable){
       await axiosHandler({method:'PATCH',path:`insurance/companies/${currentTable._id}`,data});
      }else{
       await axiosHandler({method:'POST',path:'insurance/companies',data});
      }
      reset();
      enqueueSnackbar(currentTable ? 'Update success!' : 'Create success!');
      router.push(paths.superadmin.tables.insurancecomapnies.root);
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
              }}
            >
              <RHFTextField name="name_english" label="name english" />
              <RHFTextField name="name_arabic" label="name arabic" />

              <RHFSelect native name="country" label="Country" >
                <option> </option>
                {countriesData.map((country) => (
                  <option key={country._id} value={country._id}>
                      {country.name_english}
                    </option>
                ))}
                </RHFSelect>
              <RHFSelect native name="city" label="city" >
                <option> </option>
                {tableData.map((city) => (
                  <option key={city._id} value={city._id}>
                      {city.name_english}
                    </option>
                ))}
                </RHFSelect>
              <RHFSelect native name="type" label="type" >
                <option> </option>
                {insuranseTypesData.map((type) => (
                  <option key={type._id} value={type._id}>
                      {type.name_english}
                    </option>
                ))}
              </RHFSelect>
              <RHFTextField name="webpage" label="web page link" />
              <RHFTextField name="phone" label="phone no" />
              <RHFTextField name="address" label="address" />
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
