import sum from 'lodash/sum';
import { format, isValid } from 'date-fns';
import { useEffect, useCallback } from 'react';
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

import { INVOICE_SERVICE_OPTIONS } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';

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

export default function NewEditDayDetails() {
  const { control, setValue, watch, resetField, getValues } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'days_details',
  });

  console.log('fields',fields)
  const values = getValues();

  const handleAdd = () => {
    const defaultItem = {
      day: '',
      work_start_time: null,
      work_end_time: null,
      break_start_time: null,
      break_end_time: null,
    };
    const existingData = values.days_details[values.days_details.length - 1]; // Get the current form values
    const newItem = { ...defaultItem, ...existingData,day:'' };
    append(newItem);
  };

  const handleRemove = (index) => {
    remove(index);
  };

  return (
    <Box sx={{ px: 3, pb: 3 }}>
      <Typography variant="p" sx={{ color: 'text.disabled', mb: 3 }}>
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
            alignItems="flex-start"
            flexWrap="wrap"
            spacing={1.5}
            sx={{ width: { xs: '100%' } }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              sx={{ width: { xs: '100%' } }}
            >
              <RHFSelect size="small" native name={`days_details[${index}].day`} label="Day">
                <option>{null}</option>
                {weekDays
                  .filter(
                    (option) =>
                      !values.weekend.includes(option.value) &&
                      !values.days_details.some(
                        (detail) =>
                          detail.day === option.value && values.days_details[index]?.day !== option.value
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
                    label="Work Start Time"
                    value={values.days_details[index].work_start_time?new Date(values.days_details[index].work_start_time):null}
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
                    label="Work End Time"
                    value={values.days_details[index].work_end_time?new Date(values.days_details[index].work_end_time):null}
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
                    label="Break Start Time"
                    value={values.days_details[index].break_start_time?new Date(values.days_details[index].break_start_time):null}
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
                    label="Break End Time"
                    value={values.days_details[index].break_end_time?new Date(values.days_details[index].break_end_time):null}
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
              <IconButton
                size="small"
                color="error"
                sx={{ justifySelf: { xs: 'flex-end' }, alignSelf: { xs: 'flex-end' }, width: 35 }}
                onClick={() => handleRemove(index)}
              >
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Stack>
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
          Add Item
        </Button>
      </Stack>
    </Box>
  );
}
