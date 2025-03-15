import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';

import socket from 'src/socket';
import { bgBlur } from 'src/theme/css';
import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { useSettingsContext } from 'src/components/settings';

import Searchbar from '../common/searchbar';
import { NAV, HEADER } from '../config-layout';
import EmployeeAttendence from './EmployeeAttendence';
import AccountPopover from '../common/account-popover';
import LanguagePopover from '../common/language-popover';
import ServiceUnitPopover from '../common/service-unit-popover';
import NotificationsPopover from '../common/notifications-popover';
import NotificationsPopoverPatient from '../common/notifications-popover/indexPatient';

// ----------------------------------------------------------------------

export default function Header({ onOpenNav }) {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuthContext();
  const settings = useSettingsContext();
  const parentToken = localStorage.getItem('parentToken');
  const switchBack = () => {
    localStorage.setItem('accessToken', parentToken);
    localStorage.removeItem('parentToken');
    router.push(PATH_AFTER_LOGIN);
    window.location.reload();
  };

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';

  const lgUp = useResponsive('up', 'lg');

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  const offsetTop = offset && !isNavHorizontal;

  useEffect(() => {
    socket.on('callUser', ({ userId, from, signal }) => {
      if (user?._id === userId) {
        router.push(`${paths.call}?caller=${from}&signal=${JSON.stringify(signal)}`);
      }
    });
  }, [user?._id, router]);

  const renderContent = (
    <>
      {lgUp && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />}
      {!lgUp && (
        <IconButton data-test="open-nav-button" onClick={onOpenNav}>
          <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
        </IconButton>
      )}
      <Searchbar />
      {['employee', 'admin'].includes(user?.role) && <EmployeeAttendence />}
      {/* {['employee', 'admin'].includes(user?.role) && ((!attendence || attendence?.check_out_time) ?
        (!hasAttendenceToday && <Button variant='contained' color='primary' onClick={changingAttendence.onOpen} sx={{ m: 2 }}>{t("check in")}</Button>) :
        <Button variant='contained' color='warning' onClick={changingAttendence.onOpen} sx={{ m: 2 }}>{t("check out")}</Button>)
      } */}

      {/* <TimeOutInActive /> */}
      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 2 }}
      >
        <ServiceUnitPopover />
        {parentToken ? (
          <Button onClick={switchBack}>
            <Iconify icon="icon-park:back" /> Switch
          </Button>
        ) : (
          ''
        )}
        <LanguagePopover />

        {user?.role === 'patient' ? <NotificationsPopoverPatient /> : <NotificationsPopover />}

        {/* <ContactsPopover /> */}

        {/* <SettingsButton /> */}

        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        // boxShadow: (design) => design.customShadows.z8,
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.W_VERTICAL + 1}px)`,
          height: HEADER.H_DESKTOP,
          ...(offsetTop && {
            height: HEADER.H_DESKTOP_OFFSET,
          }),
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: 'background.default',
            height: HEADER.H_DESKTOP_OFFSET,
            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI + 1}px)`,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
