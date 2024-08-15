import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

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
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service;
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
          <Typography lang='ar' sx={{ color: 'text.secondary' }}>
            {t('For the system to work properly and since you are a new establishment on this platform you must enter some basic information in advance before use.')}
          </Typography>
        ),
      },
      {
        target: '#USDepartmentNav',
        title: t('creating departments'),
        disableBeacon: true,
        content: (
          <Typography lang='ar' sx={{ color: 'text.secondary' }}>
            {t('The first of these is information about the departments that make up your organization - of course, if there are departments in your organization - in order to enable independent management of each department in your organization.')}
          </Typography>
        ),
      },
      {
        target: '#USEmployeesNav',
        title: t('adding employees'),
        disableBeacon: true,
        content: (
          <Typography lang='ar' sx={{ color: 'text.secondary' }}>
            {t('Then you must enter the employee data, either by (1) creating a new employee account or (2) adding/linking an employee who has an account on the platform and linking him to your organization.')}
          </Typography>
        ),
      },
      {
        target: '#USWorkShiftNav',
        title: t('creating work shifts'),
        disableBeacon: true,
        content: (
          <Typography lang='ar' sx={{ color: 'text.secondary' }}>
            {t("After the previous two steps, you must add your organization's work shifts (for example: morning/evening/night). Adding these shift information has organizational benefits for your organization and allows you to make appointment settings more flexible, which later creates appointments in an automated and flexible manner.")}
          </Typography>
        ),
      },
      {
        target: '#USWorkGroupNav',
        title: t('creating work groups'),
        disableBeacon: true,
        content: (
          <Typography lang='ar' sx={{ color: 'text.secondary' }}>
            {t("Next, you must enter the information of the work team/teams in the organization you work for, this information has administrative importance and is necessary to make 'appointment settings for each work team'. Note that creating a 'work group' in the appointment settings will show in the work schedule (calendar) that appointment for each member of the work group in that team (such as in the surgeon's calendar, also that appointment will appear in the calendar and work schedule of an anesthesiologist, and the same applies to the nurse).")}
          </Typography>
        ),
      },
      {
        target: '#USServicesNav',
        title: t('creating services'),
        disableBeacon: true,
        content: (
          <Typography lang='ar' sx={{ color: 'text.secondary' }}>
            {t("We also recommend adding the services you provide in this step in order to improve your experience and facilitate the use of the platform.")}
          </Typography>
        ),
      },
      {
        target: '#USRoomsNav',
        title: t('creating rooms'),
        disableBeacon: true,
        content: (
          <Typography lang='ar' sx={{ color: 'text.secondary' }}>
            {t("We also recommend adding room names - or numbers - to your system in order to organize your organization's management and to later activate the work system in managing daily appointments.")}
          </Typography>
        ),
      },
      {
        target: '#USActivitiesNav',
        title: t('creating activities'),
        disableBeacon: true,
        content: (
          <Typography lang='ar' sx={{ color: 'text.secondary' }}>
            {t("We also recommend adding 'Activities' information to organize the daily and administrative work of your organization.")}
          </Typography>
        ),
      },
      {
        target: '#EMAppointConfigNav',
        title: t('creating appointment configurations'),
        disableBeacon: true,
        content: (
          <Typography lang='ar' sx={{ color: 'text.secondary' }}>
            {t("By doing all the previous steps, you are now ready to use the platform and create a new appointment - you can also do the previous steps together and automatically on this page -")}
          </Typography>
        ),
      },
    ],
  });

  useEffect(() => {
    const createdAtValid =
      user.created_at &&
      new Date(user.created_at).getTime() + 2 * 24 * 60 * 60 * 1000 >= new Date().getTime();
    const shouldShowDialog = !loading && isEmployee && createdAtValid && !user.last_online;
    setDialog(shouldShowDialog);
  }, [user.created_at, user.last_online, loading, isEmployee]);

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
            {String(USData?.country?.code).padStart(3, '0')}-{USData?.city?.sequence_number}-
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
          flexShrink: { lg: 0 },
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
              width: NAV.W_VERTICAL,
              borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}
          >
            {renderContent}
          </Scrollbar>
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
      <CustomPopover
        arrow={curLangAr ? 'right-top' : 'left-top'}
        open={popover.open}
        onClose={popover.onClose}
      >
        <MenuItem
          lang="ar"
          sx={{ fontSize: 13, color: 'secondary.dark' }}
          onClick={() => {
            popover.onClose()
            setRunningTour(true)
            setTimeout(() => {
              walktour.setRun(true)
              setRunningTour(false)
            }, 200)
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
            bottom: { md: 20, xs: 0 },
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

          <TicketPopover
            messagesLength={messages}
            refetchLenght={refetch}
            open={ticketDialog}
            onClose={() => setTicketDialog(false)}
          />
          <StartupCreating open={dialog} onClose={() => setDialog(false)} />
        </Box>
      )}
    </>
  );
}

NavVertical.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};
