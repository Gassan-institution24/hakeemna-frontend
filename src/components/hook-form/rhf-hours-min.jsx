import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import { Stack, TextField, Typography, InputAdornment } from '@mui/material';

import { useTranslate } from 'src/locales';

export default function RHFHoursMins({ name, helperText, label, ...other }) {
  const { control } = useFormContext();
  const { t } = useTranslate();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const totalMins = field.value || 0;
        const hours = Math.floor(totalMins / 60);
        const mins = totalMins % 60;

        const handleHoursChange = (e) => {
          const newHours = parseInt(e.target.value || '0', 10);
          const newValue = newHours * 60 + mins;
          field.onChange(newValue);
        };

        const handleMinutesChange = (e) => {
          const newMins = parseInt(e.target.value || '0', 10);
          const newValue = hours * 60 + newMins;
          field.onChange(newValue);
        };

        return (
          <Stack>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {label}
            </Typography>
            <Stack direction="row" gap={1}>
              <TextField
                size="small"
                value={hours || ''}
                onChange={handleHoursChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{t("hr")}</InputAdornment>,
                }}
                error={!!error}
                helperText={error ? error?.message : helperText}
                {...other}
              />
              <TextField
                size="small"
                value={mins || ''}
                onChange={handleMinutesChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{t("min")}</InputAdornment>,
                }}
                error={!!error}
                helperText={error ? error?.message : helperText}
                {...other}
              />
            </Stack>
          </Stack>
        );
      }}
    />
  );
}

RHFHoursMins.propTypes = {
  helperText: PropTypes.any,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
};
