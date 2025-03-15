import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { Link, Button, Divider, Typography, Menu, MenuItem, IconButton } from '@mui/material';

import { paths } from 'src/routes/paths';
import { ExpandMore } from '@mui/icons-material';
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
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
      {/* Top bar with contact information */}
      <Box
        sx={{
          bgcolor: 'white',
          py: 1,
          px: { xs: 2, sm: 5, md: 10 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: smDown ? 'column' : 'row',
          borderBottom: '1px solid #3CB099', // Changed to gray for divider
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: smDown ? 'center' : 'flex-start',
            mt: smDown ? 2 : 0,
          }}
        >
          {/* Language dropdown */}
          <Language />
          {/* Booking link */}
          <Divider orientation="vertical" sx={{ borderColor: 'gray', height: 20 }} /> {/* Vertical gray divider */}
          <Link href={paths.booking} sx={{ textDecoration: 'none', color: '#1F2C5C' }}>
            {t('book appointments now')}
          </Link>
        </Stack>
        <Stack dir="ltr" direction="row" spacing={1} sx={{ flexWrap: smDown ? 'wrap' : 'nowrap' }}>
          <Iconify icon="ion:call" width={14} sx={{ color: '#1F2C5C' }} />
          <Typography dir="ltr" variant="subtitle2" sx={{ fontSize: 13, fontWeight: 500, color: '#1F2C5C' }}>
            +962 780830087
          </Typography>
          <Iconify icon="clarity:email-solid" width={18} sx={{ color: '#1F2C5C' }} />
          <Typography
            variant="subtitle2"
            sx={{ fontSize: 13, fontWeight: 500, textTransform: 'lowercase', color: '#1F2C5C' }}
          >
            info@hakeemna.com
          </Typography>
        </Stack>
      </Box>

      {/* Main header section */}
      <Toolbar sx={{ bgcolor: 'white' }}>
        {/* Logo - Aligned left */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Logo sx={{ width: { xs: 100, sm: 120, md: 100 }, height: 'auto' }} />
        </Box>

        <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Desktop Navigation */}
          {mdUp && (
            <Stack component="nav" direction="row" spacing={4} sx={{ ml: 20 }}>
              <NavDesktop data={navConfig} />{' '}
            </Stack>
          )}

          {/* Right Section */}
          <Stack direction="row" spacing={2} sx={{ ml: 'auto', alignItems: 'center' }}>
            {/* Sign Up Dropdown */}
            <Button
              aria-controls={open ? 'signup-menu' : undefined}
              aria-haspopup="true"
              onClick={handleClick}
              sx={{ py: 0.2, px: 1.5, display: 'flex', alignItems: 'center' }}
            >
              {t('إنشاء حساب')}
              <IconButton size="small" sx={{ ml: 1 }}>
                <ExpandMore />
              </IconButton>
            </Button>
            <Menu id="signup-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={handleClose}>
                <Link href={paths.auth.registersu} sx={{ textDecoration: 'none' }}>
                  {t('انضم كوحدة خدمة')}
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href={paths.auth.stakeholderRegister} sx={{ textDecoration: 'none' }}>
                  {t('انضم كمورد')}
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href={paths.auth.register} sx={{ textDecoration: 'none' }}>
                  {t('انضم كمستخدم')}
                </Link>
              </MenuItem>
            </Menu>

            {/* Login Link */}
            <Link href={paths.auth.login} sx={{ py: 0.2, px: 1.5, color: '#1F2C5C' }}>
              {t('تسجيل الدخول')}
            </Link>
          </Stack>
          {/* Mobile Navigation */}
          {!mdUp && <NavMobile data={navConfig} />}
        </Container>
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}
