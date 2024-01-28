import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/system';
import Stack from '@mui/material/Stack';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useCountdownDate } from 'src/hooks/use-countdown';
import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'notistack';
import { Alert, Typography, useMediaQuery } from '@mui/material';
import BookManually from 'src/components/modals/activate-remider';
import Iconify from 'src/components/iconify/iconify';

export default function TimeOutInActive() {
  const { user, logout } = useAuthContext();

  const theme = useTheme();

  let content;

  const { enqueueSnackbar } = useSnackbar();

  const showAlert = useBoolean(true);

  const isXsScreen = useMediaQuery('(max-width:600px)');

  const unitServiceCountdown = useCountdownDate(
    new Date(
      new Date(
        user?.employee?.employee_engagements[
          user.employee.selected_engagement
        ]?.unit_service?.created_at
      ).getTime() +
        3 * 24 * 60 * 60 * 1000
    )
  );

  const userCountDown = useCountdownDate(
    new Date(new Date(user?.created_at).getTime() + 3 * 24 * 60 * 60 * 1000)
  );
  const subscriptionExpired = useCountdownDate(
    new Date(
      user?.employee?.employee_engagements[
        user.employee.selected_engagement
      ]?.unit_service?.subscription_end_date
    )
  );

  useEffect(() => {
    const checkAndLogout = async () => {
      if (
        user.employee?.employee_engagements[user.employee.selected_engagement] &&
        user?.employee?.employee_engagements[user.employee.selected_engagement]?.unit_service
          .status === 'inactive' &&
        new Date(
          user?.employee?.employee_engagements[
            user.employee.selected_engagement
          ]?.unit_service.created_at
        ).getTime() <
          new Date().getTime() - 3 * 24 * 60 * 60 * 1000
      ) {
        console.log('this user is in activate and has to logout');
        try {
          await logout();
        } catch (error) {
          console.error(error);
          enqueueSnackbar('Unable to logout!', { variant: 'error' });
        }
      }
      console.log('user', user);
      if (
        user &&
        user.status === 'inactive' &&
        new Date(user.created_at).getTime() < new Date().getTime() - 3 * 24 * 60 * 60 * 1000
      ) {
        console.log('this user is in activate and has to logout');
        try {
          await logout();
        } catch (error) {
          console.error(error);
          enqueueSnackbar('Unable to logout!', { variant: 'error' });
        }
      }
    };

    checkAndLogout();
  }, [user, logout, enqueueSnackbar]);

  if (
    user.role === 'admin' &&
    user.employee.employee_engagements[user.employee.selected_engagement] &&
    user?.employee?.employee_engagements[user.employee.selected_engagement]?.unit_service.status ===
      'inactive'
  ) {
    const { days, hours, minutes, seconds } = unitServiceCountdown;
    content = (
      <>
        <Alert
          sx={{
            ml: { xs: 1, md: 3 },
            px: 0.6,
            py: 0.3,
            ...(isXsScreen &&
              theme.breakpoints.down('xs') && { '& .MuiAlert-icon': { display: 'none' } }),
          }}
          severity="error"
        >
          <Stack
            direction="row"
            justifyContent="center"
            divider={<Box sx={{ px: 1 }}>:</Box>}
            sx={{ typography: 'body2', pr: 0.5 }}
          >
            <TimeBlock label="Days" value={days} />

            <TimeBlock label="Hours" value={hours} />
            {days < 3 && (
              <Typography sx={{ typography: 'body2' }}>
                Your service unit is about to expired
              </Typography>
            )}

            {/* <TimeBlock label="Minutes" value={minutes} />
  
      <TimeBlock label="Seconds" value={seconds} /> */}
          </Stack>
        </Alert>
        {/* <BookManually open={showAlert.value} onClose={showAlert.onFalse} /> */}
      </>
    );
  } else if (user && user.status === 'inactive') {
    const { days, hours, minutes, seconds } = userCountDown;
    content = (
      <>
        {' '}
        <Alert
          sx={{
            ml: { xs: 1, md: 3 },
            px: 0.6,
            py: 0.3,
            ...(isXsScreen &&
              theme.breakpoints.down('xs') && { '& .MuiAlert-icon': { display: 'none' } }),
          }}
          severity="error"
        >
          <Stack
            direction="row"
            justifyContent="center"
            divider={<Box sx={{ px: 1 }}>:</Box>}
            sx={{ typography: 'body2', pr: 0.5 }}
          >
            <TimeBlock label="Days" value={days} />

            <TimeBlock label="Hours" value={hours} />
            {days < 3 && (
              <Typography sx={{ typography: 'body2' }}>Your account is about to expired</Typography>
            )}

            {/* <TimeBlock label="Minutes" value={minutes} />
  
      <TimeBlock label="Seconds" value={seconds} /> */}
          </Stack>
        </Alert>
        {/* <BookManually open={showAlert.value} onClose={showAlert.onFalse} /> */}
      </>
    );
  } else if (
    user.role === 'admin' &&
    user.employee.employee_engagements[user.employee.selected_engagement] &&
    user?.employee?.employee_engagements[user.employee.selected_engagement]?.unit_service
  ) {
    const { days } = subscriptionExpired;
    content = (
      <>
        {typeof days === 'string' && days > 3 && (
          <>
            <Iconify sx={{ ml: { xs: 1, md: 3 }, mr: 1 }} icon="flat-color-icons:ok" width={22} />
            <Stack
              direction="row"
              justifyContent="center"
              divider={<Box sx={{ px: 1 }}>:</Box>}
              sx={{ typography: 'body2', pr: 0.5 }}
            >
              <TimeBlock label="Days" value={days} />
            </Stack>
          </>
        )}
        {typeof days === 'string' && days < 3 && (
          <Alert
            sx={{
              ml: { xs: 1, md: 3 },
              px: 0.6,
              py: 0.3,
              ...(isXsScreen &&
                theme.breakpoints.down('xs') && { '& .MuiAlert-icon': { display: 'none' } }),
            }}
            severity="error"
          >
            <Stack
              direction="row"
              justifyContent="center"
              divider={<Box sx={{ px: 1 }}>:</Box>}
              sx={{ typography: 'body2', pr: 0.5 }}
            >
              <TimeBlock label="Days" value={days} />
              <Typography sx={{ typography: 'body2' }}>Your account is about to expired</Typography>
            </Stack>
          </Alert>
        )}
      </>
    );
  }
  // } else if (user.role === 'patient') {
  //   const { days, hours, minutes, seconds } = patientExpired;
  //   content = (
  //     <>
  //       {' '}
  //       <Alert sx={{ ml:{xs:1,md:3}, px: 0.6, py: 0.3 }} severity="error">
  //         <Stack
  //           direction="row"
  //           justifyContent="center"
  //           divider={<Box sx={{ px: 1 }}>:</Box>}
  //           sx={{ typography: 'body2', pr: 0.5 }}
  //         >
  //           <TimeBlock label="Days" value={days} />

  //           <TimeBlock label="Hours" value={hours} />
  //           {days < 3 && (
  //             <Typography sx={{ typography: 'body2' }}>Your account is about to expired</Typography>
  //           )}

  //           {/* <TimeBlock label="Minutes" value={minutes} />

  //     <TimeBlock label="Seconds" value={seconds} /> */}
  //         </Stack>
  //       </Alert>
  //       {/* <BookManually open={showAlert.value} onClose={showAlert.onFalse} /> */}
  //     </>
  //   );
  // }
  return content;
}

// -----------------------------------------------------------------------

function TimeBlock({ label, value }) {
  return (
    <div style={{ display: 'flex' }}>
      <Box sx={{ pr: 0.5 }}> {value} </Box>
      <Box sx={{ typography: 'body2', display: { xs: 'none', md: 'inline-block' } }}>{label}</Box>
    </div>
  );
}

TimeBlock.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};
