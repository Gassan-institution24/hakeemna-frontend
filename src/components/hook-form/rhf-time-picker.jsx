import PropTypes from 'prop-types';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Controller, useFormContext } from 'react-hook-form';

import { TimePicker } from '@mui/x-date-pickers'; // Import English locale

import { useUnitTime } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function RHFTimePicker({ name, helperText, type,onChange, ...other }) {
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
          ampmInClock
          
          minutesStep="5"
          format="hh:mm a"
          value={myunitTime(field.value)}
          InputLabelProps={{ shrink: true }}
          onChange={(newValue) => {
            const selectedTime = zonedTimeToUtc(
              newValue,
              user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service
                ?.country?.time_zone || Intl.DateTimeFormat().resolvedOptions().timeZone
            );
            field.onChange(selectedTime)
            if (onChange) {
              onChange();
            }
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error ? error?.message : helperText,
            },
          }}
          closeOnSelect
          slots={{
            // toolbar:false,
            actionBar: 'cancel'
          }}
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
