import PropTypes from 'prop-types';

import { Box, Stack, Typography } from '@mui/material';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

// The bordered card with an icon-and-title header used by the panels sitting
// under the odontogram.
export default function PanelCard({ icon, title, action, children }) {
  return (
    <Stack
      sx={{
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        backgroundColor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <Iconify icon={icon} width={18} sx={{ color: 'primary.main' }} />
          <Typography variant="subtitle2">{title}</Typography>
        </Stack>

        {action}
      </Stack>

      <Box sx={{ p: 2, flex: 1 }}>{children}</Box>
    </Stack>
  );
}

PanelCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
  action: PropTypes.node,
  children: PropTypes.node,
};
