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
        target: '#USRoomsNav',
        title: 'Creating rooms',
        disableBeacon: true,
        content: (
          <Typography sx={{ color: 'text.secondary' }}>
            we recommend to add Rooms names - or numbers - to your system in order to organize your
            unit of service account and to work with entrance management
          </Typography>
        ),
      },
      {
        target: '#USActivitiesNav',
        title: 'Creating activities',
        disableBeacon: true,
        content: (
          <Typography sx={{ color: 'text.secondary' }}>
            creating acticvities allows you to benefit from more features in our system like :
            entrance management
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
      {/* <Logo sx={{ mt: 3, ml: 4, mb: 1 }} /> */}
      {/* <Link
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
      </Link> */}
      <NavSectionVertical
        data={navData}
        walktourRun={walktour.run}
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
          onClick={() => walktour.setRun(true)}
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
