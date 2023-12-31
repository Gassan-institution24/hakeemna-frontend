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

import { useGetUnitservices } from 'src/api/tables';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import axios from 'axios';
import axiosHandler from 'src/utils/axios-handler';
import { endpoints } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable }) {
  const router = useRouter();

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name_arabic: Yup.string().required('Name is required'),
    name_english: Yup.string().required('Name is required'),
    general_info: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name_arabic: currentTable?.name_arabic || '',
      name_english: currentTable?.name_english || '',
      general_info: currentTable?.general_info || '',
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
      const address = await axios.get('https://geolocation-db.com/json/');
      if (currentTable) {
        await axiosHandler({
          method: 'PATCH',
          path: endpoints.tables.department(currentTable._id),
          data: {
            modifications_nums: (currentTable.modifications_nums || 0) + 1,
            ip_address_user_modification: address.data.IPv4,
            user_modification: user._id,
            unit_service: user.unit_service._id,
            ...data,
          },
        });
      } else {
        await axiosHandler({
          method: 'POST',
          path: endpoints.tables.departments,
          data: {
            ip_address_user_creation: address.data.IPv4,
            user_creation: user._id,
            ...data,
            unit_service: user.unit_service._id,
          },
        });
      }
      reset();
      enqueueSnackbar(currentTable ? 'Update success!' : 'Create success!');
      router.push(paths.unitservice.departments.root);
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
              <RHFTextField name="general_info" label="general info" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentTable ? 'Create' : 'Save Changes'}
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
