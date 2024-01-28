import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { zonedTimeToUtc } from 'date-fns-tz';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

import axios, { endpoints } from 'src/utils/axios';
import { useSnackbar } from 'src/components/snackbar';
import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';
import FormProvider, { RHFSelect, RHFTextField, RHFMultiSelect } from 'src/components/hook-form';
import {
  useGetAppointmentTypes,
  useGetUSServiceTypes,
  useGetEmployeeWorkGroups,
  useGetUSWorkShifts,
} from 'src/api/tables';
import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function BookManually({ onClose, refetch, ...other }) {
  const router = useRouter();
  const popover = usePopover();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const { id } = useParams();

  const { appointmenttypesData } = useGetAppointmentTypes();
  const { serviceTypesData } = useGetUSServiceTypes(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id
  );
  const { workGroupsData } = useGetEmployeeWorkGroups(id);
  const { workShiftsData } = useGetUSWorkShifts(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id
  );

  console.log('workGroupsData', workGroupsData);

  const NewUserSchema = Yup.object().shape({
    work_shift: Yup.string().required('Work Shift is required'),
    work_group: Yup.string().required('Work Group is required'),
    service_types: Yup.array(),
    appointment_type: Yup.string().required('Appointment Type is required'),
    start_time: Yup.date().required('Start time is required'),
  });

  const defaultValues = useMemo(
    () => ({
      appointment_type: null,
      start_time: null,
      work_group: null,
      work_shift: null,
      service_types: [],
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });
  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axios.post(endpoints.tables.appointments, {
        ...data,
        emergency: true,
        unit_service:
          user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service
            ._id,
      });
      reset();
      enqueueSnackbar('Create success!');
      refetch();
      console.info('DATA', data);
      onClose();
    } catch (error) {
      enqueueSnackbar(`Please try again later!: ${error}`, { variant: 'error' });
      console.error(error);
    }
  });

  return (
    <>
      <Dialog maxWidth="lg" onClose={onClose} {...other}>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <DialogTitle sx={{ mb: 1 }}> New Emergency Appointment </DialogTitle>

          <DialogContent sx={{ overflow: 'unset' }}>
            <Stack spacing={2.5}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(1, 1fr)',
                }}
              >
                <Controller
                  name="start_time"
                  render={({ field, fieldState: { error } }) => (
                    <MobileDateTimePicker
                      label="Start date"
                      sx={{ width: '30vw', minWidth: '300px' }}
                      onChange={(newValue) => {
                        const selectedTime = zonedTimeToUtc(
                          newValue,
                          user?.employee?.employee_engagements[user?.employee.selected_engagement]
                            ?.unit_service?.country?.time_zone
                        );
                        setValue('start_time', new Date(selectedTime));
                      }}
                      minutesStep="5"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: 'normal',
                        },
                      }}
                    />
                  )}
                />
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  <RHFSelect name="appointment_type" label="Appointment Type">
                    {appointmenttypesData.map((option) => (
                      <MenuItem value={option._id}>{option.name_english}</MenuItem>
                    ))}
                  </RHFSelect>
                  <RHFSelect
                    name="work_shift"
                    label="Work Shift"
                    PaperPropsSx={{ textTransform: 'capitalize' }}
                  >
                    {workShiftsData &&
                      workShiftsData.map((option) => (
                        <MenuItem key={option._id} value={option._id}>
                          {option.name_english}
                        </MenuItem>
                      ))}
                  </RHFSelect>
                  <RHFSelect name="work_group" label="Work Group">
                    {workGroupsData.map((option) => (
                      <MenuItem key={option._id} value={option._id}>
                        {option.name_english}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                  <RHFMultiSelect
                    checkbox
                    name="service_types"
                    label="Service Types"
                    options={serviceTypesData}
                  />
                </Box>
              </Box>

              <Stack
                direction="row"
                alignItems="center"
                sx={{ typography: 'caption', color: 'text.disabled' }}
              >
                <Iconify icon="carbon:locked" sx={{ mr: 0.5 }} />
                Your transaction is secured with SSL encryption
              </Stack>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button color="inherit" variant="outlined" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" variant="contained">
              Add
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="bottom-center"
        sx={{ maxWidth: 200, typography: 'body2', textAlign: 'center' }}
      >
        Three-digit number on the back of your VISA card
      </CustomPopover>
    </>
  );
}

BookManually.propTypes = {
  onClose: PropTypes.func,
  refetch: PropTypes.func,
};
