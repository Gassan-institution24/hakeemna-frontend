import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import { useResponsive } from 'src/hooks/use-responsive';

// ----------------------------------------------------------------------

export default function Main({ children, sx, ...other }) {
  const lgUp = useResponsive('up', 'lg');
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        // minHeight: 1,
        display: 'flex',
        flexDirection: 'column',
        pt: `2rem`,
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
