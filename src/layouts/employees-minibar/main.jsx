import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import { useResponsive } from 'src/hooks/use-responsive';

// ----------------------------------------------------------------------

export default function Main({ children, sx, ...other }) {
  const lgUp = useResponsive('up', 'lg');
  const path = window.location.pathname;
  const have2nav =
    path.indexOf('/dashboard/us/acl/departments') !== -1 ||
    path.indexOf('/dashboard/us/acl/workgroups') !== -1;
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        // minHeight: 1,
        display: 'flex',
        flexDirection: 'column',
        mt: have2nav ? 0 : `4rem`,
        mr: `4rem`,
        mb: 0,
        pb: 0,
        ...(lgUp && {
          px: 2,
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

Main.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
};
