import { Controller, useFormContext } from 'react-hook-form';
import { useParams } from 'react-router';

import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';

import Iconify from 'src/components/iconify';
import { useAuthContext } from 'src/auth/hooks';
import { RHFSelect, RHFTextField, RHFMultiCheckbox } from 'src/components/hook-form';
import { useGetUSEmployeeWorkGroups, useGetUSWorkShifts } from 'src/api/tables';

// ----------------------------------------------------------------------
const weekDays = [
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
  { value: 'Monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
];

export default function NewEditDetails({ appointmentConfigData, setAppointTime }) {
  const { control, watch, getValues, setValue } = useFormContext();

  const values = getValues();

  const {user} = useAuthContext()

  const {id} = useParams()

  const { workGroupsData } = useGetUSEmployeeWorkGroups(user.unit_service._id,id);
  const { workShiftsData } = useGetUSWorkShifts(user.unit_service._id);

  return (
    <>
      <Divider flexItem sx={{ borderStyle: 'solid' }} />
      <Stack sx={{ p: 3 }}>
        {/* <Typography
          variant="p"
          sx={{ color: 'text.secondary', mb: 3, fontWeight: '700', textTransform: 'capitalize' }}
        >
          Details:
        </Typography> */}
        <Stack
          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ p: 3, width: { xs: '100%', md: 'auto' } }}
        >
          <Controller
            name="start_date"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                label="Start Date"
                // sx={{ flex: 1 }}
                value={new Date(values.start_date || '')}
                onChange={(newValue) => {
                  field.onChange(newValue);
                }}
                slotProps={{
                  textField: {
                    // size: 'small',
                    fullWidth: true,
                    error: !!error,
                    helperText: error?.message,
                  },
                }}
              />
            )}
          />
          <Controller
            name="end_date"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                label="End Date"
                // sx={{ flex: 1 }}
                value={new Date(values.end_date || '')}
                onChange={(newValue) => {
                  field.onChange(newValue);
                }}
                slotProps={{
                  textField: {
                    // size: 'small',
                    fullWidth: true,
                    error: !!error,
                    helperText: error?.message,
                  },
                }}
              />
            )}
          />
        </Stack>
        <Stack
          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ px: 3, pb: 3, width: { xs: '100%', md: 'auto' } }}
        >
          <RHFSelect
            native
            size="small"
            name="work_shift"
            label="Work Shift"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
            disabled={Boolean(appointmentConfigData)}
          >
            <option value={null}> </option>
            {workShiftsData&&workShiftsData.map((option) => (
              <option key={option._id} value={option._id}>
                {option.name_english}
              </option>
            ))}
          </RHFSelect>
          <RHFSelect
            native
            size="small"
            name="work_group"
            label="Work Group"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
            disabled={Boolean(appointmentConfigData)}
          >
            <option value={null}> </option>
            {workGroupsData&&workGroupsData?.map((option) => (
              <option key={option._id} value={option._id}>
                {option.name_english}
              </option>
            ))}
          </RHFSelect>
          <Controller
            name="appointment_time"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                fullWidth
                label="Appointment Time"
                type='number'
                value={field.value === 0 ? '' : field.value}
                onChange={(event) => {
                    field.onChange(Number(event.target.value));
                    setAppointTime(event.target.value)
                }}
                error={!!error}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box sx={{ fontSize: '0.8rem' }}>min</Box>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <RHFTextField
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ fontSize: '0.8rem' }}>for the next</Box>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Box sx={{ fontSize: '0.8rem' }}>days</Box>
                </InputAdornment>
              ),
            }}
            name="config_frequency"
            label="Configuration Frequency"
            type="number"
            inputProps={{ min: 0, max: 30, textAlign: 'center' }}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
        <Typography
          variant="p"
          sx={{ color: 'text.secondary', mb: 3, fontWeight: '700', textTransform: 'capitalize' }}
        >
          Weekly Days Off:
        </Typography>
        <Stack
          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ p: 3 }}
        >
          <RHFMultiCheckbox
            size="small"
            name="weekend"
            options={weekDays}
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                md: 'repeat(7, 1fr)',
                sm: 'repeat(4, 1fr)',
                xs: 'repeat(2, 1fr)',
              },
            }}
          />
        </Stack>
      </Stack>
    </>
  );
}

NewEditDetails.propTypes = {
  appointmentConfigData: PropTypes.object,
  setAppointTime: PropTypes.func,
};
