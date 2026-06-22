import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import Footer from './footer';
import Header from './header';

// ----------------------------------------------------------------------

export default function MainLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      {/* Offset below the fixed header so content isn't hidden beneath it */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // top bar (40px, desktop only) + main bar (68px) = 108px desktop
          // mobile only has main bar (64px)
          pt: { xs: '65px', lg: '89px' },
        }}
      >
        {children}
      </Box>

      <Footer />
    </Box>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node,
};
