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
import { Typography, Checkbox, FormControlLabel, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import {
  useGetCountries,
  useGetCities,
  useGetSpecialties,
  useGetUSTypes,
  useGetEmployeeEngagement,
} from 'src/api/tables';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFMultiCheckbox } from 'src/components/hook-form';

import axios, { endpoints } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const options = [
  { label: 'read', value: 'read' },
  { label: 'create', value: 'create' },
  { label: 'update', value: 'update' },
];

export default function TableNewEditForm({acl}) {
  const router = useRouter();

  const employeeId = useParams().id;

  const { user } = useAuthContext();

  console.log('acl',acl)

  const { enqueueSnackbar } = useSnackbar();

  const accessControlList = Yup.object().shape({
    appointment: Yup.array(),
    appointment_config: Yup.array(),
    unit_service_info: Yup.array(),
    accounting: Yup.array(),
    invoices: Yup.array(),
    old_files: Yup.array(),
    final_reporting: Yup.array(),
    tax_reporting: Yup.array(),
  });

  const defaultValues = useMemo(
    () => ({
      appointment:acl?.appointment || [],
      appointment_config:acl?.appointment_config || [],
      unit_service_info:acl?.unit_service_info|| [],
      accounting:acl?.accounting|| [],
      invoices:acl?.invoices|| [],
      old_files:acl?.old_files|| [],
      final_reporting:acl?.final_reporting|| [],
      tax_reporting:acl?.tax_reporting|| [],
    }),
    [acl]
  );

  const methods = useForm({
    resolver: yupResolver(accessControlList),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('data', data);
      axios.patch(endpoints.tables.employeeEngagement(employeeId),{acl:data})
      enqueueSnackbar('Update success!');
      // router.push(paths.superadmin.subscriptions.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} maxWidth="md">
          <Card sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between',alignItems:'center' }}>
              <Typography variant="subtitle1">appointment</Typography>
              <RHFMultiCheckbox
                name="appointment"
                options={options}
                sx={{
                  ml: 4,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
                }}
              />
            </Box>
              <hr/>
            <Box sx={{ my:1, display: 'flex', justifyContent: 'space-between',alignItems:'center' }}>
              <Typography variant="subtitle1">appointment_config</Typography>
              <RHFMultiCheckbox
                name="appointment_config"
                options={options}
                sx={{
                  ml: 4,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
                }}
                />
            </Box>
                <hr/>
            <Box sx={{ my:1, display: 'flex', justifyContent: 'space-between',alignItems:'center' }}>
              <Typography variant="subtitle1">unit_service_info</Typography>
              <RHFMultiCheckbox
                name="unit_service_info"
                options={options}
                sx={{
                  ml: 4,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
                }}
                />
            </Box>
              <hr/>
            <Box sx={{ my:1, display: 'flex', justifyContent: 'space-between',alignItems:'center' }}>
              <Typography variant="subtitle1">accounting</Typography>
              <RHFMultiCheckbox
                name="accounting"
                options={options}
                sx={{
                  ml: 4,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
                }}
                />
            </Box>
                <hr/>
            <Box sx={{ my:1, display: 'flex', justifyContent: 'space-between',alignItems:'center' }}>
              <Typography variant="subtitle1">invoices</Typography>
              <RHFMultiCheckbox
                name="invoices"
                options={options}
                sx={{
                  ml: 4,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
                }}
                />
            </Box>
              <hr/>
            <Box sx={{ my:1, display: 'flex', justifyContent: 'space-between',alignItems:'center' }}>
              <Typography variant="subtitle1">old_files</Typography>
              <RHFMultiCheckbox
                name="old_files"
                options={options}
                sx={{
                  ml: 4,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
                }}
                />
            </Box>
                <hr/>
            <Box sx={{ my: 1, display: 'flex', justifyContent: 'space-between',alignItems:'center' }}>
              <Typography variant="subtitle1">final_reporting</Typography>
              <RHFMultiCheckbox
                name="final_reporting"
                options={options}
                sx={{
                  ml: 4,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
                }}
                />
            </Box>
                <hr/>
            <Box sx={{ my:1, display: 'flex', justifyContent: 'space-between',alignItems:'center' }}>
              <Typography variant="subtitle1">tax_reporting</Typography>
              <RHFMultiCheckbox
                name="tax_reporting"
                options={options}
                sx={{
                  ml: 4,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
                }}
              />
            </Box>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
TableNewEditForm.propTypes = {
  acl: PropTypes.array,
};