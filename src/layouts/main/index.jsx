import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';

import { usePathname } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import Footer from './footer';
import Header from './header';

// ----------------------------------------------------------------------

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const homePage = pathname === '/';
  const mdUp = useResponsive('up', 'md');

  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    if (!mdUp) {
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    }
  }, [lastScrollY, mdUp]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY, handleScroll]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
      {/* Toggle header visibility based on scroll direction */}
      {showHeader && <Header />}

      <Box
        component="main"
       
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
