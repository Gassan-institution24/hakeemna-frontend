import { useEffect } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';
// import { useMockedUser } from 'src/hooks/use-mocked-user';

import { Typography } from '@mui/material';

import { useAuthContext } from 'src/auth/hooks';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { NavSectionVertical } from 'src/components/nav-section';
import Walktour, { useWalktour } from 'src/components/walktour';

import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';
// import NavToggleButton from '../common/nav-toggle-button';

// ----------------------------------------------------------------------

export default function NavVertical({ openNav, onCloseNav }) {
  const { user } = useAuthContext();

  const pathname = usePathname();

  const lgUp = useResponsive('up', 'lg');

  const navData = useNavData();

  const USLogo =
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service?.country;

  const walktour = useWalktour({
    defaultRun: user && !user.last_online,
    showProgress: true,
    steps: [
      {
        target: '#USDepartmentNav',
        title: 'Step 1',
        disableBeacon: true,
        content: (
          <Typography sx={{ color: 'text.secondary' }}>
            as a new service unit you should add new departments - if exist - to seperate every
            department management and services alone
          </Typography>
        ),
      },
      {
        target: '#USEmployeesNav',
        title: 'Step 2',
        disableBeacon: true,
        content: (
          <Typography sx={{ color: 'text.secondary' }}>
            then you should add new Employees to your service unit either by adding an employees
            that has an account on our system or creating a new one..
          </Typography>
        ),
      },
      {
        target: '#USWorkShiftNav',
        title: 'Step 4',
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
        title: 'Step 3',
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
        title: 'Step 5',
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
        title: 'Step 6',
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

  // useEffect(() => {
  //   if (!user?.last_online) walktour.setRun(true);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user]);

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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          px: 2,
          pt: 2,
          color: 'text.disabled',
          mb: -4,
          cursor: 'pointer',
        }}
        onClick={() => walktour.setRun(true)}
      >
        <Iconify width={23} icon="material-symbols:help-outline" />
      </Box>
      <Logo sx={{ mt: 3, ml: 4, mb: 1 }} />
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
  );
}

NavVertical.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};
