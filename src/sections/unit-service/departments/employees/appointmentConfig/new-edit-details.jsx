import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
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

export default function NewEditDetails() {
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
    let minutesNum = 0;
    let sum = 0;
  
    values.days_details.forEach((item, index) => {
      console.log("item",item)
      const { work_end_time, work_start_time } = item;
      console.log("work_end_time, work_start_time",work_end_time, work_start_time)
      minutesNum += calculateMinutesDifference(work_start_time,work_end_time);
      console.log("calculateMinutesDifference(work_start_time,work_end_time)",calculateMinutesDifference(work_start_time,work_end_time))
      sum += 1 ;
    });
    console.log("sum > 0 ? minutesNum / sum : 0",sum > 0 ? minutesNum / sum : 0)
  
    return sum > 0 && values.appointment_time ? minutesNum / sum /values.appointment_time : 0;
  }

  return (
    <Stack sx={{ p: 3 }}>
      <Typography variant="p" sx={{ color: 'text.disabled'}}>
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
            gridTemplateColumns: 'repeat(7, 1fr)',
          }}
        />
      </Stack>
      <Typography variant="p" sx={{ color: 'text.disabled'}}>
        Details:
      </Typography>
      <Stack
        spacing={2}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ p: 3, bgcolor: 'background.neutral', width: { xs: '100%', md: 'auto' } }}
      >
        <RHFSelect
          size="small"
          name="work_shift"
          label="Work Shift"
          // InputLabelProps={{ shrink: true }}
          PaperPropsSx={{ textTransform: 'capitalize' }}
        >
          {workShiftsData.map((option) => (
            <MenuItem key={option} value={option._id}>
              {option.name_english}
            </MenuItem>
          ))}
        </RHFSelect>
        <RHFSelect
          size="small"
          name="work_group"
          label="Work Group"
          // InputLabelProps={{ shrink: true }}
          PaperPropsSx={{ textTransform: 'capitalize' }}
        >
          {workGroupsData.map((option) => (
            <MenuItem key={option} value={option._id}>
              {option.name_english}
            </MenuItem>
          ))}
        </RHFSelect>
        <RHFTextField
          size="small"
          InputProps={{
            endAdornment: <InputAdornment position="end">min</InputAdornment>,
          }}
          name="appointment_time"
          label="Appointment Duration Time"
          type="number"
          value={values.appointment_time}
        />
        <RHFTextField
          disabled
          size="small"
          name="appointments_number"
          label="Appointments Number"
          value={calculateAverageAppointmentNumber()}
        />

        {/* <Controller
          name="createDate"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DatePicker
              label="Date create"
              value={field.value}
              onChange={(newValue) => {
                field.onChange(newValue);
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!error,
                  helperText: error?.message,
                },
              }}
            />
          )}
        /> */}
      </Stack>
    </Stack>
  );
}
