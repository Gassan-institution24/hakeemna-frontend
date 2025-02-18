import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

export default function Sidebar() {
  const { t } = useTranslate();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const router = useRouter();

  const [hide, setHide] = useState(true);

  const gotoHome = () => {
    router.push(paths.dashboard.user.specialities);
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
  const gotoHistory = () => {
    router.push(paths.dashboard.user.history);
  };
  const stickySidebarStyle = {
    display: 'flex',
    zIndex: 1,
    // height: '35vh',
    width: 'auto',
    margin: 3,
    position: 'fixed',
    backgroundColor: 'rgba(255, 255, 255, 0.700)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
    ...(curLangAr ? { left: 0 } : { right: 0 }),
    ...(curLangAr ? { borderRadius: '0px 15px 15px 0px' } : { borderRadius: '15px 0px 0px 15px' }),
  };
  const hideStyle = { position: 'fixed', ...(curLangAr ? { left: -100 } : { right: -100 }) };
  const insidestickySidebar = {
    transform: 'translate(2%, 2%)',
  };
  let icon
  if (hide) {
    if (curLangAr) {
      icon = 'eva:arrow-ios-forward-fill'
    } else {
      icon = 'eva:arrow-ios-back-fill'
    }
  } else if (curLangAr) {
    icon = 'eva:arrow-ios-back-fill'
  } else {
    icon = 'eva:arrow-ios-forward-fill'
  }
  return (
    <Box style={hide ? hideStyle : stickySidebarStyle}>
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
          <Iconify sx={{ color: 'green', width: '40%', height: '10%' }} icon="icon-park:add-one" />
          <Typography sx={{ fontSize: 10.5 }}>{t('Book')}</Typography>
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
            onClick={gotoHistory}
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
      <IconButton
        sx={{
          position: 'absolute',
          left: hide ? -60 : -28,
          bottom: 10,
          borderRadius: '10px 0px 0px 10px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          boxShadow: '-2px 4px 6px rgba(0, 0, 0, 0.4)',
          p: hide ? 1 : 0.5,
        }}
        onClick={() => setHide((prev) => !prev)}
      >
        <Iconify
          icon={icon}
        />
      </IconButton>
    </Box>
  );
}
