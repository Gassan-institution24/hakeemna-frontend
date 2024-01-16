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
import { DatePicker } from '@mui/x-date-pickers';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import axios from 'axios';
import axiosHandler from 'src/utils/axios-handler';
import { endpoints } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';
import { useGetFreeSubscriptions, useGetPaymentMethods, useGetSubscriptions } from 'src/api/tables';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ licenseMovementData, unitServiceData }) {
  const router = useRouter();

  const { user } = useAuthContext();

  const { freeSubscriptionsData } = useGetFreeSubscriptions();
  const { subscriptionsData } = useGetSubscriptions();
  const { paymentMethodsData } = useGetPaymentMethods();

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
      if (licenseMovementData) {
        await axiosHandler({
          method: 'PATCH',
          path: endpoints.tables.licenseMovement(licenseMovementData._id),
          data: {
            modifications_nums: (licenseMovementData.modifications_nums || 0) + 1,
            ip_address_user_modification: address.data.IPv4,
            user_modification: user._id,
            ...data,
          },
        }); /// edit
      } else {
        await axiosHandler({
          method: 'POST',
          path: endpoints.tables.licenseMovements,
          data: {
            unit_service: unitServiceData._id,
            ip_address_user_creation: address.data.IPv4,
            user_creation: user._id,
            ...data,
          },
        }); /// edit
      }
      reset();
      enqueueSnackbar(licenseMovementData ? 'Update success!' : 'Create success!');
      router.push(paths.superadmin.unitservices.accounting(unitServiceData._id));
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
              <RHFSelect native name="free_subscription" label="Free Subscription">
                <MenuItem>{null}</MenuItem>
                {freeSubscriptionsData.map((subscription) => (
                  <MenuItem key={subscription._id} value={subscription._id}>
                    {subscription.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect native name="subscription" label="subscription">
                <MenuItem>{null}</MenuItem>
                {subscriptionsData.map((backage) => (
                  <MenuItem key={backage._id} value={backage._id}>
                    {backage.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect native name="Payment_method" label="Payment method">
                <MenuItem>{null}</MenuItem>
                {paymentMethodsData.map((method) => (
                  <MenuItem key={method._id} value={method._id}>
                    {method.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect native name="Payment_frequency" label="Payment Frequency">
                <MenuItem>{null}</MenuItem>
                <MenuItem value="once a week">once a week</MenuItem>
                <MenuItem value="once a month">once a month</MenuItem>
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
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
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
