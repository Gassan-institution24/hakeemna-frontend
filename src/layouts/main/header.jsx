import { m } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';

import { ExpandMore, LanguageOutlined } from '@mui/icons-material';
import {
  Box,
  Fade,
  Link,
  Menu,
  Stack,
  Button,
  AppBar,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useResponsive } from 'src/hooks/use-responsive';

import { useLocales, useTranslate } from 'src/locales';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

import { RouterLink } from 'src/routes/components';
import NavMobile from './nav/mobile';
import NavDesktop from './nav/desktop';
import { navConfig } from './config-navigation';

// ----------------------------------------------------------------------

const SCROLL_THRESHOLD = 10;

const logoVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const navVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const ctaVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, delay: 0.22, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ----------------------------------------------------------------------

export default function Header() {
  const mdUp = useResponsive('up', 'lg');
  const { t, onChangeLang } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [scrolled, setScrolled] = useState(false);
  const [signupAnchor, setSignupAnchor] = useState(null);
  const signupOpen = Boolean(signupAnchor);
  const signupRef = useRef(null);
  const closeTimer = useRef(null);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleSignupEnter = useCallback(() => {
    clearTimeout(closeTimer.current);
    setSignupAnchor(signupRef.current);
  }, []);

  const handleSignupLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setSignupAnchor(null), 120);
  }, []);

  const handleSignupClose = useCallback(() => {
    clearTimeout(closeTimer.current);
    setSignupAnchor(null);
  }, []);

  const handleLangToggle = useCallback(() => {
    onChangeLang(curLangAr ? 'en' : 'ar');
  }, [curLangAr, onChangeLang]);

  return (
    <AppBar
      elevation={0}
      sx={{ top: 0, zIndex: 1200, bgcolor: 'transparent', boxShadow: 'none' }}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: { xs: 64, lg: 88 },
          height: { xs: 64, lg: 88 },
          px: { xs: 2, sm: 3, md: 5, lg: 6 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          bgcolor: scrolled ? 'rgba(255,255,255,0.96)' : '#ffffff',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          boxShadow: scrolled ? '0 2px 32px rgba(0,0,0,0.08)' : 'none',
          transition: 'background 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease',
        }}
      >
        {/* ── Logo + Contact ────────────────────────────────────────── */}
        <m.div
          variants={logoVariants}
          initial="hidden"
          animate="visible"
          style={{ flexShrink: 0 }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column',  }}>
            {/* Logo — standalone, no container */}
            <m.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            >
              <Link
                href="/"
                sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
              >
                <Logo sx={{ width: { xs: 70, lg: 85 }, height: 'auto', mt:{xs: 0, lg: 2.5} }} />
              </Link>
            </m.div>

            {/* Contact strip — visible on desktop only, hidden on scroll */}
            {mdUp && (
              <Stack
                direction={curLangAr ? 'row-reverse' : 'row'}
                spacing={1}
                alignItems="center"
                sx={{
                  opacity: scrolled ? 0 : 1,
                  transform: scrolled ? 'translateY(-3px)' : 'translateY(0)',
                  transition: 'opacity 0.22s ease, transform 0.22s ease',
                  pointerEvents: scrolled ? 'none' : 'auto',
                  mt: 1.5,
                }}
              >
                <Link
                  href="tel:+962780830087"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.4,
                    textDecoration: 'none',
                    color: '#ffffff',
                    fontSize: 12,
                    fontWeight: 500,
                    letterSpacing: 0.1,
                    transition: 'color 0.18s',
                    '&:hover': { color: '#3CB099' },
                  }}
                >
                  <Iconify icon="ion:call" width={11} />
                  {curLangAr ? '780830087 962+' : '+962 780830087'}
                </Link>

                <Box
                  sx={{ width: '1px', height: 10, bgcolor: 'rgba(0,0,0,0.12)', flexShrink: 0 }}
                />

                <Link
                  href="mailto:info@hakeemna.com"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.4,
                    textDecoration: 'none',
                    color: '#ffffff',
                    fontSize: 12,
                    fontWeight: 500,
                    letterSpacing: 0.1,
                    transition: 'color 0.18s',
                    '&:hover': { color: '#3CB099' },
                  }}
                >
                  <Iconify icon="clarity:email-solid" width={11} />
                  info@hakeemna.com
                </Link>
              </Stack>
            )}
          </Box>
        </m.div>

        {/* ── Desktop Nav Links (centered) ──────────────────────────── */}
        {mdUp && (
          <m.div
            variants={navVariants}
            initial="hidden"
            animate="visible"
            style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}
          >
            <Stack
              component="nav"
              role="navigation"
              aria-label={t('main navigation')}
              direction="row"
              spacing={0}
              sx={{
                color: '#374151',
                height: 80,
                alignItems: 'center',
              }}
            >
              <NavDesktop data={navConfig} />
            </Stack>
          </m.div>
        )}

        {/* ── Desktop CTA Group ─────────────────────────────────────── */}
        {mdUp && (
          <m.div
            variants={ctaVariants}
            initial="hidden"
            animate="visible"
            style={{ flexShrink: 0 }}
          >
            <Stack direction="row" spacing={1} alignItems="center">

              {/* Language toggle */}
              <Box
                onClick={handleLangToggle}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleLangToggle()}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  cursor: 'pointer',
                  color: '#6B7280',
                  fontSize: 12.5,
                  fontWeight: 500,
                  px: 1,
                  py: 0.6,
                  borderRadius: '6px',
                  userSelect: 'none',
                  transition: 'all 0.18s ease',
                  '&:hover': { color: '#3CB099', bgcolor: 'rgba(60,176,153,0.06)' },
                  '&:focus-visible': { outline: '2px solid #3CB099', outlineOffset: 2 },
                }}
              >
                <LanguageOutlined sx={{ fontSize: 15 }} />
                <Typography
                  component="span"
                  sx={{ fontSize: 'inherit', fontWeight: 'inherit', lineHeight: 1 }}
                >
                  {curLangAr ? 'EN' : 'عربي'}
                </Typography>
              </Box>

              {/* Thin vertical divider */}
              <Box sx={{ width: '1px', height: 20, bgcolor: 'rgba(0,0,0,0.09)' }} />

              {/* Book Appointment — Primary CTA */}
              <m.div
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <Button
                  component={RouterLink}
                  href={paths?.pages.book}
                  variant="contained"
                  disableElevation
                  sx={{
                    bgcolor: '#3CB099',
                    color: '#fff',
                    borderRadius: '20px',
                    px: 2.25,
                    py: 0.85,
                    fontWeight: 600,
                    fontSize: curLangAr ? 13.5 : 12.5,
                    letterSpacing: 0.3,
                    whiteSpace: 'nowrap',
                    textTransform: 'none',
                    transition: 'background 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      bgcolor: '#2d9a83',
                      boxShadow: '0 6px 20px rgba(60,176,153,0.38)',
                    },
                    '&:focus-visible': { outline: '2px solid #3CB099', outlineOffset: 3 },
                  }}
                >
                  {t('Book Appointment')}
                </Button>
              </m.div>

              {/* Sign Up dropdown */}
              <Box
                ref={signupRef}
                onMouseEnter={handleSignupEnter}
                onMouseLeave={handleSignupLeave}
              >
                <m.div
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <Button
                    aria-controls={signupOpen ? 'signup-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={signupOpen}
                    onClick={handleSignupEnter}
                    endIcon={
                      <ExpandMore
                        sx={{
                          fontSize: '17px !important',
                          transition: 'transform 0.22s ease',
                          transform: signupOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      />
                    }
                    sx={{
                      bgcolor: '#111827',
                      color: '#fff',
                      borderRadius: '20px',
                      px: 2.25,
                      py: 0.85,
                      fontWeight: 600,
                      fontSize: curLangAr ? 13.5 : 12.5,
                      letterSpacing: 0.1,
                      whiteSpace: 'nowrap',
                      textTransform: 'none',
                      transition: 'background 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        bgcolor: '#1f2937',
                        boxShadow: '0 6px 20px rgba(17,24,39,0.22)',
                      },
                      '&:focus-visible': { outline: '2px solid #111827', outlineOffset: 3 },
                    }}
                  >
                    {t('sign up')}
                  </Button>
                </m.div>

                <Menu
                  id="signup-menu"
                  anchorEl={signupAnchor}
                  open={signupOpen}
                  onClose={handleSignupClose}
                  TransitionComponent={Fade}
                  MenuListProps={{
                    onMouseEnter: handleSignupEnter,
                    onMouseLeave: handleSignupLeave,
                    disablePadding: true,
                  }}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      mt: 1,
                      minWidth: 224,
                      borderRadius: '14px',
                      border: '1px solid rgba(0,0,0,0.07)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                      overflow: 'hidden',
                      py: 0.75,
                    },
                  }}
                  transformOrigin={{ horizontal: 'center', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
                >
                  {[
                    {
                      label: t('join as user'),
                      href: paths.auth.register,
                      icon: 'ph:user-circle',
                    },
                    {
                      label: t('join as unit of service'),
                      href: paths.auth.registersu,
                      icon: 'la:hospital-solid',
                    },
                    {
                      label: t('join as supplier'),
                      href: paths.auth.stakeholderRegister,
                      icon: 'mdi:truck-delivery-outline',
                    },
                  ].map(({ label, href, icon }) => (
                    <MenuItem
                      key={href}
                      onClick={handleSignupClose}
                      component={RouterLink}
                      href={href}
                      sx={{
                        px: 2,
                        py: 1.25,
                        gap: 1.5,
                        fontSize: 14,
                        fontWeight: 500,
                        color: '#374151',
                        textDecoration: 'none',
                        transition: 'background 0.15s',
                        '&:hover': { bgcolor: 'rgba(60,176,153,0.07)', color: '#3CB099' },
                      }}
                    >
                      <Iconify icon={icon} width={18} sx={{ color: '#3CB099', flexShrink: 0 }} />
                      {label}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

              {/* Login — ghost */}
              <m.div
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <Button
                  component={RouterLink}
                  href={paths.auth.login}
                  variant="outlined"
                  sx={{
                    borderColor: 'rgba(55,65,81,0.25)',
                    color: '#374151',
                    borderRadius: '20px',
                    px: 2.25,
                    py: 0.8,
                    fontWeight: 600,
                    fontSize: curLangAr ? 13.5 : 12.5,
                    letterSpacing: 0.1,
                    whiteSpace: 'nowrap',
                    textTransform: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#3CB099',
                      color: '#3CB099',
                      bgcolor: 'rgba(60,176,153,0.05)',
                    },
                    '&:focus-visible': { outline: '2px solid #3CB099', outlineOffset: 3 },
                  }}
                >
                  {t('login')}
                </Button>
              </m.div>
            </Stack>
          </m.div>
        )}

        {/* Mobile: hamburger */}
        {!mdUp && <NavMobile data={navConfig} />}
      </Toolbar>

      {/* ── Gradient bottom border ────────────────────────────────── */}
      <Box
        sx={{
          height: '1px',
          background:
            'linear-gradient(to right, transparent 0%, rgba(60,176,153,0.55) 30%, rgba(31,44,92,0.22) 70%, transparent 100%)',
          opacity: scrolled ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
      />
    </AppBar>
  );
}
