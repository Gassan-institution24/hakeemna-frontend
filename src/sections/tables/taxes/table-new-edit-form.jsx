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

import { useGetUnitservices,useGetCategories } from 'src/api/tables';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFTextField,
} from 'src/components/hook-form';
import axiosHandler from 'src/utils/axios-handler';

// ----------------------------------------------------------------------

export default function CitiesNewEditForm({ currentTable }) {
  const router = useRouter();

  const {unitservicesData}=useGetUnitservices()

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name_arabic: Yup.string().required('Name is required'),
    name_english: Yup.string().required('Name is required'),
    unit_service: Yup.string().required('unit service is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name_arabic: currentTable?.name_arabic || '',
      name_english: currentTable?.name_english || '',
      unit_service: currentTable?.unit_service?._id || '',
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
       await axiosHandler({method:'PATCH',path:`taxes/${currentTable._id}`,data});
      }else{
       await axiosHandler({method:'POST',path:'taxes',data});
      }
      reset();
      enqueueSnackbar(currentTable ? 'Update success!' : 'Create success!');
      router.push(paths.superadmin.tables.taxes.root);
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

              <RHFSelect native name="unit_service" label="unit service" >
                <option> </option>
                {unitservicesData.map((unit) => (
                    <option key={unit._id} value={unit._id}>
                      {unit.name_english}
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

CitiesNewEditForm.propTypes = {
  currentTable: PropTypes.object,
};
