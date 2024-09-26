import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import { Stack, Typography } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';

import Editor from '../editor';

// ----------------------------------------------------------------------

export default function RHFEditor({ name, helperText, label, sx, ...other }) {
  const {
    control,
    watch,
    setValue,
    formState: { isSubmitSuccessful },
  } = useFormContext();

  const values = watch();

  useEffect(() => {
    if (values[name] === '<p><br></p>') {
      setValue(name, '', {
        shouldValidate: !isSubmitSuccessful,
      });
    }
  }, [isSubmitSuccessful, name, setValue, values]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Stack sx={sx}>
          <Typography mb={0.3} textTransform="capitalize" variant="subtitle2">
            {label}
          </Typography>
          <Editor
            id={name}
            value={field.value}
            onChange={field.onChange}
            error={!!error}
            helperText={
              (!!error || helperText) && (
                <FormHelperText error={!!error} sx={{ px: 2 }}>
                  {error ? error?.message : helperText}
                </FormHelperText>
              )
            }
            {...other}
          />
        </Stack>
      )}
    />
  );
}

RHFEditor.propTypes = {
  helperText: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  sx: PropTypes.object,
};
