import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function TrustStatCard({ icon, value, label }) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  return (
    <Stack
      alignItems="center"
      spacing={0.5}
      sx={{
        p: 2,
        flex: 1,
        minWidth: 110,
        textAlign: 'center',
        borderRadius: 2,
        bgcolor: 'background.neutral',
      }}
    >
      <Iconify icon={icon} width={24} sx={{ color: 'primary.main' }} />
      <Typography variant="h6">{value}</Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
    </Stack>
  );
}

TrustStatCard.propTypes = {
  icon: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.node,
};
