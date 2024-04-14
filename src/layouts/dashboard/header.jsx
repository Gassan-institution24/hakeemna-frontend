import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { Button, Checkbox, Typography } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { bgBlur } from 'src/theme/css';
import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';
import { useLocales, useTranslate } from 'src/locales';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';

import Searchbar from '../common/searchbar';
import { NAV, HEADER } from '../config-layout';
import AccountPopover from '../common/account-popover';
// import ContactsPopover from '../common/contacts-popover';
import LanguagePopover from '../common/language-popover';
import ServiceUnitPopover from '../common/service-unit-popover';
import NotificationsPopover from '../common/notifications-popover';
import EmployeePatientToggle from '../common/employee-patient-toggel';
import NotificationsPopoverPatient from '../common/notifications-popover/indexPatient';

// ----------------------------------------------------------------------

export default function Header({ onOpenNav }) {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuthContext();
  const settings = useSettingsContext();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [dialog, setDialog] = useState(user.role === 'admin' && !user.last_online);
  const [tables, setTables] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const USData =
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service;

  const parentToken = sessionStorage.getItem('parentToken');
  const switchBack = () => {
    sessionStorage.setItem('accessToken', parentToken);
    sessionStorage.removeItem('parentToken');
    router.push(PATH_AFTER_LOGIN);
    window.location.reload();
  };

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';

  const lgUp = useResponsive('up', 'lg');

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  const offsetTop = offset && !isNavHorizontal;

  const onAcceptCreating = () => {
    try {
      if (tables.includes('department')) {
        axiosInstance.post(endpoints.departments.all, {
          unit_service: USData?._id,
          name_english: 'main department',
          name_arabic: 'القسم الرئيسي',
        });
      }
      if (tables.includes('work shift')) {
        const start_time = new Date();
        start_time.setHours(8, 0, 0, 0);
        const end_time = new Date();
        end_time.setHours(15, 0, 0, 0);
        axiosInstance.post(endpoints.work_shifts.all, {
          unit_service: USData?._id,
          start_time,
          end_time,
          name_english: 'morning work shift',
          name_arabic: 'وردية عمل صباحية',
        });
      }
      if (tables.includes('work group')) {
        axiosInstance.post(endpoints.work_groups.all, {
          unit_service: USData?._id,
          employees: [
            user?.employee?.employee_engagements[user?.employee.selected_engagement]?._id,
          ],
          name_english: `${user.employee?.name_english} work group`,
          name_arabic: `${user.employee?.name_arabic} وردية عمل`,
        });
      }
      window.location.reload();
      setDialog(false);
    } catch (error) {
      enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
        variant: 'error',
      });
      setDialog(false);
    }
  };

  const renderContent = (
    <>
      {lgUp && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />}
      {!lgUp && (
        <IconButton onClick={onOpenNav}>
          <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
        </IconButton>
      )}
      <Searchbar />
      {(user.role === 'admin' || user.role === 'employee' || (user.employee && user.patient)) && (
        <EmployeePatientToggle />
      )}

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
    <>
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
      <ConfirmDialog
        open={dialog}
        onClose={() => setDialog(false)}
        title={t('creating startup data')}
        content={
          <>
            <Typography variant="subtitle1" paddingBottom="5px">
              {t('Select types of data you want me to create')}
            </Typography>

            {USData && (!USData?.employees_number || USData?.employees_number > 3) && (
              <Stack direction="row">
                <Checkbox
                  checked={tables.includes('department')}
                  onChange={() =>
                    tables.includes('department')
                      ? setTables(tables.filter((one) => one !== 'department'))
                      : setTables((prev) => [...prev, 'department'])
                  }
                />
                <Typography variant="subtitle2" alignSelf="center">
                  {t('department')}
                </Typography>
              </Stack>
            )}

            <Stack direction="row">
              <Checkbox
                checked={tables.includes('work group')}
                onChange={() =>
                  tables.includes('work group')
                    ? setTables(tables.filter((one) => one !== 'work group'))
                    : setTables((prev) => [...prev, 'work group'])
                }
              />
              <Typography variant="subtitle2" alignSelf="center">
                {t('work group')}
              </Typography>
            </Stack>

            <Stack direction="row">
              <Checkbox
                checked={tables.includes('work shift')}
                onChange={() =>
                  tables.includes('work shift')
                    ? setTables(tables.filter((one) => one !== 'work shift'))
                    : setTables((prev) => [...prev, 'work shift'])
                }
              />
              <Typography variant="subtitle2" alignSelf="center">
                {t('work shift')}
              </Typography>
            </Stack>
          </>
        }
        action={
          <Button variant="contained" color="info" onClick={onAcceptCreating}>
            {t('create')}
          </Button>
        }
      />
    </>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
