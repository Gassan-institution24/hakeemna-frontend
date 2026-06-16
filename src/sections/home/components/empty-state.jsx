import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function EmptyState({ icon = 'solar:inbox-line-bold', label, sx }) {
  return (
    <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ py: 5, ...sx }}>
      <Iconify icon={icon} width={40} sx={{ color: 'text.disabled' }} />
      <Typography variant="body2" sx={{ color: 'text.disabled' }}>
        {label}
      </Typography>
    </Stack>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.node,
  sx: PropTypes.object,
};
