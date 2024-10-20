import PropTypes from 'prop-types';

import { Button, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { useRouter } from 'src/routes/hooks';

import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';
import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { useSettingsContext } from 'src/components/settings';
import { useGetMyLastAttendence } from 'src/api';

import { useBoolean } from 'src/hooks/use-boolean';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { fTime } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { useTranslate } from 'src/locales';
import Searchbar from '../common/searchbar';
import { NAV, HEADER } from '../config-layout';
import AccountPopover from '../common/account-popover';
// import ContactsPopover from '../common/contacts-popover';
import LanguagePopover from '../common/language-popover';
import ServiceUnitPopover from '../common/service-unit-popover';
import NotificationsPopover from '../common/notifications-popover';
import NotificationsPopoverPatient from '../common/notifications-popover/indexPatient';

// ----------------------------------------------------------------------

export default function Header({ onOpenNav }) {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslate()
  const { user } = useAuthContext();
  const settings = useSettingsContext();
  const { attendence, refetch } = useGetMyLastAttendence()
  const parentToken = localStorage.getItem('parentToken');
  const switchBack = () => {
    localStorage.setItem('accessToken', parentToken);
    localStorage.removeItem('parentToken');
    router.push(PATH_AFTER_LOGIN);
    window.location.reload();
  };
  const hasAttendenceToday = new Date(attendence?.date).getFullYear() === new Date().getFullYear() && new Date(attendence?.date).getMonth() === new Date().getMonth() && new Date(attendence?.date).getDay() === new Date().getDay()
  const changingAttendence = usePopover()

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';

  const lgUp = useResponsive('up', 'lg');

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  const offsetTop = offset && !isNavHorizontal;

  const getCoordinates = () => (new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          resolve(coordinates);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }))

  const handleAttendence = async () => {
    try {
      const coordinates = await getCoordinates();
      await axiosInstance.post(endpoints.attendence.all, { coordinates })
      changingAttendence.onClose()
      refetch()
    } catch (e) {
      console.log(e)
    }
  }
  const handleLeave = async () => {
    try {
      await axiosInstance.post(endpoints.attendence.leave)
      changingAttendence.onClose()
      refetch()
    } catch (e) {
      console.log(e)
    }
  }

  const renderContent = (
    <>
      {lgUp && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />}
      {!lgUp && (
        <IconButton onClick={onOpenNav}>
          <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
        </IconButton>
      )}
      <Searchbar />
      {['employee', 'admin'].includes(user?.role) && ((!attendence || attendence?.check_out_time) ?
        (!hasAttendenceToday && <Button variant='contained' color='primary' onClick={changingAttendence.onOpen} sx={{ m: 2 }}>{t("check in")}</Button>) :
        <Button variant='contained' color='warning' onClick={changingAttendence.onOpen} sx={{ m: 2 }}>{t("check out")}</Button>)
      }

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
      <CustomPopover open={changingAttendence.open} onClose={changingAttendence.onClose}>
        <Stack alignItems='center' p={1}>
          <Typography variant='h6'>{fTime(new Date())}</Typography>
          {(!attendence || attendence?.check_out_time) ?
            <Button variant='contained' color='primary' onClick={handleAttendence} sx={{ mt: 2 }}>{t("check in")}</Button> :
            <>
              {!attendence?.leave_end && (attendence?.leave_start ?
                <Button variant='contained' color='error' onClick={handleLeave} sx={{ mt: 2 }}>{t("end leave")}</Button> :
                <Button variant='contained' color='primary' onClick={handleLeave} sx={{ mt: 2 }}>{t("start leave")}</Button>)}
              <Button variant='contained' color='warning' onClick={handleAttendence} sx={{ mt: 2 }}>{t("check out")}</Button>
            </>
          }
        </Stack>
      </CustomPopover>

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
