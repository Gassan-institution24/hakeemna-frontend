import sum from 'lodash/sum';
import { useEffect, useCallback } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { inputBaseClasses } from '@mui/material/InputBase';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { fCurrency } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';
import Iconify from 'src/components/iconify';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function NewEditLongHolidays() {
  const { t } = useTranslate();

  const { control, setValue, watch, resetField, getValues } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'long_holidays',
  });

  const values = getValues();

  const handleAdd = () => {
    append({
      start_date: null,
      end_date: null,
      description: '',
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  return (
    <>
      <Divider flexItem sx={{ borderStyle: 'solid' }} />
      <Box sx={{ p: 3 }}>
        <Typography
          variant="p"
          sx={{ color: 'text.secondary', mb: 3, fontWeight: '700', textTransform: 'capitalize' }}
        >
          Long Holidays:
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
              spacing={1.5}
              sx={{ width: { xs: '100%', md: 'auto' } }}
            >
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                sx={{ width: { xs: '100%', md: 'auto' } }}
              >
                <RHFTextField
                  lang="ar"
                  size="small"
                  name={`long_holidays[${index}].description`}
                  label="Description"
                  // sx={{ flex: 2 }}
                />
                <Controller
                  name={`long_holidays[${index}].start_date`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label={t('start date')}
                      // sx={{ flex: 1 }}
                      value={
                        new Date(
                          values.long_holidays[index].start_date
                            ? values.long_holidays[index].start_date
                            : ''
                        )
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
                  name={`long_holidays[${index}].end_date`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label={t('end date')}
                      // sx={{ flex: 1 }}
                      value={
                        new Date(
                          values.long_holidays[index].end_date
                            ? values.long_holidays[index].end_date
                            : ''
                        )
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
                <IconButton
                  size="small"
                  color="error"
                  sx={{ justifySelf: 'flex-end', alignSelf: 'flex-end', width: 35 }}
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
          spacing={1}
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-end', md: 'center' }}
        >
          <Button
            size="small"
            color="primary"
            startIcon={<Iconify icon="tdesign:plus" />}
            sx={{ padding: 1 }}
            onClick={handleAdd}
          >
            Add Long Holiday
          </Button>
        </Stack>
      </Box>
    </>
  );
}
