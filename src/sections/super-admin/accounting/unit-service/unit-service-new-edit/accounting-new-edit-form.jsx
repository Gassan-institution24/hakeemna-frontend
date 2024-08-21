import * as Yup from 'yup';
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { MenuItem } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { DatePicker } from '@mui/x-date-pickers';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import {
  useGetFreeSubscriptions,
  useGetActiveSubscriptions,
  useGetActivePaymentMethods,
} from 'src/api';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ licenseMovementData, unitServiceData }) {
  const router = useRouter();

  const { freeSubscriptionsData } = useGetFreeSubscriptions();
  const { subscriptionsData } = useGetActiveSubscriptions();
  const { paymentMethodsData } = useGetActivePaymentMethods();

  const { enqueueSnackbar } = useSnackbar();

  const NewSchema = Yup.object().shape({
    free_subscription: Yup.string().nullable(),
    subscription: Yup.string().nullable(),
    Payment_method: Yup.string().required('Payment method is required'),
    Payment_frequency: Yup.string().required('Payment frequency is required'),
    note: Yup.string(),
    Start_date: Yup.date().required('Start date is required'),
    End_date: Yup.date().required('End date is required'),
    Users_num: Yup.number().required('Number of users is required'),
    price: Yup.number().required('Price is required'),
  });

  const defaultValues = useMemo(
    /// edit
    () => ({
      free_subscription: licenseMovementData?.free_subscription?._id || null,
      subscription: licenseMovementData?.subscription?._id || null,
      Payment_method: licenseMovementData?.Payment_method?._id || null,
      Payment_frequency: licenseMovementData?.Payment_frequency || '',
      note: licenseMovementData?.note || '',
      Start_date: licenseMovementData?.Start_date || '',
      End_date: licenseMovementData?.End_date || '',
      Users_num: licenseMovementData?.Users_num || '',
      price: licenseMovementData?.price || '',
    }),
    [licenseMovementData]
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (licenseMovementData) {
        await axiosInstance.patch(endpoints.license_movements.one(licenseMovementData._id), data);
      } else {
        await axiosInstance.post(endpoints.license_movements.all, data);
      }
      reset();
      enqueueSnackbar(licenseMovementData ? 'Update success!' : 'Create success!');
      router.push(paths.superadmin.accounting.unitservice.root(unitServiceData._id));
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
              <RHFSelect name="free_subscription" label="Free Subscription">
                {freeSubscriptionsData.map((subscription, idx) => (
                  <MenuItem lang="ar" key={idx} value={subscription._id}>
                    {subscription.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="subscription" label="subscription">
                {subscriptionsData.map((backage, idx) => (
                  <MenuItem lang="ar" key={idx} value={backage._id}>
                    {backage.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="Payment_method" label="Payment method">
                {paymentMethodsData.map((method, idx) => (
                  <MenuItem lang="ar" key={idx} value={method._id}>
                    {method.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="Payment_frequency" label="Payment Frequency">
                <MenuItem lang="ar" value="once a week">
                  once a week
                </MenuItem>
                <MenuItem lang="ar" value="once a month">
                  once a month
                </MenuItem>
              </RHFSelect>
              <DatePicker
                name="Start_date"
                label="Start date"
                onChange={(date) => methods.setValue('Start_date', date, { shouldValidate: true })}
                // Parse the UTC date string to a JavaScript Date object
                value={
                  methods.getValues('Start_date') ? new Date(methods.getValues('Start_date')) : null
                }
              />
              <DatePicker
                name="End_date"
                label="End date"
                onChange={(date) => methods.setValue('End_date', date, { shouldValidate: true })}
                // Parse the UTC date string to a JavaScript Date object
                value={
                  methods.getValues('End_date') ? new Date(methods.getValues('End_date')) : null
                }
              />
              <RHFTextField name="price" label="Price" type="number" />
              <RHFTextField name="Users_num" label="Users no" type="number" />
              <RHFTextField name="note" label="note" />
            </Box>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" tabIndex={-1} variant="contained" loading={isSubmitting}>
                {!licenseMovementData ? 'Create One' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

TableNewEditForm.propTypes = {
  licenseMovementData: PropTypes.object,
  unitServiceData: PropTypes.object,
};
