import PropTypes from 'prop-types';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Controller, useFormContext } from 'react-hook-form';

import { TimePicker, renderTimeViewClock } from '@mui/x-date-pickers'; // Import English locale
import { Button, IconButton, InputAdornment } from '@mui/material';

import { useUnitTime } from 'src/utils/format-time';
import { useTranslate } from 'src/locales';

import { useAuthContext } from 'src/auth/hooks';

import Iconify from '../iconify/iconify';

// ----------------------------------------------------------------------

export default function RHFTimePicker({ name, helperText, type, onChange, ...other }) {
  const { t } = useTranslate()
  const { control } = useFormContext();
  const { user } = useAuthContext();
  const { myunitTime } = useUnitTime();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TimePicker
          {...field}
          fullWidth
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
          // ampmInClock
          slots={{
            actionBar: ({ onClear, onCancel }) => (
              <Button sx={{ position: 'absolute' }} onClick={() => {
                field.onChange(null);
                onClear();
              }}>

                {t('clear')}
              </Button>
            ),
          }}
          minutesStep={5}
          format="hh:mm a"
          value={myunitTime(field.value)}
          InputLabelProps={{ shrink: true }}
          onChange={(newValue) => {
            const selectedTime = zonedTimeToUtc(
              newValue,
              user?.employee?.employee_engagements?.[user?.employee.selected_engagement]
                ?.unit_service?.country?.time_zone || 'Asia/Amman'
            );
            field.onChange(selectedTime);
            if (onChange) {
              onChange();
            }
          }}
          slotProps={{
            clearIcon: <Iconify icon="mingcute:close-line" />,
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error ? error?.message : helperText,
            },
          }}
          closeOnSelect
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        />
      )}
    />
  );
}

RHFTimePicker.propTypes = {
  helperText: PropTypes.object,
  name: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func,
};
