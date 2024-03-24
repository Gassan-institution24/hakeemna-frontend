import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import { Box, Paper, ButtonBase } from '@mui/material';

// ----------------------------------------------------------------------

export default function RHFSelectCard({ name, helperText, options, type, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box gap={2} display="grid" gridTemplateColumns="repeat(1, 1fr)">
          {options.map((item) => (
            <Paper
              component={ButtonBase}
              variant="outlined"
              key={item._id}
              onClick={() => field.onChange(item._id)}
              sx={{
                px: 2,
                pb: 1,
                borderRadius: 1,
                typography: 'body3',
                flexDirection: 'column',
                ...(item._id === field.value && {
                  borderWidth: 2,
                  borderColor: 'text.primary',
                }),
              }}
              error={!!error}
              helperText={error ? error?.message : helperText}
              {...other}
            >
              <p style={{ fontSize: 15, fontWeight: 600 }}>{item.name_english}</p>
              <div
                style={{
                  width: '100%',
                  paddingTop: 5,
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 12,
                }}
              >
                <span>{item.period_in_months} months</span>
                <span>all backages</span>
              </div>
            </Paper>
          ))}
        </Box>
      )}
    />
  );
}

RHFSelectCard.propTypes = {
  helperText: PropTypes.object,
  options: PropTypes.array,
  name: PropTypes.string,
  type: PropTypes.string,
};
