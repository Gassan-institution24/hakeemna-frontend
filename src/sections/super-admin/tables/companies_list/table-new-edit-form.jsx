import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentSelected }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewSchema = Yup.object().shape({
    unit_service_type: Yup.string(),
    country: Yup.string(),
    city: Yup.string(),
    sector: Yup.string(),
    commercial_name: Yup.string().required('required field'),
    province: Yup.string(),
    address: Yup.string(),
    phone_number_1: Yup.string(),
    Phone_number_2: Yup.string(),
    work_shift: Yup.string(),
    constitution_objective: Yup.string(),
    type_of_specialty_1: Yup.string(),
    type_of_specialty_2: Yup.string(),
    info: Yup.string(),
    email: Yup.string(),
    insurance: Yup.string(),
    subscribe_to: Yup.string(),
    social_network: Yup.string(),
    notes: Yup.string(),
    status: Yup.string().oneOf([
      'not contact',
      'agreed',
      'refused',
      'no number',
      'wrong number',
    ]),
    com_note: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      unit_service_type: currentSelected?.unit_service_type || '',
      country: currentSelected?.country || '',
      city: currentSelected?.city || '',
      sector: currentSelected?.sector || '',
      commercial_name: currentSelected?.commercial_name || '',
      province: currentSelected?.province || '',
      address: currentSelected?.address || '',
      phone_number_1: currentSelected?.phone_number_1 || '',
      Phone_number_2: currentSelected?.Phone_number_2 || '',
      work_shift: currentSelected?.work_shift || '',
      constitution_objective: currentSelected?.constitution_objective || '',
      type_of_specialty_1: currentSelected?.type_of_specialty_1 || '',
      type_of_specialty_2: currentSelected?.type_of_specialty_2 || '',
      info: currentSelected?.info || '',
      email: currentSelected?.email || '',
      insurance: currentSelected?.insurance || '',
      subscribe_to: currentSelected?.subscribe_to || '',
      social_network: currentSelected?.social_network || '',
      notes: currentSelected?.notes || '',
      status: currentSelected?.status || '',
      com_note: currentSelected?.com_note || '',
    }),
    [currentSelected]
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
      if (currentSelected) {
        await axiosInstance.patch(endpoints.companies.one(currentSelected._id), data);
      } else {
        await axiosInstance.post(endpoints.companies.all, data);
      }
      reset();
      enqueueSnackbar(currentSelected ? 'Update success!' : 'Create success!');
      router.push(`${paths.superadmin.tables.companies.root}`);
    } catch (error) {
      console.error(error);
    }
  });

  const onCancel = () => {
    router.push(`${paths.superadmin.tables.companies.root}`);
  };

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Card sx={{ p: 3 }}>
            <Box
              display="grid"
              gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '2fr auto 1fr' }}
              gap={3}
              alignItems="start"
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                  Location Info
                </Typography>
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                  <RHFTextField name="unit_service_type" label="unit_service_type" />
                  <RHFTextField name="country" label="country" />
                  <RHFTextField name="province" label="province" />
                  <RHFTextField name="city" label="city" />
                </Box>
                <Divider />
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                  Company Details
                </Typography>
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                  <RHFTextField name="commercial_name" label="commercial_name" />
                  <RHFTextField name="sector" label="sector" />
                  <RHFTextField name="constitution_objective" label="constitution_objective" />
                  <RHFTextField name="type_of_specialty_1" label="type_of_specialty_1" />
                  <RHFTextField name="type_of_specialty_2" label="type_of_specialty_2" />
                  <RHFTextField name="work_shift" label="work_shift" />
                  <RHFTextField name="insurance" label="insurance" />
                </Box>
                <Divider />
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                  Contact Info
                </Typography>
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                  <RHFTextField name="address" label="address" />
                  <RHFTextField name="phone_number_1" label="phone_number_1" />
                  <RHFTextField name="Phone_number_2" label="Phone_number_2" />
                  <RHFTextField name="email" label="email" />
                  <RHFTextField name="social_network" label="social network" />
                </Box>
                <Divider />
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                  Other Info
                </Typography>
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                  <RHFTextField name="info" label="info" />
                  <RHFTextField name="subscribe_to" label="subscribe to" />
                </Box>
              </Box>

              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <RHFTextField
                  name="com_note"
                  label="Communication Note"
                  multiline
                  minRows={4}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'primary.main' },
                      '&:hover fieldset': { borderColor: 'primary.dark' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.dark' },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'primary.main',
                      '&.Mui-focused': { color: 'primary.dark' },
                    },
                  }}
                />
                <RHFTextField
                  name="notes"
                  label="notes"
                  multiline
                  minRows={4}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'primary.main' },
                      '&:hover fieldset': { borderColor: 'primary.dark' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.dark' },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'primary.main',
                      '&.Mui-focused': { color: 'primary.dark' },
                    },
                  }}
                />
                <RHFTextField
                  name="status"
                  label="status"
                  select
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'primary.main' },
                      '&:hover fieldset': { borderColor: 'primary.dark' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.dark' },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'primary.main',
                      '&.Mui-focused': { color: 'primary.dark' },
                    },
                  }}
                >
                  <MenuItem value="not contact">تم التواصل</MenuItem>
                  <MenuItem value="agreed">قبول</MenuItem>
                  <MenuItem value="refused">رفض</MenuItem>
                  <MenuItem value="no number">لا يوجد رقم للتواصل</MenuItem>
                  <MenuItem value="wrong number">الرقم خاطئ</MenuItem>
                </RHFTextField>
              </Box>
            </Box>

            <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ mt: 3 }}>
              {currentSelected && (
                <LoadingButton variant="outlined" onClick={onCancel} sx={{ ml: 1 }}>
                  Cancel
                </LoadingButton>
              )}
              <LoadingButton
                type="submit"
                tabIndex={-1}
                variant="contained"
                loading={isSubmitting}
              >
                {!currentSelected ? 'Create One' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

TableNewEditForm.propTypes = {
  currentSelected: PropTypes.object,
};