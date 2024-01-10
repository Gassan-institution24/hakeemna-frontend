import * as Yup from 'yup';
import sum from 'lodash/sum';
import { format, isValid } from 'date-fns';
import { useEffect, useCallback, useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { inputBaseClasses } from '@mui/material/InputBase';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

import { fCurrency } from 'src/utils/format-number';
import { useBoolean } from 'src/hooks/use-boolean';

import { INVOICE_SERVICE_OPTIONS } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import NewEditDayAppointmentsDetails from './new-edit-days-appointments-details';

// ----------------------------------------------------------------------
const weekDays = [
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
];

export default function NewEditDayDetails() {
  const { control, setValue, watch, resetField, getValues } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'days_details',
  });

  const [showAppointments, setShowAppointments] = useState({});

  // console.log('fields', fields);
  const values = getValues();

  const handleAdd = () => {
    const defaultItem = {
      day: '',
      work_start_time: null,
      work_end_time: null,
      break_start_time: null,
      break_end_time: null,
      appointments: [],
    };
    const existingData = values.days_details
      ? values.days_details[values.days_details.length - 1]
      : ''; // Get the current form values
    const newItem = { ...defaultItem, ...existingData, day: '' };
    append(newItem);
  };

  const handleRemove = (index) => {
    remove(index);
  };
  function calculateMinutesDifference(date1, date2) {
    const first = new Date(date1);
    const second = new Date(date2);
    const diffInMilliseconds = Math.abs(second - first);
    const minutesDifference = Math.floor(diffInMilliseconds / (1000 * 60));
    return minutesDifference;
  }

  const createAppointmentsBefore = (item, index, minBeforeBreak) => {
    if (minBeforeBreak > 0) {
      const newStartTime = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        new Date(item.break_start_time).getHours(),
        new Date(item.break_start_time).getMinutes() - minBeforeBreak
      );
      const isDuplicate = values.days_details[index].appointments.some((appoint) => {
        // Convert existing appointment's start_time to a comparable format
        const existingStartTime = new Date(appoint.start_time);

        // Extract hours and minutes from both Date objects
        const newTime = newStartTime.getHours() * 60 + newStartTime.getMinutes();
        const existingTime = existingStartTime.getHours() * 60 + existingStartTime.getMinutes();

        // Check if hours and minutes are equal
        return newTime === existingTime;
      });
      if (!isDuplicate) {
        setValue(`days_details[${index}].appointments`, [
          ...values.days_details[index].appointments,
          {
            appointment_type: null,
            start_time: newStartTime,
            price: null,
            service_types: [],
          },
        ]);
      }

      minBeforeBreak -= values.appointment_time;

      // Return a promise to control the flow
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(createAppointmentsBefore(item, index, minBeforeBreak));
        }, 0);
      });
    }
    return Promise.resolve(); // Resolve the promise when done
  };

  const createAppointmentsAfter = (item, index, minAfterBreak) => {
    if (minAfterBreak > 0) {
      const newStartTime = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        new Date(item.work_end_time).getHours(),
        new Date(item.work_end_time).getMinutes() - minAfterBreak
      );
      const isDuplicate = values.days_details[index].appointments.some((appoint) => {
        // Convert existing appointment's start_time to a comparable format
        const existingStartTime = new Date(appoint.start_time);

        // Extract hours and minutes from both Date objects
        const newTime = newStartTime.getHours() * 60 + newStartTime.getMinutes();
        const existingTime = existingStartTime.getHours() * 60 + existingStartTime.getMinutes();

        // Check if hours and minutes are equal
        return newTime === existingTime;
      });
      if (!isDuplicate) {
        setValue(`days_details[${index}].appointments`, [
          ...values.days_details[index].appointments,
          {
            appointment_type: null,
            start_time: newStartTime,
            price: null,
            service_types: [],
          },
        ]);
      }

      minAfterBreak -= values.appointment_time;

      // Return a promise to control the flow
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(createAppointmentsAfter(item, index, minAfterBreak));
        }, 0);
      });
    }
    return Promise.resolve(); // Resolve the promise when done
  };

  const createAppointmentsAll = (item, index, minDay) => {
    if (minDay > 0) {
      const newStartTime = new Date(
        new Date(item.work_end_time).getFullYear(),
        new Date(item.work_end_time).getMonth(),
        new Date(item.work_end_time).getDate(),
        new Date(item.work_end_time).getHours(),
        new Date(item.work_end_time).getMinutes() - minDay
      );
      const isDuplicate = values.days_details[index].appointments.some((appoint) => {
        // Convert existing appointment's start_time to a comparable format
        const existingStartTime = new Date(appoint.start_time);

        // Extract hours and minutes from both Date objects
        const newTime = newStartTime.getHours() * 60 + newStartTime.getMinutes();
        const existingTime = existingStartTime.getHours() * 60 + existingStartTime.getMinutes();

        // Check if hours and minutes are equal
        return newTime === existingTime;
      });
      if (!isDuplicate) {
        setValue(`days_details[${index}].appointments`, [
          ...values.days_details[index].appointments,
          {
            appointment_type: null,
            start_time: newStartTime,
            price: null,
            service_types: [],
          },
        ]);
      }
      minDay -= values.appointment_time;

      // Return a promise to control the flow
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(createAppointmentsAll(item, index, minDay));
        }, 0);
      });
    }
    return Promise.resolve(); // Resolve the promise when done
  };

  const processDayDetails = async (index) => {
    // let index = 0;

    // const processNextItem = async () => {
    // function filterIsNotInTimes (){
    const arr = [];
    const appointment_time = values.appointment_time;
    const work_end = values.days_details[index].work_end_time;
    const work_start = values.days_details[index].work_start_time;
    const break_start = values.days_details[index].break_start_time;
    const break_end = values.days_details[index].break_end_time;
    const work_end_min = new Date(work_end).getHours() * 60 + new Date(work_end).getMinutes();
    const work_start_min = new Date(work_start).getHours() * 60 + new Date(work_start).getMinutes();
    const break_start_min =
      new Date(break_start).getHours() * 60 + new Date(break_start).getMinutes();
    const break_end_min = new Date(break_end).getHours() * 60 + new Date(break_end).getMinutes();
    let current_min = work_start_min;
    let current_after_min = break_end_min;
    if (break_start && break_end) {
      while (current_min < break_start_min) {
        arr.push(current_min);
        current_min += appointment_time;
      }
      while (current_after_min < work_end_min) {
        arr.push(current_after_min);
        current_after_min += appointment_time;
      }
    } else {
      while (current_min < work_end_min) {
        arr.push(current_min);
        current_min += appointment_time;
      }
    }
    const filteredAppoint = values.days_details[index].appointments.filter((appoint) =>
      arr.includes(
        new Date(appoint.start_time).getHours() * 60 + new Date(appoint.start_time).getMinutes()
      )
    );
    setValue(`days_details[${index}].appointments`, filteredAppoint);
    // }

    if (index < values.days_details.length) {
      const item = values.days_details[index];

      if (item.break_start_time && item.break_end_time) {
        await createAppointmentsBefore(
          item,
          index,
          calculateMinutesDifference(item.work_start_time, item.break_start_time)
        );
        await createAppointmentsAfter(
          item,
          index,
          calculateMinutesDifference(item.break_end_time, item.work_end_time)
        );
      } else {
        await createAppointmentsAll(
          item,
          index,
          calculateMinutesDifference(item.work_start_time, item.work_end_time)
        );
      }

      // index += 1;
      // await processNextItem();
    }
    // };

    // await processNextItem();
  };

  return (
    <>
      <Divider flexItem sx={{ borderStyle: 'solid' }} />
      <Box sx={{ p: 3 }}>
        <Typography
          variant="p"
          sx={{ color: 'text.secondary', mb: 3, fontWeight: '700', textTransform: 'capitalize' }}
        >
          Days Details:
        </Typography>

        <Stack
          sx={{ mt: 3 }}
          divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />}
          spacing={3}
        >
          {fields.map((item, index) => (
            <Stack
              key={item.id}
              // alignItems="flex-start"
              // flexWrap="wrap"
              spacing={1.5}
              sx={{ width: '100%' }}
            >
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                sx={{ width: '100%', mt: 2 }}
              >
                <RHFSelect size="small" native name={`days_details[${index}].day`} label="Day">
                  <option>{null}</option>
                  {weekDays
                    .filter(
                      (option) =>
                        !values.weekend.includes(option.value) &&
                        !values.days_details.some(
                          (detail) =>
                            detail.day === option.value &&
                            values.days_details[index]?.day !== option.value
                        )
                    )
                    .map((option) => (
                      <option value={option.value}>{option.label}</option>
                    ))}
                </RHFSelect>

                <Controller
                  name={`days_details[${index}].work_start_time`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <MobileTimePicker
                      minutesStep="5"
                      label="Work Start Time"
                      value={
                        values.days_details[index].work_start_time
                          ? new Date(values.days_details[index].work_start_time)
                          : null
                      }
                      onChange={(newValue) => {
                        field.onChange(newValue);
                      }}
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name={`days_details[${index}].work_end_time`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <MobileTimePicker
                      minutesStep="5"
                      label="Work End Time"
                      value={
                        values.days_details[index].work_end_time
                          ? new Date(values.days_details[index].work_end_time)
                          : null
                      }
                      onChange={(newValue) => {
                        field.onChange(newValue);
                      }}
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name={`days_details[${index}].break_start_time`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <MobileTimePicker
                      minutesStep="5"
                      label="Break Start Time"
                      value={
                        values.days_details[index].break_start_time
                          ? new Date(values.days_details[index].break_start_time)
                          : null
                      }
                      onChange={(newValue) => {
                        field.onChange(newValue);
                      }}
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name={`days_details[${index}].break_end_time`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <MobileTimePicker
                      minutesStep="5"
                      label="Break End Time"
                      value={
                        values.days_details[index].break_end_time
                          ? new Date(values.days_details[index].break_end_time)
                          : null
                      }
                      onChange={(newValue) => {
                        field.onChange(newValue);
                      }}
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
                <RHFTextField
                  disabled
                  size="small"
                  name={`days_details[${index}].appointment_number`}
                  label="Appointments Number"
                  InputLabelProps={{ shrink: true }}
                  value={values.days_details[index].appointments.length}
                />
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={0.2}
                  sx={{ justifySelf: { xs: 'flex-end' }, alignSelf: { xs: 'flex-end' } }}
                >
                  <IconButton size="small" onClick={() => processDayDetails(index)}>
                    <Iconify icon="zondicons:refresh" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() =>
                      setShowAppointments({
                        ...showAppointments,
                        [index]: !showAppointments[index],
                      })
                    }
                  >
                    <Iconify icon="tabler:list-details" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleRemove(index)}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Stack>
              </Stack>
              <NewEditDayAppointmentsDetails open={showAppointments[index]} ParentIndex={index} />
            </Stack>
          ))}
        </Stack>

        <Divider sx={{ mt: 3, mb: 1, borderStyle: 'dashed' }} />

        <Stack
          spacing={3}
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-end', md: 'center' }}
        >
          <Button
            size="small"
            color="primary"
            startIcon={<Iconify icon="tdesign:plus" />}
            sx={{ padding: 1 }}
            onClick={handleAdd}
            // sx={{ flexShrink: 0 }}
          >
            Add New Day
          </Button>
        </Stack>
      </Box>
    </>
  );
}
