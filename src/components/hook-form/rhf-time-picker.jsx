import PropTypes from 'prop-types';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Controller, useFormContext } from 'react-hook-form';

import { MobileTimePicker } from '@mui/x-date-pickers';

import { useUnitTime } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function RHFTimePicker({ name, helperText, type, ...other }) {
  const { control } = useFormContext();
  const { user } = useAuthContext();
  const { myunitTime } = useUnitTime();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <MobileTimePicker
          {...field}
          fullWidth
          // ampmInClock
          orientation="landscape"
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
            field.onChange(selectedTime);
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error ? error?.message : helperText,
            },
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
};
