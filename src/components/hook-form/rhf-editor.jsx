import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import { Stack, Typography } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';

import { useLocales } from 'src/locales';

import { Editor } from '../editor';

// ----------------------------------------------------------------------

export default function RHFEditor({ name, reset, helperText, label, sx, ...other }) {
  const {
    control,
    watch,
    setValue,
    formState: { isSubmitSuccessful },
  } = useFormContext();

  const values = watch();
  const { currentLang } = useLocales();
  const isRTL = currentLang.value === 'ar';

  useEffect(() => {
    if (
      values[name]?.trim() === '' ||
      values[name] === '<p><br></p>' ||
      values[name] === '<p></p>'
    ) {
      setValue(name, '', { shouldValidate: !isSubmitSuccessful });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful, name, values[name]]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Stack sx={[sx, { textTransform: 'unset' }]}>
          <Typography mb={0.3} textTransform="capitalize" variant="body2">
            {label}
          </Typography>
          <Editor
            id={name}
            value={field.value}
            onChange={field.onChange}
            error={!!error}
            reset={reset}
            sx={{ textAlign: isRTL ? 'right' : '' }}
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
  reset: PropTypes.bool,
};
