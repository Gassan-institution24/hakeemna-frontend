import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import { Badge, Divider, Tooltip, MenuItem, Typography, IconButton } from '@mui/material';

import { usePathname } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { useAuthContext } from 'src/auth/hooks';
import { useGetUnreadMsgs } from 'src/api/chat';
import { useLocales, useTranslate } from 'src/locales';
import { useAclGuard } from 'src/auth/guard/acl-guard';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { NavSectionVertical } from 'src/components/nav-section';
import Walktour, { useWalktour } from 'src/components/walktour';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import axiosInstance, { endpoints } from 'src/utils/axios';
import { NAV } from '../config-layout';
import TicketPopover from './ticketPopover';
import { useNavData } from './config-navigation';
import StartupCreating from './startup-creating';
import NavToggleButton from '../common/nav-toggle-button';
// ----------------------------------------------------------------------

export default function NavVertical({ openNav, onCloseNav }) {
  const { user, loading } = useAuthContext();

  const pathname = usePathname();

  const lgUp = useResponsive('up', 'lg');

  const navData = useNavData();

  const { t } = useTranslate();

  const popover = usePopover();

  const checkAcl = useAclGuard();

  const { messages, refetch } = useGetUnreadMsgs(user._id);

  const USData =
    user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service;
  const isEmployee = ['employee', 'admin'].includes(user?.role);

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [dialog, setDialog] = useState(false);
  const [runningTour, setRunningTour] = useState(false);

  const [ticketDialog, setTicketDialog] = useState(false);

  // useEffect(() => {
  //   setDialog(!loading && user.role === 'admin' && !user.last_online);
  // }, [user.role, user.last_online, loading]);

  const walktour = useWalktour({
    // defaultRun: !loading && user && !user.last_online && !dialog,
    defaultRun: false,
    showProgress: true,
    steps: [
      {
        target: '#USTablesNav',
        title: t('management tables'),
        disableBeacon: true,
        content: (
          <Typography lang="ar" sx={{ color: 'text.secondary' }}>
            {t(
              'For the system to work properly and since you are a new establishment on this platform you must enter some basic information in advance before use.'
            )}
          </Typography>
        ),
      },
      {
        target: '#USDepartmentNav',
        title: t('departments'),
        disableBeacon: true,
        content: (
          <Typography lang="ar" sx={{ color: 'text.secondary' }}>
            {t(
              'The first of these is information about the departments that make up your organization - of course, if there are departments in your organization - in order to enable independent management of each department in your organization.'
            )}
          </Typography>
        ),
      },
      {
        target: '#USEmployeesNav',
        title: t('employees'),
        disableBeacon: true,
        content: (
          <Typography lang="ar" sx={{ color: 'text.secondary' }}>
            {t(
              'Then you must enter the employee data, either by (1) creating a new employee account or (2) adding/linking an employee who has an account on the platform and linking him to your organization.'
            )}
          </Typography>
        ),
      },
      {
        target: '#USWorkShiftNav',
        title: t('work shifts'),
        disableBeacon: true,
        content: (
          <Typography lang="ar" sx={{ color: 'text.secondary' }}>
            {t(
              "After the previous two steps, you must add your organization's work shifts (for example: morning/evening/night). Adding these shift information has organizational benefits for your organization and allows you to make appointment settings more flexible, which later creates appointments in an automated and flexible manner."
            )}
          </Typography>
        ),
      },
      {
        target: '#USWorkGroupNav',
        title: t('work groups'),
        disableBeacon: true,
        content: (
          <Typography lang="ar" sx={{ color: 'text.secondary' }}>
            {t('It is a team of other doctors involved in providing medical service in the field.')}
            <br />
            <br />
            {t(
              "You must enter the staff information of the organization you work for. This information has administrative importance and is necessary to make 'appointment settings'."
            )}
            <br />
            <br />
            {t('Note: You can add a new team at any time later.')}
          </Typography>
        ),
      },
      {
        target: '#USServicesNav',
        title: t('services and pricing'),
        disableBeacon: true,
        content: (
          <Typography lang="ar" sx={{ color: 'text.secondary' }}>
            {t(
              'At the end of the appointment, the financial part of the platform is activated, which is paying the visit fee and creating an invoice. Here, you must choose the service provided (you choose from the services you added at this stage).'
            )}
            <br />
            <br />
            {t(
              'Example: A check-up at the clinic/consultation at the clinic, and the price of this check-up/consultation is 20 dinars.'
            )}
            <br />
            <br />
            {t('Note: You can add new services at any time later.')}
          </Typography>
        ),
      },
      {
        target: '#USRoomsNav',
        title: t('creating rooms'),
        disableBeacon: true,
        content: (
          <Typography lang="ar" sx={{ color: 'text.secondary' }}>
            {t(
              "We also recommend adding room names - or their numbers/codes - to your system in order to organize your organization's management and later to activate the work system in managing daily appointments."
            )}
            <br />
            <br />
            {t('Example: initial examination room, waiting room...')}
            <br />
            <br />
            {t(
              'You can also later specify in each room what activity is being carried out in it (such as a specialist examination or blood pressure check), and this is useful in organizing the movement of patients between rooms in an automated and organized manner (you can benefit from it in: managing daily appointments).'
            )}
            <br />
            <br />
            {t('Note: You can add new rooms at any time later.')}
          </Typography>
        ),
      },
      {
        target: '#USActivitiesNav',
        title: t('creating activities'),
        disableBeacon: true,
        content: (
          <Typography lang="ar" sx={{ color: 'text.secondary' }}>
            {t(
              'A visit (appointment) at your institution consists of several different activities, for example: clinical examination, accounting...'
            )}
            <br />
            <br />
            {t('These activities are best added to make your daily work easier.')}
            <br />
            <br />
            {t('Note: You can add new activities at any time later.')}
          </Typography>
        ),
      },
      {
        target: '#EMAppointConfigNav',
        title: t('creating appointment configurations'),
        disableBeacon: true,
        content: (
          <Typography lang="ar" sx={{ color: 'text.secondary' }}>
            {t(
              'By doing all the previous steps, you are now ready to use the platform and create a new appointment - you can also do the previous steps together and automatically on this page -'
            )}
          </Typography>
        ),
      },
    ],
  });

  const setLastOnline = useCallback(async () => {
    await axiosInstance.patch(endpoints.auth.user(user._id), { last_online: new Date() })
  }, [user._id]);

  useEffect(() => {
    const createdAtValid =
      user.created_at &&
      new Date(user.created_at).getTime() + 2 * 24 * 60 * 60 * 1000 >= new Date().getTime();
    const shouldShowDialog = !loading && isEmployee && createdAtValid && !user.last_online;
    setDialog(shouldShowDialog);
    setLastOnline()
  }, [user.created_at, user.last_online, loading, isEmployee, setLastOnline]);

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Stack
      sx={{
        height: 1,
        // '& .simplebar-content': {
        //   height: 1,
        //   display: 'flex',
        //   flexDirection: 'column',
        // },
      }}
    >
      {isEmployee && (
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
      )}
      {isEmployee && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            px: 2,
            py: 2,
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
            {String(USData?.country?.code || '').padStart(3, '0')}-{USData?.city?.sequence_number}-
            {USData?.sequence_number}
          </Typography>
        </Tooltip>
      )}

      <NavSectionVertical
        data={navData}
        walktourRun={runningTour || walktour.run}
        slotProps={{
          currentRole: user?.role,
        }}
      />
      <Box sx={{ flexGrow: 1 }} />
      {/* <NavUpgrade /> */}
    </Stack>
  );

  return (
    <>
      <Box
        sx={{
          height: { lg: '100vh' },
          top: { lg: 0 },
          position: { lg: 'sticky' },
          flexShrink: { lg: 0 },
          overflow: 'visible',
          width: { lg: NAV.W_VERTICAL },
          boxShadow: (theme) => theme.customShadows.z8,
        }}
      >
        <NavToggleButton />

        {lgUp ? (
          <Scrollbar
            sx={{
              height: 1,
              position: 'fixed',
              top: 0,
              width: NAV.W_VERTICAL,
              borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}
          >
            {renderContent}
          </Scrollbar>
        ) : (
          <Drawer
            data-test='nav-drawer'
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
      <CustomPopover
        arrow={curLangAr ? 'right-top' : 'left-top'}
        open={popover.open}
        onClose={popover.onClose}
      >
        <MenuItem
          lang="ar"
          sx={{ fontSize: 13, color: 'secondary.dark' }}
          onClick={() => {
            popover.onClose();
            setRunningTour(true);
            setTimeout(() => {
              walktour.setRun(true);
              setRunningTour(false);
            }, 200);
          }}
        >
          {t('walktour for first steps')}
        </MenuItem>
        {checkAcl({
          category: 'unit_service',
          subcategory: 'management_tables',
          acl: 'create',
        }) && (
            <>
              <Divider />
              <MenuItem
                lang="ar"
                sx={{ fontSize: 13, color: 'secondary.dark' }}
                onClick={() => setDialog(true)}
              >
                {t('create first time tables')}
              </MenuItem>
            </>
          )}
      </CustomPopover>
      {user.role !== 'superadmin' && (
        <Box
          sx={{
            position: 'fixed',
            bottom: { md: 20, xs: 40 },
            pb: { md: 0, xs: 2 },
            right: { md: 20, xs: 'auto' },
            left: { md: 'auto', xs: 20 },
            zIndex: 99,
          }}
        >
          <Badge
            badgeContent={messages?.reduce((acc, chat) => acc + chat.messages.length, 0)}
            color="error"
            onClick={() => setTicketDialog(true)}
          >
            <IconButton
              sx={{
                bgcolor: '#22C55E',
                '&:hover': {
                  bgcolor: '#22C55E',
                  border: 'solid 2px #FFAB00',
                },
              }}
            >
              <Iconify
                width={35}
                sx={{
                  m: 0.5,
                  color: 'white',
                }}
                icon="streamline:chat-bubble-oval-smiley-2"
              />
            </IconButton>
          </Badge>

          {ticketDialog && <TicketPopover
            messagesLength={messages}
            refetchLenght={refetch}
            open={ticketDialog}
            onClose={() => setTicketDialog(false)}
          />}
          <StartupCreating
            open={dialog}
            onClose={() => {
              setDialog(false);
              setRunningTour(true);
              setTimeout(() => {
                walktour.setRun(true);
                setRunningTour(false);
              }, 200);
            }}
          />
        </Box>
      )}
    </>
  );
}

NavVertical.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};
