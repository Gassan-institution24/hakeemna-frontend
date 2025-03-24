import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import { DatePicker } from '@mui/x-date-pickers';
import { Button, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export default function RHFDatePicker({ name, helperText, type, views, ...other }) {
  const { t } = useTranslate();
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <DatePicker
            {...field}
            // fullWidth
            type={type}
            value={field.value ? new Date(field.value) : null}
            views={views}
            onChange={(newValue) => {
              field.onChange(newValue);
            }}
            InputLabelProps={{ shrink: true }}
            slots={{
              actionBar: ({ onClear, onCancel }) => (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    field.onChange(null);
                    onClear();
                  }}
                  sx={{ position: 'absolute', bottom: 0, right: 0, padding: 0.4 }}
                >
                  {t('clear')}
                </Button>
              ),
            }}
            slotProps={{
              actionBar: { actions: ['clear'] },
              textField: {
                fullWidth: true,
                sx: {
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: error ? 'error.main' : '' },
                  },
                },
                ...other,
              },
            }}
            error={!!error}
            helperText={error ? error?.message : helperText}
          />
          {error?.message ? (
            <Typography variant="caption" color="error.main">
              {error.message}
            </Typography>
          ) : (
            ''
          )}
        </div>
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
