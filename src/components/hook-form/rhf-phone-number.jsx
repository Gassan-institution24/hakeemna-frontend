import PropTypes from 'prop-types';
import { MuiTelInput } from 'mui-tel-input';
import { Controller, useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

export default function RHFPhoneNumber({ name, helperText, type, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <MuiTelInput
          {...field}
          fullWidth
          forceCallingCode
          defaultCountry="JO"
          value={field.value}
          onChange={(newPhone) => {
            field.onChange(newPhone);
          }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        />
      )}
    />
  );
}

RHFPhoneNumber.propTypes = {
  helperText: PropTypes.object,
  name: PropTypes.string,
  type: PropTypes.string,
};
