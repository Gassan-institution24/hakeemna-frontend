import * as React from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { Link, Button, Divider, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';

import { useTranslate } from 'src/locales';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

import NavMobile from './nav/mobile';
import NavDesktop from './nav/desktop';
import { HEADER } from '../config-layout';
import { navConfig } from './config-navigation';
import HeaderShadow from '../common/header-shadow';
import Language from '../common/language-home-page';

export default function Header() {
  const mdUp = useResponsive('up', 'lg');
  const smDown = useResponsive('down', 'sm'); // Added for small devices
  const { t } = useTranslate();
  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);
  const router = useRouter();

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
      {/* Top bar with slogan */}
      <Box
        sx={{
          bgcolor: 'white',
          py: 1,
          px: { xs: 2, sm: 5, md: 10 }, // Added responsive padding
          display: 'flex',
          alignItems: 'center',
          textTransform: 'uppercase',
          justifyContent: 'space-between',
          flexDirection: smDown ? 'column' : 'row', // Stack items vertically on small screens
        }}
      >
        <Stack dir="ltr" direction="row" spacing={1} sx={{ flexWrap: smDown ? 'wrap' : 'nowrap' }}>
          <Iconify icon="ion:call" width={15} />
          <Typography dir="ltr" variant="subtitle2" sx={{ fontSize: 13, fontWeight: 500, mx: 1 }}>
            +962 780830087
          </Typography>
          <Iconify icon="clarity:email-solid" width={18} />
          <Typography
            variant="subtitle2"
            sx={{ fontSize: 13, fontWeight: 500, textTransform: 'lowercase', mx: 1 }}
          >
            info@hakeemna.com
          </Typography>
        </Stack>
        {!smDown && (
          <Stack
            dir="ltr"
            direction="row"
            spacing={2}
            sx={{
              gap: 2,
              justifyContent: smDown ? 'center' : 'flex-start', // Center on small devices
              mt: smDown ? 2 : 0, // Add margin on small screens
            }}
          >
            {/* Repeat buttons as necessary */}
            <Link
              href={paths.auth.register}
              sx={{
                bgcolor: 'navy',
                borderRadius: '100%',
                p: '5px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Iconify icon="clarity:email-solid" width={16} sx={{ color: 'white' }} />
            </Link>
            <Link
              href={paths.auth.register}
              sx={{
                bgcolor: 'navy',
                borderRadius: '100%',
                p: '5px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Iconify icon="clarity:email-solid" width={16} sx={{ color: 'white' }} />
            </Link>
            <Link
              href={paths.auth.register}
              sx={{
                bgcolor: 'navy',
                borderRadius: '100%',
                p: '5px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Iconify icon="clarity:email-solid" width={16} sx={{ color: 'white' }} />
            </Link>
            <Link
              href={paths.auth.register}
              sx={{
                bgcolor: 'navy',
                borderRadius: '100%',
                p: '5px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Iconify icon="clarity:email-solid" width={16} sx={{ color: 'white' }} />
            </Link>
            {/* Repeat the above <Link> as needed for additional icons */}
          </Stack>
        )}
      </Box>

      {/* Main header section */}
      <Toolbar sx={{ bgcolor: 'transparent', borderBottom: 1, borderColor: 'divider' }}>
        <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Logo sx={{ width: { xs: 100, sm: 120, md: 120 }, height: 'auto' }} />

          {/* Desktop Navigation */}
          {mdUp && <NavDesktop data={navConfig} />}

          {/* Right Section */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Language />
            <Iconify icon="mdi:cart-outline" width={24} />
          </Stack>

          {/* Mobile Navigation */}
          {!mdUp && <NavMobile data={navConfig} />}
        </Container>
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}
