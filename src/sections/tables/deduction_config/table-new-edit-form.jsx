import * as Yup from 'yup';
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { endpoints } from 'src/utils/axios';
import axiosHandler from 'src/utils/axios-handler';

import { useGetUnitservices, useGetServiceTypes, useGetEmployees } from 'src/api/tables';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable }) {
  const router = useRouter();

  const {user} = useAuthContext()

  const { unitservicesData } = useGetUnitservices();
  const { employeesData } = useGetEmployees();
  const { serviceTypesData } = useGetServiceTypes();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name_arabic: Yup.string().required('Name is required'),
    name_english: Yup.string().required('Name is required'),
    unit_service: Yup.string(),
    Employee: Yup.string().nullable(),
    Service: Yup.string().nullable(),
    Place_of_service: Yup.string(),
    type: Yup.string(),
    percentage: Yup.number(),
    Comment: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name_arabic: currentTable?.name_arabic || '',
      name_english: currentTable?.name_english || '',
      unit_service: currentTable?.unit_service?._id || null,
      Employee: currentTable?.Employee?._id || null,
      Service: currentTable?.Service?._id || null,
      Place_of_service: currentTable?.Place_of_service || '',
      type: currentTable?.type || '',
      percentage: currentTable?.percentage || '',
      Comment: currentTable?.Comment || '',
    }),
    [currentTable]
  );
  console.log(currentTable);
  console.log(defaultValues);

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
      if (currentTable) {
         await axiosHandler({
          method: 'PATCH',
          path: `${endpoints.tables.deduction(currentTable._id)}`,
          data:{user_modification:user._id,...data},
        });
      } else {
         await axiosHandler({
          method: 'POST',
          path: `${endpoints.tables.deductions}`,
          data:{user_creation:user._id,...data},
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
      router.push(paths.superadmin.tables.deductionconfig.root);
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

              <RHFSelect native name="unit_service" label="Unit Service">
                <option> </option>
                {unitservicesData.map((unit_service) => (
                  <option key={unit_service._id} value={unit_service._id}>
                    {unit_service.name_english}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect native name="Employee" label="Employee">
                <option> </option>
                {employeesData.map((Employee) => (
                  <option key={Employee._id} value={Employee._id}>
                    {Employee.name_english}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect native name="Service" label="Service">
                <option> </option>
                {serviceTypesData.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.name_english}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect native name="type" label="Type">
                <option> </option>
                <option value="from income">from income </option>
                <option value="from sales">from sales </option>
              </RHFSelect>
              <RHFTextField name="Place_of_service" label="Place of service" />
              <RHFTextField type='number' name="percentage" label="percentage %" />
              <RHFTextField name="Comment" label="Comment" />
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
