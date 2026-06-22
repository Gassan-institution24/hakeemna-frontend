import { m, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useLocales, useTranslate } from 'src/locales';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import Scrollbar from 'src/components/scrollbar';

import NavList from './nav-list';

// ----------------------------------------------------------------------

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.055, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ----------------------------------------------------------------------

export default function NavMobile({ data }) {
  const pathname = usePathname();
  const { t, onChangeLang } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [openMenu, setOpenMenu] = useState(false);
  const [signupExpanded, setSignupExpanded] = useState(false);

  const navItems = data?.filter((item) => item.title) || [];
  const bookItem = data?.find((item) => item.button === 'Book Appointment');
  const loginItem = data?.find((item) => item.button === 'Login');
  const joinItems = data?.filter(
    (item) =>
      item.button === 'join as user' ||
      item.button === 'join as unit of service' ||
      item.button === 'join as supplier'
  ) || [];

  useEffect(() => {
    if (openMenu) handleCloseMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpenMenu = useCallback(() => setOpenMenu(true), []);
  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
    setSignupExpanded(false);
  }, []);

  return (
    <>
      {/* Hamburger */}
      <IconButton
        onClick={handleOpenMenu}
        aria-label={t('open navigation menu')}
        sx={{
          p: 1,
          color: '#1F2C5C',
          '&:hover': { bgcolor: 'rgba(60,176,153,0.08)' },
          '&:focus-visible': { outline: '2px solid #3CB099', outlineOffset: 2 },
        }}
      >
        <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" sx={{ width: 22, height: 22 }} />
      </IconButton>

      <Drawer
        open={openMenu}
        onClose={handleCloseMenu}
        anchor={curLangAr ? 'left' : 'right'}
        PaperProps={{
          sx: {
            width: 300,
            borderRadius: curLangAr ? '0 16px 16px 0' : '16px 0 0 16px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          },
        }}
        SlideProps={{ timeout: 280 }}
      >
        {/* Drawer header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2.5,
            py: 2,
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            flexShrink: 0,
          }}
        >
          <Logo sx={{ width: 110, height: 'auto' }} />
          <IconButton
            onClick={handleCloseMenu}
            aria-label={t('close navigation menu')}
            size="small"
            sx={{
              color: '#1F2C5C',
              bgcolor: 'rgba(31,44,92,0.06)',
              '&:hover': { bgcolor: 'rgba(31,44,92,0.12)' },
            }}
          >
            <Iconify icon="mingcute:close-line" width={18} />
          </IconButton>
        </Box>

        {/* Scrollable nav area */}
        <Scrollbar sx={{ flex: 1, overflowY: 'auto' }}>
          {/* Nav links with stagger animation */}
          <AnimatePresence>
            {openMenu && (
              <m.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ paddingTop: 12, paddingBottom: 8 }}
              >
                {navItems.map((item) => (
                  <m.div key={item.title} variants={itemVariants}>
                    <NavList data={item} />
                  </m.div>
                ))}
              </m.div>
            )}
          </AnimatePresence>

          {/* CTA Section */}
          <Divider sx={{ mx: 2.5, borderColor: 'rgba(0,0,0,0.07)' }} />

          <AnimatePresence>
            {openMenu && (
              <m.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ padding: '20px 20px 24px' }}
              >
                {/* Book Appointment */}
                {bookItem && (
                  <m.div variants={itemVariants}>
                    <Button
                      component={RouterLink}
                      href={bookItem.path}
                      fullWidth
                      onClick={handleCloseMenu}
                      sx={{
                        mb: 1.5,
                        bgcolor: '#3CB099',
                        color: '#fff',
                        borderRadius: '12px',
                        py: 1.4,
                        fontWeight: 600,
                        fontSize: 14,
                        textTransform: 'none',
                        letterSpacing: 0.2,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: '#2d9a83',
                          boxShadow: '0 6px 18px rgba(60,176,153,0.35)',
                        },
                      }}
                    >
                      <Iconify icon="streamline:waiting-appointments-calendar" width={18} sx={{ mr: 1 }} />
                      {t('Book Appointment')}
                    </Button>
                  </m.div>
                )}

                {/* Login */}
                {loginItem && (
                  <m.div variants={itemVariants}>
                    <Button
                      component={Link}
                      href={loginItem.path}
                      fullWidth
                      onClick={handleCloseMenu}
                      variant="outlined"
                      sx={{
                        mb: 1.5,
                        borderColor: 'rgba(31,44,92,0.25)',
                        color: '#1F2C5C',
                        borderRadius: '12px',
                        py: 1.4,
                        fontWeight: 600,
                        fontSize: 14,
                        textTransform: 'none',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: '#3CB099',
                          color: '#3CB099',
                          bgcolor: 'rgba(60,176,153,0.05)',
                        },
                      }}
                    >
                      <Iconify icon="material-symbols:login" width={18} sx={{ mr: 1 }} />
                      {t('login')}
                    </Button>
                  </m.div>
                )}

                {/* Sign Up expandable */}
                {joinItems.length > 0 && (
                  <m.div variants={itemVariants}>
                    <Button
                      fullWidth
                      onClick={() => setSignupExpanded((prev) => !prev)}
                      endIcon={
                        <Iconify
                          icon="eva:arrow-ios-downward-fill"
                          width={16}
                          sx={{
                            transition: 'transform 0.2s',
                            transform: signupExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        />
                      }
                      sx={{
                        mb: 1,
                        bgcolor: '#1F2C5C',
                        color: '#fff',
                        borderRadius: '12px',
                        py: 1.4,
                        fontWeight: 600,
                        fontSize: 14,
                        textTransform: 'none',
                        justifyContent: 'space-between',
                        px: 2,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: '#2a3d7a',
                        },
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Iconify icon="mdi:register" width={18} />
                        <span>{t('sign up')}</span>
                      </Stack>
                    </Button>

                    <Collapse in={signupExpanded}>
                      <Stack spacing={0.5} sx={{ pl: 1, mb: 1 }}>
                        {joinItems.map((item) => (
                          <Button
                            key={item.path}
                            component={RouterLink}
                            href={item.path}
                            fullWidth
                            onClick={handleCloseMenu}
                            sx={{
                              justifyContent: 'flex-start',
                              color: '#1F2C5C',
                              fontSize: 13.5,
                              fontWeight: 500,
                              textTransform: 'none',
                              borderRadius: '8px',
                              py: 1,
                              px: 1.5,
                              gap: 1.5,
                              transition: 'all 0.15s',
                              '&:hover': {
                                bgcolor: 'rgba(60,176,153,0.08)',
                                color: '#3CB099',
                              },
                            }}
                          >
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                bgcolor: '#3CB099',
                                flexShrink: 0,
                              }}
                            />
                            {t(item.button)}
                          </Button>
                        ))}
                      </Stack>
                    </Collapse>
                  </m.div>
                )}

                {/* Language toggle */}
                <m.div variants={itemVariants}>
                  <Divider sx={{ my: 1.5, borderColor: 'rgba(0,0,0,0.06)' }} />
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.disabled', display: 'block', mb: 1, px: 0.5 }}
                  >
                    {t('language')}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {['en', 'ar'].map((lang) => {
                      const isCurrent = currentLang.value === lang;
                      return (
                        <Box
                          key={lang}
                          onClick={() => onChangeLang(lang)}
                          sx={{
                            flex: 1,
                            textAlign: 'center',
                            py: 0.9,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: isCurrent ? 600 : 500,
                            border: '1.5px solid',
                            borderColor: isCurrent ? '#3CB099' : 'rgba(0,0,0,0.1)',
                            color: isCurrent ? '#3CB099' : 'text.secondary',
                            bgcolor: isCurrent ? 'rgba(60,176,153,0.06)' : 'transparent',
                            transition: 'all 0.2s',
                            userSelect: 'none',
                          }}
                        >
                          {lang === 'en' ? 'English' : 'عربي'}
                        </Box>
                      );
                    })}
                  </Stack>
                </m.div>
              </m.div>
            )}
          </AnimatePresence>
        </Scrollbar>

        {/* Contact info footer */}
        <Box
          sx={{
            px: 2.5,
            py: 2,
            borderTop: '1px solid rgba(0,0,0,0.06)',
            bgcolor: 'rgba(248,249,251,0.8)',
            flexShrink: 0,
          }}
        >
          <Stack spacing={0.75}>
            <Link
              href="tel:+962780830087"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                color: 'text.secondary',
                fontSize: 12.5,
                transition: 'color 0.2s',
                '&:hover': { color: '#3CB099' },
              }}
            >
              <Iconify icon="ion:call" width={14} sx={{ color: '#3CB099' }} />
              +962 780830087
            </Link>
            <Link
              href="mailto:info@hakeemna.com"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                color: 'text.secondary',
                fontSize: 12.5,
                transition: 'color 0.2s',
                '&:hover': { color: '#3CB099' },
              }}
            >
              <Iconify icon="clarity:email-solid" width={14} sx={{ color: '#3CB099' }} />
              info@hakeemna.com
            </Link>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}

NavMobile.propTypes = {
  data: PropTypes.array,
};
