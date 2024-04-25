import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
// import { useMockedUser } from 'src/hooks/use-mocked-user';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import {
  Button,
  Divider,
  Tooltip,
  Checkbox,
  MenuItem,
  Typography,
  IconButton,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetUSWorkGroups, useGetUSWorkShifts, useGetUSDepartments } from 'src/api';

// import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import Doclogo from 'src/components/logo/doc.png';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { NavSectionVertical } from 'src/components/nav-section';
import Walktour, { useWalktour } from 'src/components/walktour';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { NAV } from '../config-layout';
import TicketPopover from './ticketPopover';
import { useNavData } from './config-navigation';
// import NavToggleButton from '../common/nav-toggle-button';

// ----------------------------------------------------------------------

export default function NavVertical({ openNav, onCloseNav }) {
  const { user, loading } = useAuthContext();

  const pathname = usePathname();

  const lgUp = useResponsive('up', 'lg');

  const navData = useNavData();

  const { t } = useTranslate();

  const popover = usePopover();

  const USData =
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service;
  const isEmployee = ['employee', 'admin'].includes(user?.role);

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { enqueueSnackbar } = useSnackbar();

  const [dialog, setDialog] = useState(!loading && !user.last_online && user.role === 'admin');
  const [tables, setTables] = useState([]);
  const [ticketDialog, setTicketDialog] = useState(false);

  useEffect(() => {
    setDialog(!loading && user.role === 'admin' && !user.last_online);
  }, [user.role, user.last_online, loading]);

  const { departmentsData } = useGetUSDepartments(USData?._id);
  const { workGroupsData } = useGetUSWorkGroups(USData?._id);
  const { workShiftsData } = useGetUSWorkShifts(USData?._id);

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
          name_arabic: `فريق عمل ${user.employee?.name_arabic}`,
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

  const walktour = useWalktour({
    defaultRun: !loading && user && !user.last_online && !dialog,
    showProgress: true,
    steps: [
      {
        target: '#USDepartmentNav',
        title: 'Creating departments',
        disableBeacon: true,
        content: (
          <Typography sx={{ color: 'text.secondary' }}>
            as a new unit of service you should add new departments - if exist - to seperate every
            department management and services alone
          </Typography>
        ),
      },
      {
        target: '#USEmployeesNav',
        title: 'Adding employees',
        disableBeacon: true,
        content: (
          <Typography sx={{ color: 'text.secondary' }}>
            then you should add new Employees to your unit of service either by adding an employees
            that has an account on our system or creating a new one..
          </Typography>
        ),
      },
      {
        target: '#USWorkShiftNav',
        title: 'Creating work shifts',
        disableBeacon: true,
        content: (
          <Typography sx={{ color: 'text.secondary' }}>
            after that you also should add new work shifts for organization reasons, and to be able
            to add new appointment configuration
          </Typography>
        ),
      },
      {
        target: '#USWorkGroupNav',
        title: 'Creating work groups',
        disableBeacon: true,
        content: (
          <Typography sx={{ color: 'text.secondary' }}>
            then you should add new work groups in order to be able to add new appointment - work
            group: is a term for a group of employees that work together in one appointment - like :
            doctor, secretery, nurse.
          </Typography>
        ),
      },
      {
        target: '#USServicesNav',
        title: 'Creating services',
        disableBeacon: true,
        content: (
          <Typography sx={{ color: 'text.secondary' }}>
            we recommend to add services in this step in order to improve your experiense by adding
            it in appointment configuration to calculate the starter price of the appointment
          </Typography>
        ),
      },
      {
        target: '#EMAppointConfigNav',
        title: 'creating appointment configurations',
        disableBeacon: true,
        content: (
          <Typography sx={{ color: 'text.secondary' }}>
            Now you are ready to create a new appointment configuration - you can also do the
            previous steps all together in this page -
          </Typography>
        ),
      },
    ],
  });

  useEffect(() => {
    if (!user?.last_online) walktour.setRun(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Walktour
        continuous
        showProgress
        showSkipButton
        disableOverlayClose
        steps={walktour.steps}
        run={walktour.run}
        callback={walktour.onCallback}
        getHelpers={walktour.setHelpers}
        // scrollDuration={500}
      />
      {isEmployee && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            px: 2,
            pt: 2,
            color: 'warning.dark',
            mb: -4,
            cursor: 'pointer',
          }}
          onClick={popover.onOpen}
        >
          <Iconify width={23} icon="material-symbols:help-outline" />
        </Box>
      )}
      {isEmployee && (
        <Tooltip title={t('unit of service code')}>
          <Typography variant="caption" alignSelf="center" paddingLeft="4px">
            {String(USData?.country?.code).padStart(3, '0')}-{USData?.city?.sequence_number}-
            {USData?.sequence_number}
          </Typography>
        </Tooltip>
      )}
      {/* <Logo sx={{ mt: 3, ml: 4, mb: 1 }} /> */}
      <Link
        component={RouterLink}
        href={isEmployee ? paths.pages.serviceUnit(USData?._id) : '/'}
        sx={{ display: 'contents' }}
      >
        <Box
          component="div"
          sx={{
            width: { xs: 200, md: 200 },
            height: { xs: 110, md: 120 },
            display: 'inline-flex',
            mt: 3,
            ml: 4,
            mb: 1,
          }}
        >
          <img src={isEmployee ? USData?.company_logo : Doclogo} alt="logo" />
        </Box>
      </Link>
      <NavSectionVertical
        data={navData}
        walktourRun={walktour.run}
        slotProps={{
          currentRole: user?.role,
        }}
      />
      <Box sx={{ flexGrow: 1 }} />
      {/* <NavUpgrade /> */}
    </Scrollbar>
  );

  return (
    <>
      <Box
        sx={{
          flexShrink: { lg: 0 },
          width: { lg: NAV.W_VERTICAL },
          boxShadow: (theme) => theme.customShadows.z8,
        }}
      >
        {/* <NavToggleButton /> */}

        {lgUp ? (
          <Stack
            sx={{
              height: 1,
              position: 'fixed',
              width: NAV.W_VERTICAL,
              borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}
          >
            {renderContent}
          </Stack>
        ) : (
          <Drawer
            open={openNav}
            onClose={onCloseNav}
            PaperProps={{
              sx: {
                width: NAV.W_VERTICAL,
              },
            }}
          >
            {renderContent}
          </Drawer>
        )}
      </Box>
      <ConfirmDialog
        open={dialog}
        onClose={() => setDialog(false)}
        title={t('creating startup data')}
        content={
          <Stack sx={{ p: 1 }}>
            <Typography variant="subtitle2" paddingBottom="5px">
              {t('Select types of data you want me to create')}
            </Typography>

            {USData && (!USData?.employees_number || USData?.employees_number > 3) && (
              <Stack direction="row">
                <Checkbox
                  disabled={departmentsData.length > 0}
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
                {departmentsData.length > 0 && (
                  <Typography
                    sx={{ p: 2, color: 'error.main' }}
                    alignSelf="center"
                    variant="caption"
                  >
                    {t('already created')}
                  </Typography>
                )}
              </Stack>
            )}

            <Stack direction="row">
              <Checkbox
                disabled={workGroupsData.length > 0}
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
              {workGroupsData.length > 0 && (
                <Typography sx={{ p: 2, color: 'error.main' }} alignSelf="center" variant="caption">
                  {t('already created')}
                </Typography>
              )}
            </Stack>

            <Stack direction="row">
              <Checkbox
                disabled={workShiftsData.length > 0}
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
              {workShiftsData.length > 0 && (
                <Typography sx={{ p: 2, color: 'error.main' }} alignSelf="center" variant="caption">
                  {t('already created')}
                </Typography>
              )}
            </Stack>
          </Stack>
        }
        action={
          <Button variant="contained" color="info" onClick={onAcceptCreating}>
            {t('create')}
          </Button>
        }
      />
      <CustomPopover
        arrow={curLangAr ? 'right-top' : 'left-top'}
        open={popover.open}
        onClose={popover.onClose}
      >
        <MenuItem
          lang="ar"
          sx={{ fontSize: 13, color: 'secondary.dark' }}
          onClick={() => walktour.setRun(true)}
        >
          {t('walktour for first steps')}
        </MenuItem>
        <Divider />
        <MenuItem
          lang="ar"
          sx={{ fontSize: 13, color: 'secondary.dark' }}
          onClick={() => setDialog(true)}
        >
          {t('create first time tables')}
        </MenuItem>
      </CustomPopover>
      <Box
        sx={{
          position: 'fixed',
          bottom: { md: 30, sm: 10 },
          right: { md: 30, sm: 10 },
          zIndex: 99,
        }}
      >
        <IconButton onClick={() => setTicketDialog(true)}>
          <Iconify sx={{ color: 'primary.main' }} width="70px" icon="mdi:customer-service" />
        </IconButton>
        <TicketPopover open={ticketDialog} onClose={() => setTicketDialog(false)} />
      </Box>
    </>
  );
}

NavVertical.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};
