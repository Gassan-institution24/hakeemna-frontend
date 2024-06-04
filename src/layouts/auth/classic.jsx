// import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgGradient } from 'src/theme/css';
import { useTranslate } from 'src/locales';

import Logo from 'src/components/logo';

// import Logpage from 'src/sections/home/images/logpage.png';

import LanguagePopover from '../common/language-popover';

// ----------------------------------------------------------------------

export default function AuthClassicLayout({ children, image, title }) {
  const theme = useTheme();
  const { t } = useTranslate();
  const mdUp = useResponsive('up', 'md');
  // const [isZoomed, setIsZoomed] = useState(false);
  const renderLogo = (
    <Logo
      sx={{
        zIndex: 9,
        position: 'absolute',
        m: { xs: 2, md: 5 },
      }}
    />
  );

  const renderContent = (
    <Stack sx={{ width: { sm: '100vw', md: '100%', lg: '35%' } }}>
      <Stack
        sx={{
          display: { xs: 'flex', sm: 'block' },
          justifyContent: { xs: 'flex-end' },
          alignItems: { xs: 'flex-end' },
        }}
      >
        <LanguagePopover />
      </Stack>
      <Stack
        sx={{
          width: '100%',
          mx: 'auto',
          // my: 'auto',
          maxWidth: 480,
          px: { xs: 2, md: 8 },
          pt: { xs: 10, md: 10 },
          pb: { xs: 5, md: 0 },
        }}
      >
        {children}
      </Stack>
    </Stack>
  );

  const renderSection = (
    <Stack
      flexGrow={1}
      spacing={10}
      alignItems="center"
      justifyContent="center"
      sx={{
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === 'light' ? 0.88 : 0.94
          ),
          imgUrl: '/assets/background/overlay_2.jpg',
        }),
      }}
    >
      <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center' }}>
        {t(title) || 'Hi, Welcome back'}
      </Typography>

      <Box
        component="img"
        alt="auth"
        src={image || '/assets/illustrations/illustration_dashboard.png'}
        sx={
          {
            // maxWidth: {
            //   xs: 480,
            //   lg: 560,
            //   xl: 720,
            // },
            // '&:hover': {
            //   cursor: 'zoom-in',
            // },
            // // Apply zoom effect when isZoomed is true
            // transform: isZoomed ? 'scale(1.2)' : 'scale(1)',
            // transition: 'transform 0.3s ease-in-out',
          }
        }
        // Toggle isZoomed state on mouse enter/leave
        // onMouseEnter={() => setIsZoomed(true)}
        // onMouseLeave={() => setIsZoomed(false)}
      />
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction={mdUp ? 'row' : 'column'}
      sx={{
        minHeight: '100%',
      }}
    >
      {renderLogo}
      {mdUp && renderSection}

      {renderContent}
    </Stack>
  );
}

AuthClassicLayout.propTypes = {
  children: PropTypes.node,
  image: PropTypes.string,
  title: PropTypes.string,
};
