import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import axios, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFTimePicker } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function EditEmployee({ employee, refetch }) {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const UpdateUserSchema = Yup.object().shape({
    start_time: Yup.date(),
    end_time: Yup.date(),
    salary: Yup.number(),
    monthly_hours: Yup.number(),
  });

  const defaultValues = {
    start_time: employee?.start_time || null,
    end_time: employee?.end_time || null,
    salary: employee?.salary || 0,
    monthly_hours: employee?.monthly_hours || 0,
  };

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (profileData) => {
    try {
      await axios.patch(`${endpoints.employee_engagements.one(employee?._id)}`, profileData);
      enqueueSnackbar(`${t('Profile updated successfully')}`, { variant: 'success' });
      refetch();
    } catch (error) {
      enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
              <RHFTimePicker name="start_time" label={t('work start time')} />
              <RHFTimePicker name="end_time" label={t('work end time')} />
              <RHFTextField type="number" name="salary" label={t('salary')} />
              <RHFTextField type="number" name="monthly_hours" label={t('work hours / month')} />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" tabIndex={-1} variant="contained" loading={isSubmitting}>
                {t('Save Changes')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
EditEmployee.propTypes = {
  employee: PropTypes.object,
  refetch: PropTypes.func,
};
