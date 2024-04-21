import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate, useLocales } from 'src/locales';

import Iconify from 'src/components/iconify';

export default function Sidebar() {
  const { t } = useTranslate();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const router = useRouter();
  const gotoHome = () => {
    router.push(paths.dashboard.root);
  };
  const gotoProfile = () => {
    router.push(paths.dashboard.user.profile);
  };
  const gotoSetting = () => {
    router.push(paths.dashboard.user.account);
  };
  const gotoAppointments = () => {
    router.push(paths.dashboard.user.patientsappointments);
  };
  const stickySidebarStyle = {
    display: 'flex',

    zIndex: 1,
    height: '35vh',
    width: 'auto',
    margin: 3,
    position: 'fixed',
    backgroundColor: 'rgba(255, 255, 255, 0.700)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
    ...(curLangAr ? { left: 0 } : { right: 0 }),
    ...(curLangAr ? { borderRadius: '0px 15px 15px 0px' } : { borderRadius: '15px 0px 0px 15px' }),
  };
  const insidestickySidebar = {
    transform: 'translate(2%, 2%)',
  };
  return (
    <Box style={stickySidebarStyle}>
      <Box style={insidestickySidebar}>
        <Button
          sx={{
            width: '9vh',
            display: 'inline',
            '&:hover': {
              bgcolor: 'inherit',
            },
          }}
          onClick={gotoHome}
        >
          <Iconify sx={{ color: 'green', width: '40%', height: '10%' }} icon="cil:home" />
          <Typography sx={{ fontSize: 10.5 }}>{t('Home')}</Typography>
        </Button>

        <Divider />
        <Button
          sx={{
            width: '9vh',
            display: 'inline',
            '&:hover': {
              bgcolor: 'inherit',
            },
          }}
          onClick={gotoAppointments}
        >
          <Iconify
            sx={{ color: 'green', width: '40%', height: '10%' }}
            icon="ph:calendar-duotone"
          />
          <Typography sx={{ fontSize: 10.5 }}>{t('Appointments')}</Typography>
        </Button>
        <Divider />
        <Button
          sx={{
            width: '9vh',
            display: 'inline',
            '&:hover': {
              bgcolor: 'inherit',
            },
          }}
          onClick={gotoProfile}
        >
          <Iconify sx={{ color: 'green', width: '40%', height: '10%' }} icon="gg:profile" />
          <Typography sx={{ fontSize: 10.5 }}>{t('Profile')}</Typography>
        </Button>
        <Divider />
        <Button
          sx={{
            width: '9vh',
            display: 'inline',
            '&:hover': {
              bgcolor: 'inherit',
            },
          }}
        >
          <Iconify
            sx={{ color: 'green', width: '40%', height: '10%' }}
            icon="material-symbols:history"
          />
          <Typography sx={{ fontSize: 10.5 }}>{t('History')}</Typography>
        </Button>
        <Divider />
        <Button
          sx={{
            width: '9vh',
            display: 'inline',
            '&:hover': {
              bgcolor: 'inherit',
            },
          }}
          onClick={gotoSetting}
        >
          <Iconify
            sx={{ color: 'green', width: '40%', height: '10%' }}
            icon="ant-design:setting-outlined"
          />
          <Typography sx={{ fontSize: 10.5 }}>{t('Settings')}</Typography>
        </Button>
      </Box>
    </Box>
  );
}
