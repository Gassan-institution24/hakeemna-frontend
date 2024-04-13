import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import { DatePicker } from '@mui/x-date-pickers';

// ----------------------------------------------------------------------

export default function RHFDatePicker({ name, helperText, type, views, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          {...field}
          fullWidth
          type={type}
          value={new Date(field.value)}
          views={views}
          onChange={(newValue) => {
            field.onChange(newValue);
          }}
          InputLabelProps={{ shrink: true }}
          slotProps={{
            textField: {
              fullWidth: true,
              // onClick: () => field.onFocus(),
              ...other,
            },
          }}
          error={!!error}
          helperText={error ? error?.message : helperText}
        />
      )}
    />
  );
}

RHFDatePicker.propTypes = {
  helperText: PropTypes.object,
  name: PropTypes.string,
  type: PropTypes.string,
  views: PropTypes.array,
};
