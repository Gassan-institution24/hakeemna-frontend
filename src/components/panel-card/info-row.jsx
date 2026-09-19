import PropTypes from 'prop-types';

import { Stack, Typography } from '@mui/material';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

// A label/value pair. Renders nothing at all when there is no value, so a sparse
// record shows a short clean card instead of a column of dashes.
//
// `dir` is for values that must not follow the page: a phone number stays LTR
// even in Arabic, or its country code jumps to the wrong end.
//
// `preserveCase` opts a value out of the app-wide capitalize (set inline on the
// root div in app.jsx). Prose reads better capitalized; an email or a URL does
// not -- "Dolaht9@Gmail.Com" is wrong, and for a link it can look like a
// different address.
export default function InfoRow({ label, value, icon, dir, preserveCase }) {
  if (value === null || value === undefined || value === '' || value === false) return null;

  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      justifyContent="space-between"
      gap={2}
      sx={{ py: 0.85 }}
    >
      <Stack direction="row" alignItems="center" gap={1} sx={{ flexShrink: 0 }}>
        {icon && <Iconify icon={icon} width={15} sx={{ color: 'text.disabled' }} />}
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Stack>

      <Typography
        variant="body2"
        dir={dir}
        fontWeight={600}
        sx={{
          textAlign: 'end',
          wordBreak: 'break-word',
          ...(preserveCase && { textTransform: 'none' }),
        }}
      >
        {value === true ? '✓' : value}
      </Typography>
    </Stack>
  );
}

InfoRow.propTypes = {
  label: PropTypes.node,
  // Anything renderable — callers pass strings, numbers, booleans and Labels.
  // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.any,
  icon: PropTypes.string,
  dir: PropTypes.oneOf(['ltr', 'rtl']),
  preserveCase: PropTypes.bool,
};
