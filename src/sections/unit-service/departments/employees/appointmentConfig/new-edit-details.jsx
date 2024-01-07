import { Controller, useFormContext } from 'react-hook-form';

import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Iconify from 'src/components/iconify';
import { RHFSelect, RHFTextField, RHFMultiCheckbox } from 'src/components/hook-form';
import { useGetWorkGroups, useGetWorkShifts } from 'src/api/tables';

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

export default function NewEditDetails({appointmentConfigData}) {
  const { control, watch, getValues } = useFormContext();

  const values = getValues();

  const { workGroupsData } = useGetWorkGroups();
  const { workShiftsData } = useGetWorkShifts();

  function calculateMinutesDifference(date1, date2) {
    const diffInMilliseconds = Math.abs(date2 - date1);
    const minutesDifference = Math.floor(diffInMilliseconds / (1000 * 60));
    return minutesDifference;
  }

  function calculateAverageAppointmentNumber() {
    // let minutesNum = 0;
    let sum = 0;
    let numberOfAppoint = 0;

    values.days_details.forEach((item, index) => {
      const { work_end_time, work_start_time, break_end_time, break_start_time } = item;
      let minutesNum = 0;
      if (work_end_time && work_start_time) {
        minutesNum = calculateMinutesDifference(new Date(work_start_time), new Date(work_end_time));
      }
      if (break_end_time && break_start_time) {
        minutesNum -= calculateMinutesDifference(new Date(break_start_time), new Date(break_end_time));
      }
      sum += 1;
      if (values.appointment_time) {
        numberOfAppoint += Math.floor(minutesNum / values.appointment_time);
      }
    });
    // return Math.floor(sum > 0 && values.appointment_time ? minutesNum * sum / values.appointment_time : 0);
    return Math.floor(numberOfAppoint / sum);
  }

  return (
    <Stack sx={{ p: 3 }}>
      <Typography variant="p" sx={{ color: 'text.disabled' }}>
        Weekly Days Off:
      </Typography>
      <Stack
        spacing={2}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ p: 3, bgcolor: 'background.neutral' }}
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
      <Typography variant="p" sx={{ color: 'text.disabled' }}>
        Details:
      </Typography>
      <Stack
        spacing={2}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ p: 3, bgcolor: 'background.neutral', width: { xs: '100%', md: 'auto' } }}
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
          {workShiftsData.map((option) => (
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
          {workGroupsData.map((option) => (
            <option key={option._id} value={option._id}>
              {option.name_english}
            </option>
          ))}
        </RHFSelect>
        <RHFTextField
          size="small"
          InputProps={{
            endAdornment: <InputAdornment position="end" >
              <Box sx={{ fontSize: '0.8rem'}}>
              min
              </Box></InputAdornment>,
          }}
          name="appointment_time"
          label="Appointment Duration Time"
          inputProps={{ min: 5, max: 180,step: 5 }}
          type="number"
          InputLabelProps={{ shrink: true }}
        />
        <RHFTextField
          size="small"
          InputProps={{
            startAdornment:  <InputAdornment position="start"><Box  sx={{ fontSize: '0.8rem'}}>
            for the next
            </Box></InputAdornment>,
            endAdornment: <InputAdornment position="end"><Box sx={{ fontSize: '0.8rem'}}>
            days
            </Box></InputAdornment>,
          }}
          name="config_frequency"
          label="Configuration Frequency"
          type="number"
          inputProps={{ min: 0, max: 30, textAlign: 'center' }}
          InputLabelProps={{ shrink: true }}
        />
        <RHFTextField
          disabled
          size="small"
          name="appointments_number"
          label="Daily Appointments Number"
          InputLabelProps={{ shrink: true }}
          value={calculateAverageAppointmentNumber()}
        />
      </Stack>
    </Stack>
  );
}

NewEditDetails.propTypes = {
  appointmentConfigData: PropTypes.object,
};
