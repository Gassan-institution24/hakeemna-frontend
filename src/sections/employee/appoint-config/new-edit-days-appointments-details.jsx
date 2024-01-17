import sum from 'lodash/sum';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { useEffect, useCallback, useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import { inputBaseClasses } from '@mui/material/InputBase';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

import Iconify from 'src/components/iconify';
import { RHFSelect, RHFTextField, RHFMultiSelect } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function NewEditDayAppointmentsDetails({
  ParentIndex,
  open,
  appointmenttypesData,
  serviceTypesData,
  setAppointmentsNum,
}) {
  const { control, setValue, watch, resetField, getValues } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `days_details[${ParentIndex}].appointments`,
  });

  const values = getValues();

  const handleAdd = () => {
    const defaultItem = {
      appointment_type: null,
      start_time: null,
      price: null,
      service_types: [],
    };
    const existingData = values.days_details[ParentIndex].appointments
      ? values.days_details[ParentIndex].appointments[
          values.days_details[ParentIndex].appointments.length - 1
        ]
      : null;
    const start_time = new Date(
      existingData ? existingData.start_time : values.days_details[ParentIndex].work_start_time
    );
    if (existingData) {
      start_time.setMinutes(start_time.getMinutes() + values.appointment_time);
    }

    const newItem = {
      ...defaultItem,
      ...existingData,
      start_time,
    };
    append(newItem);
    setAppointmentsNum((prev) => ({ ...prev, [ParentIndex]: prev[ParentIndex] + 1 }));
  };

  const handleRemove = (index) => {
    remove(index);
    setAppointmentsNum((prev) => ({ ...prev, [ParentIndex]: prev[ParentIndex] - 1 }));
  };

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
  return (
    // <Dialog maxWidth="sm" open={open}>
    <Collapse
      in={open}
      // timeout="auto"
      // unmountOnExit
      sx={{ bgcolor: 'background.neutral' }}
    >
      <Box sx={{ px: 2, pb: 0 }}>
        {values.days_details[ParentIndex].appointments &&
          values.days_details[ParentIndex].appointments.length > 0 && (
            <Typography variant="p" sx={{ color: 'text.disabled', mb: 3, fontSize: 14 }}>
              appointments:
            </Typography>
          )}

        <Stack
          sx={{ mt: 3 }}
          divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />}
          spacing={3}
          alignItems="flex-end"
        >
          {fields.map((item, index) => (
            <Stack
              key={item.id}
              alignItems="center"
              flexWrap="wrap"
              spacing={1.5}
              sx={{ width: '80%' }}
            >
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: '100%' }}>
                <RHFSelect
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  native
                  name={`days_details[${ParentIndex}].appointments[${index}].appointment_type`}
                  label="Appointment Type"
                >
                  {appointmenttypesData?.map((option) => (
                    <MenuItem value={option._id}>{option.name_english}</MenuItem>
                  ))}
                </RHFSelect>

                <Controller
                  name={`days_details[${ParentIndex}].appointments[${index}].start_time`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <MobileTimePicker
                      minutesStep="5"
                      label="Start Time"
                      value={
                        values.days_details[ParentIndex].appointments[index].start_time
                          ? new Date(
                              values.days_details[ParentIndex].appointments[index].start_time
                            )
                          : new Date()
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
                  name={`days_details[${ParentIndex}].appointments[${index}].service_types`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl error={!!error} size="small" sx={{ width: '100%', shrink: true }}>
                      <InputLabel> Service Types </InputLabel>

                      <Select
                        {...field}
                        multiple
                        id={`multiple-days_details[${ParentIndex}].appointments[${index}].service_types`}
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

                      {!!error && <FormHelperText error={!!error}>{error?.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
                {/* <RHFTextField
                  size="small"
                  name={`days_details[${ParentIndex}].appointments[${index}].price`}
                  label="Price"
                  value={overAllPrice}
                  // inputProps={{ min: 5, max: 180, step: 5 }}
                  type="number"
                  InputLabelProps={{ shrink: true }}
                /> */}
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

        <Divider
          sx={{
            mt:
              values.days_details[ParentIndex].appointments &&
              values.days_details[ParentIndex].appointments.length > 0
                ? 3
                : 0,
            mb: 1,
            borderStyle: 'dashed',
          }}
        />

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
            Add Detailed Appointment
          </Button>
        </Stack>
      </Box>
    </Collapse>
    // </Dialog>
  );
}
NewEditDayAppointmentsDetails.propTypes = {
  ParentIndex: PropTypes.number,
  open: PropTypes.bool,
  serviceTypesData: PropTypes.array,
  appointmenttypesData: PropTypes.array,
  setAppointmentsNum: PropTypes.func,
};
