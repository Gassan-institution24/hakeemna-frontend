import React, { useState } from 'react';

import { ExpandMore } from '@mui/icons-material';
import { Box, Menu, Link, Stack, Button, AppBar, Toolbar, Divider, MenuItem } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';

import { useLocales, useTranslate } from 'src/locales';

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
  const smDown = useResponsive('down', 'sm');
  const { t } = useTranslate();
  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar  sx={{ bgcolor: 'white', boxShadow: 'none', }}>
      {/* Top bar with contact information */}
      <Box
        sx={{
          bgcolor: 'white',
          py: 0.9,
          px: { xs: 2, sm: 5, md: 10 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: smDown ? 'column' : 'row',
          borderBottom: '1px solid rgba(60, 176, 153, 0.26)',
         
        }}
      >
        {/* Left Section */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ justifyContent: smDown ? 'center' : 'flex-start', mb: smDown ? 2 : 0 }}
        >
          <Language />
          <Divider orientation="vertical" flexItem />
          <Link
            href={paths.pages.book}
            sx={{ textDecoration: 'none', color: '#1F2C5C', fontWeight: 500, fontSize: 15 }}
          >
            {t('book appointments now')}
          </Link>
        </Stack>

        {/* Right Section */}
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Iconify icon="ion:call" width={14} sx={{ color: '#1F2C5C' }} />
          <Link
            href="tel:+962780830087"
            sx={{
              fontSize: curLangAr ? 15 : 13,
              fontWeight: 500,
              color: '#1F2C5C',
              textDecoration: 'none',
            }}
          >
            +962 780830087
          </Link>
          <Iconify icon="clarity:email-solid" width={18} sx={{ color: '#1F2C5C' }} />
          <Link
            href="mailto:info@hakeemna.com"
            sx={{
              fontSize: curLangAr ? 15 : 13,
              fontWeight: 500,
              color: '#1F2C5C',
              textDecoration: 'none',
            }}
          >
            info@hakeemna.com
          </Link>
        </Stack>
      </Box>

      {/* Main Header */}
      <Toolbar
        sx={{
          bgcolor: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          px: { xs: 2, md: 5 },
        }}
      >
        {/* Logo */}
        <Logo sx={{ width: 80 }} />

        {/* Desktop Navigation */}
        {mdUp && (
          <Stack
            component="nav"
            direction="row"
            spacing={4}
            sx={{ flexGrow: 1, justifyContent: 'center', color: '#1F2C5C' }}
          >
            <NavDesktop data={navConfig} />
          </Stack>
        )}

        {/* Right Section (Signup/Login) */}
        {!smDown && (
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', ml: 'auto' }}>
            {/* Sign Up Dropdown */}
            <Button
              aria-controls={open ? 'signup-menu' : undefined}
              aria-haspopup="true"
              onClick={handleClick}
              sx={{
                color: '#1F2C5C',
                display: 'flex',
                alignItems: 'center',
                textTransform: 'uppercase',
                fontWeight: 600,
                fontSize: curLangAr ? 15 : 13,
              }}
            >
              {t('sign up')}
              <ExpandMore sx={{ ml: 0.5 }} />
            </Button>
            <Menu id="signup-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={handleClose}>
                <Link
                  href={paths.auth.registersu}
                  sx={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {t('join as unit of service')}
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link
                  href={paths.auth.stakeholderRegister}
                  sx={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {t('join as supplier')}
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href={paths.auth.register} sx={{ textDecoration: 'none', color: 'inherit' }}>
                  {t('join as user')}
                </Link>
              </MenuItem>
            </Menu>

            <Link
              href={paths.auth.login}
              sx={{
                textDecoration: 'none',
                color: '#1F2C5C',
                textTransform: 'uppercase',
                fontWeight: 600,
                fontSize: curLangAr ? 15 : 13,
              }}
            >
              {t('login')}
            </Link>
          </Stack>
        )}

        {/* Mobile Navigation */}
        {!mdUp && <NavMobile data={navConfig} />}
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}
