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
          dir="ltr"
          forceCallingCode
          defaultCountry="JO"
          placeholder="7 XXXX XXXX"
          value={field.value}
          excludedCountries={['IL']}
          onChange={(newPhone) => {
            const cleanedPhone = newPhone.replace(/\s+/g, '');
            field.onChange(cleanedPhone);
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
