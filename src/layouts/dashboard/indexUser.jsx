import PropTypes from 'prop-types';
import React,{useEffect, useState} from 'react';
import Box from '@mui/material/Box';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import Sidebarmd from 'src/sections/other/sidebarmd';
import SmallSidebar from 'src/sections/other/sidebarsm';
import { useSettingsContext } from 'src/components/settings';

import Main from './main';
import Header from './header';
import NavMini from './nav-mini';
import NavVertical from './nav-vertical';
import NavHorizontal from './nav-horizontal';

// ----------------------------------------------------------------------

export default function UserDashboardLayout({ children }) {
  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');

  const nav = useBoolean();

  const isHorizontal = settings.themeLayout === 'horizontal';

  const isMini = settings.themeLayout === 'mini';

  const renderNavMini = <NavMini />;

  const renderHorizontal = <NavHorizontal />;

  const renderNavVertical = <NavVertical openNav={nav.value} onCloseNav={nav.onFalse} />;
  

    
  const [screenSize, setScreenSize] = useState('');
  
    useEffect(() => {
      // Update screen size on mount and on window resize
      const updateScreenSize = () => {
        if (window.innerWidth < 600) {
          setScreenSize('xs');
        } else if (window.innerWidth >= 600 && window.innerWidth < 1024) {
          setScreenSize('md');
        } else {
          setScreenSize('lg');
        }
      };
  
      updateScreenSize(); // Initial call
      window.addEventListener('resize', updateScreenSize);
  
      // Cleanup event listener on component unmount
      return () => {
        window.removeEventListener('resize', updateScreenSize);
      };
    }, []);
  if (isHorizontal) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        {lgUp ? renderHorizontal : renderNavVertical}

        <Main>{children}</Main>
      </>
    );
  }

  if (isMini) {
    return (
      <>

        <Header onOpenNav={nav.onTrue} />

        <Box
          sx={{
            minHeight: 1,
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
          }}
          >
      
          {lgUp ? renderNavMini : renderNavVertical}

          <Main>{children}</Main>
        </Box>
      </>
    );
  }

  return (
    <>
      <Header onOpenNav={nav.onTrue} />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
        >
       
        {renderNavVertical}

        <Main>{children}
        {screenSize === 'xs' ? <SmallSidebar /> : <Sidebarmd />}

        
        </Main>
       
      </Box>
   
    </>
  );
}

UserDashboardLayout.propTypes = {
  children: PropTypes.node,
};
