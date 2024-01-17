import * as Yup from 'yup';
import sum from 'lodash/sum';
import { format, isValid } from 'date-fns';
import PropTypes from 'prop-types';
import { useEffect, useCallback, useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import { inputBaseClasses } from '@mui/material/InputBase';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

import { fCurrency } from 'src/utils/format-number';
import { useBoolean } from 'src/hooks/use-boolean';
import { useGetAppointmentTypes, useGetUSServiceTypes } from 'src/api/tables';
import { useAuthContext } from 'src/auth/hooks';

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

export default function NewEditDayDetails({ appointTime }) {
  const { control, setValue, watch, resetField, getValues } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'days_details',
  });

  const { user } = useAuthContext();

  const [showAppointments, setShowAppointments] = useState({});
  const [appointmentsNum, setAppointmentsNum] = useState({});
  const { appointmenttypesData } = useGetAppointmentTypes();
  const { serviceTypesData } = useGetUSServiceTypes(user?.unit_service._id);

  const values = getValues();

  const handleAdd = () => {
    const defaultItem = {
      day: '',
      work_start_time: null,
      work_end_time: null,
      break_start_time: null,
      break_end_time: null,
      appointments: [],
      service_types: [],
      appointment_type: null,
    };
    const existingData = values.days_details
      ? values.days_details[values.days_details.length - 1]
      : ''; // Get the current form values
    const newItem = { ...defaultItem, ...existingData, day: '', appointments: [] };
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

  async function processDayDetails(index) {
    const results = [];

    const appointment_time = appointTime || values.appointment_time;
    if (!appointment_time) {
      console.log('no_appointment_time');
      return;
    }
    const calculateMins = (date) => {
      const formatedDate = new Date(date);
      return formatedDate.getHours() * 60 + formatedDate.getMinutes();
    };
    const RemovingMinToDate = (date, mins) => {
      const formatedDate = new Date(date);
      return new Date(formatedDate.getTime() - mins * 60000);
    };

    const item = values.days_details[index];

    let minDay = calculateMinutesDifference(item.work_start_time, item.work_end_time);
    let minBeforeBreak = calculateMinutesDifference(item.work_start_time, item.break_start_time);
    let minAfterBreak = calculateMinutesDifference(item.break_end_time, item.work_end_time);

    const createAppointmentsAll = () => {
      if (minDay >= values.appointment_time) {
        const newStartTime = RemovingMinToDate(item.work_end_time, minDay);
        const duplicated = item.appointments.filter((appoint) => {
          const newTime = calculateMins(newStartTime);
          const existingTime = calculateMins(appoint.start_time);
          return newTime === existingTime;
        })[0];
        if (duplicated) {
          results.push(duplicated);
        } else {
          results.push({
            appointment_type: item.appointment_type || null,
            start_time: newStartTime,
            price: null,
            service_types: item.service_types || [],
          });
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
    const createAppointmentsBefore = () => {
      if (minBeforeBreak >= values.appointment_time) {
        const newStartTime = RemovingMinToDate(item.break_start_time, minBeforeBreak);
        const duplicated = item.appointments.filter((appoint) => {
          const newTime = calculateMins(newStartTime);
          const existingTime = calculateMins(appoint.start_time);
          return newTime === existingTime;
        })[0];
        if (duplicated) {
          results.push(duplicated);
        } else {
          results.push({
            appointment_type: item.appointment_type || null,
            start_time: newStartTime,
            price: null,
            service_types: item.service_types || [],
          });
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
    const createAppointmentsAfter = () => {
      if (minAfterBreak >= values.appointment_time) {
        const newStartTime = RemovingMinToDate(item.work_end_time, minAfterBreak);
        const duplicated = item.appointments.filter((appoint) => {
          const newTime = calculateMins(newStartTime);
          const existingTime = calculateMins(appoint.start_time);
          return newTime === existingTime;
        })[0];
        if (duplicated) {
          results.push(duplicated);
        } else {
          results.push({
            appointment_type: item.appointment_type || null,
            start_time: newStartTime,
            price: null,
            service_types: item.service_types || [],
          });
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

    if (item.break_start_time && item.break_end_time) {
      await createAppointmentsBefore();
      await createAppointmentsAfter();
    } else {
      await createAppointmentsAll();
    }

    setAppointmentsNum({ ...appointmentsNum, [index]: results.length });
    setValue(`days_details[${index}].appointments`, results);
  }

  const renderValues = (selectedIds) => {
    const selectedItems = serviceTypesData?.filter((item) => selectedIds?.includes(item._id));
    const results = [];
    return selectedItems
      ?.map(
        (item) => item.name_english
        // price += item.Price_per_unit || 0
      )
      .join(', ');
    // setOverAllPrice(price)
    // return results.join(', ')
  };
  function appointEstimatedNum(index) {
    const item = values.days_details[index];
    if (item.appointments.length) {
      return item.appointments.length;
    }
    if (item.break_start_time && item.break_end_time) {
      const AppointBefore = Math.floor(
        calculateMinutesDifference(item.work_start_time, item.break_start_time) /
          values.appointment_time
      );
      const AppointAfter = Math.floor(
        calculateMinutesDifference(item.break_end_time, item.work_end_time) /
          values.appointment_time
      );
      return AppointBefore + AppointAfter || 0;
    }
    return (
      Math.floor(
        calculateMinutesDifference(item.work_start_time, item.work_end_time) /
          values.appointment_time
      ) || 0
    );
  }

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
                <Stack
                  direction={{ xs: 'column', md: 'column' }}
                  spacing={2}
                  sx={{ width: '100%', mt: 2 }}
                >
                  <RHFSelect size="small" native name={`days_details[${index}].day`} label="Day">
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
                        <MenuItem value={option.value}>{option.label}</MenuItem>
                      ))}
                  </RHFSelect>
                  <RHFTextField
                    disabled
                    size="small"
                    name={`days_details[${index}].appointment_number`}
                    label="Appointments Number"
                    InputLabelProps={{ shrink: true }}
                    value={appointmentsNum[index] || appointEstimatedNum(index)}
                  />
                </Stack>
                <Stack
                  direction={{ xs: 'column', md: 'column' }}
                  spacing={2}
                  sx={{ width: '100%', mt: 2 }}
                >
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
                </Stack>
                <Stack
                  direction={{ xs: 'column', md: 'column' }}
                  spacing={2}
                  sx={{ width: '100%', mt: 2 }}
                >
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
                </Stack>
                <Stack
                  direction={{ xs: 'column', md: 'column' }}
                  spacing={2}
                  sx={{ width: '100%', mt: 2 }}
                >
                  <RHFSelect
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    native
                    name={`days_details[${index}].appointment_type`}
                    label="Appointment Type"
                  >
                    {appointmenttypesData?.map((option) => (
                      <MenuItem value={option._id}>{option.name_english}</MenuItem>
                    ))}
                  </RHFSelect>
                  <Controller
                    name={`days_details[${index}].service_types`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl
                        error={!!error}
                        size="small"
                        sx={{ width: '100%', shrink: true }}
                      >
                        <InputLabel> Service Types </InputLabel>

                        <Select
                          {...field}
                          multiple
                          id={`multiple-days_details[${index}].service_types`}
                          label="Service Types"
                          renderValue={renderValues}
                        >
                          {serviceTypesData?.map((option) => {
                            const selected = field?.value?.includes(option._id);

                            return (
                              <MenuItem key={option._id} value={option._id}>
                                <Checkbox size="small" disableRipple checked={selected} />

                                {option.name_english}
                              </MenuItem>
                            );
                          })}
                        </Select>

                        {!!error && (
                          <FormHelperText error={!!error}>{error?.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Stack>
                <Stack
                  direction={{ xs: 'column', md: 'column' }}
                  spacing={0.2}
                  sx={{ justifySelf: { xs: 'flex-end' }, alignSelf: { xs: 'flex-end' } }}
                >
                  <IconButton size="small" color="error" onClick={() => handleRemove(index)}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
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
                </Stack>
              </Stack>
              <NewEditDayAppointmentsDetails
                setAppointmentsNum={setAppointmentsNum}
                serviceTypesData={serviceTypesData}
                appointmenttypesData={appointmenttypesData}
                open={showAppointments[index]}
                ParentIndex={index}
              />
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
NewEditDayDetails.propTypes = {
  appointTime: PropTypes.number,
};
