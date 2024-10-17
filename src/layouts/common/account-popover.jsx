import { useEffect } from 'react';
import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

// import { useMockedUser } from 'src/hooks/use-mocked-user';
import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import { varHover } from 'src/components/animate';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import EmployeePatientToggle from './employee-patient-toggel';

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const { user } = useAuthContext();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  // const isSuperAdmin = user.role === 'superadmin';
  const isEmployee = user.role === 'employee' || user.role === 'admin';

  const OPTIONS = [
    {
      label: t('Home'),
      linkTo: '/',
    },
    {
      label: t('Profile'),
      linkTo: isEmployee ? paths.employee.profile.root : paths.dashboard.user.profile,
    },
    {
      label: t('Settings'),
      linkTo: isEmployee ? paths.employee.profile.root : paths.dashboard.user.account,
    },
  ];

  const router = useRouter();

  const { logout } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const popover = usePopover();

  const handleLogout = () => {
    try {
      popover.onClose();
      logout();
      router.replace('/login');
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
    }
  };

  const handleClickItem = (path) => {
    popover.onClose();
    router.push(path);
  };

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('sendUser', user);
    });
    socket.on('checkUsers', () => {
      socket.emit('sendUser', user);
    });
    socket.emit('sendUser', user);
    return () => {
      socket.emit('disconnected');
    };
  }, [user]);

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(popover.open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={isEmployee ? user.employee?.picture : user.patient?.profile_picture}
          alt={user?.userName}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {user?.userName?.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 200, p: 0 }}>
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user.userName}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {OPTIONS.map((option, idx) => (
            <MenuItem lang="ar" key={idx} onClick={() => handleClickItem(option.linkTo)}>
              {option.label}
            </MenuItem>
          ))}

        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />
        {(user?.role === 'admin' ||
          user?.role === 'employee' ||
          (user?.employee && user?.patient)) && <EmployeePatientToggle />}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          lang="ar"
          onClick={handleLogout}
          sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }}
        >
          {t('Logout')}
        </MenuItem>
      </CustomPopover>
    </>
  );
}
