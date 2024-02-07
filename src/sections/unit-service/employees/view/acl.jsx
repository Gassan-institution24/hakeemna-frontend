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
import {
  Typography,
  Checkbox,
  FormControlLabel,
  MenuItem,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  IconButton,
  Collapse,
  Paper,
  TableRow,
} from '@mui/material';
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
import Scrollbar from 'src/components/scrollbar';
import ACLGuard from 'src/auth/guard/acl-guard';

import { socket } from 'src/socket';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFMultiCheckbox } from 'src/components/hook-form';

import Iconify from 'src/components/iconify';
import { useAuthContext } from 'src/auth/hooks';
import axios, { endpoints } from 'src/utils/axios';
import { useBoolean } from 'src/hooks/use-boolean';

// ----------------------------------------------------------------------

const options = [
  { label: 'read', value: 'read' },
  { label: 'create', value: 'create' },
  { label: 'edit', value: 'update' },
  { label: 'delete', value: 'delete' },
];

export default function TableNewEditForm({ acl }) {
  const router = useRouter();

  const employeeId = useParams().id;

  const { user } = useAuthContext();

  // console.log('acl', acl);

  const { enqueueSnackbar } = useSnackbar();

  const accessControlList = Yup.object().shape({
    unit_service: Yup.object().shape({
      departments: Yup.array(),
      employees: Yup.array(),
      activities: Yup.array(),
      appointments: Yup.array(),
      appointment_configs: Yup.array(),
      accounting: Yup.array(),
      employee_type: Yup.array(),
      work_shift: Yup.array(),
      insurance: Yup.array(),
      offers: Yup.array(),
      quality_control: Yup.array(),
      subscriptions: Yup.array(),
      unit_service_info: Yup.array(),
      old_patient: Yup.array(),
    }),
    department: Yup.object().shape({
      employees: Yup.array(),
      activities: Yup.array(),
      appointments: Yup.array(),
      appointment_configs: Yup.array(),
      accounting: Yup.array(),
      rooms: Yup.array(),
      quality_control: Yup.array(),
      work_groups: Yup.array(),
    }),
    employee: Yup.object().shape({
      entrance_management: Yup.array(),
      appointments: Yup.array(),
      appointment_configs: Yup.array(),
      accounting: Yup.array(),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      employee: acl?.employee || {
        entrance_management: [],
        appointments: [],
        appointment_configs: [],
        accounting: [],
        offers: [],
        acl: [],
        communication: [],
        info: [],
      },
      department: acl?.department || {
        employees: [],
        activities: [],
        appointments: [],
        appointment_configs: [],
        accounting: [],
        rooms: [],
        quality_control: [],
        work_groups: [],
        department_info: [],
      },
      unit_service: acl?.unit_service || {
        departments: [],
        employees: [],
        activities: [],
        appointments: [],
        appointment_configs: [],
        accounting: [],
        employee_type: [],
        work_shift: [],
        insurance: [],
        offers: [],
        quality_control: [],
        subscriptions: [],
        unit_service_info: [],
        old_patient: [],
        communication: [],
      },
    }),
    [acl]
  );

  const methods = useForm({
    resolver: yupResolver(accessControlList),
    defaultValues,
  });

  const {
    reset,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = getValues();

  // console.log('values', values);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // console.log('data', data);
      axios.patch(endpoints.tables.employeeEngagement(employeeId), { acl: data });
      enqueueSnackbar('Update success!');
      // router.push(paths.superadmin.subscriptions.root);
      console.info('DATA', data);
    } catch (error) {
      socket.emit('error', {
        error,
        user,
        link: `/dashboard/systemerrors`,
        msg: `updating access control list of employee ${employeeId}`,
      });
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {ACLGuard({ category: 'employee', subcategory: 'acl', acl: 'update' }) && (
        <Stack alignItems="flex-end" sx={{ mb: 3, mr: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save Changes
          </LoadingButton>
        </Stack>
      )}
      <Box
        gap={{ xs: 3, lg: 10 }}
        height="1500px"
        display={{ md: 'flex', xs: 'block' }}
        alignItems="center"
        flexDirection="column"
        flexWrap="wrap"
      >
        {Object.keys(values)?.map((name) => (
          <Paper
            variant="outlined"
            sx={{
              bgcolor: 'background.neutral',
              py: 2,
              borderRadius: 1.5,
            }}
          >
            <Typography variant="h6" sx={{ m: 2, mt: 0 }}>
              {name}
            </Typography>
            {Object.keys(values[name]).map((subCategory) => (
              <TableRow key={subCategory}>
                <TableCell lang="ar" component="th" scope="row">
                  {subCategory}
                </TableCell>
                <TableCell lang="ar" align="center">
                  <RHFMultiCheckbox
                    name={`${name}.${subCategory}`}
                    options={options}
                    sx={{
                      ml: 4,
                      display: 'grid',
                      gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' },
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </Paper>
        ))}
      </Box>
    </FormProvider>
  );
}
TableNewEditForm.propTypes = {
  acl: PropTypes.array,
};
