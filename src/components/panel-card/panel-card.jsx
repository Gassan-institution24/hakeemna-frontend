import PropTypes from 'prop-types';

import { Box, Stack, Typography } from '@mui/material';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

// A bordered card with an icon-and-title header. Lighter than a Card with a
// CardHeader, so a grid of them reads as one panel rather than a pile of
// elevated surfaces.
export default function PanelCard({ icon, title, action, children, sx }) {
  return (
    <Stack
      sx={{
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        backgroundColor: 'background.paper',
        overflow: 'hidden',
        ...sx,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
        sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: 0 }}>
          <Iconify icon={icon} width={18} sx={{ color: 'primary.main', flexShrink: 0 }} />
          <Typography variant="subtitle2" noWrap>
            {title}
          </Typography>
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
  sx: PropTypes.object,
};
