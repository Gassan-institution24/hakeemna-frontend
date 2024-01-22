import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useCountdownDate } from 'src/hooks/use-countdown';
import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'notistack';
import { Alert } from '@mui/material';
import BookManually from 'src/components/modals/activate-remider';

export default function TimeOutInActive() {
  const { user, logout } = useAuthContext();

  let content;

  const { enqueueSnackbar } = useSnackbar();

  const showAlert = useBoolean(true);

  const unitServiceCountdown = useCountdownDate(
    new Date(user?.employee_engagement?.unit_service?.created_at).getTime() +
      3 * 24 * 60 * 60 * 1000
  );

  const employeeCountdown = useCountdownDate(
    new Date(user?.employee_engagement?.employee?.created_at).getTime() + 3 * 24 * 60 * 60 * 1000
  );
  const subscriptionExpired = useCountdownDate(
    user?.employee_engagement?.unit_service?.subscription_end_date
  );

  useEffect(() => {
    const checkAndLogout = async () => {
      if (
        user.employee_engagement &&
        user.employee_engagement.unit_service.status === 'inactive' &&
        new Date(user.employee_engagement.unit_service.created_at).getTime() <
          new Date().getTime() - 3 * 24 * 60 * 60 * 1000
      ) {
        try {
          await logout();
        } catch (error) {
          console.error(error);
          enqueueSnackbar('Unable to logout!', { variant: 'error' });
        }
      }

      if (
        user.employee_engagement &&
        user.employee_engagement.employee.status === 'inactive' &&
        new Date(user.employee_engagement.employee.created_at).getTime() <
          new Date().getTime() - 3 * 24 * 60 * 60 * 1000
      ) {
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
    user &&
    user.employee_engagement &&
    user.employee_engagement.unit_service.status === 'inactive'
  ) {
    const { days, hours, minutes, seconds } = unitServiceCountdown;
    content = (
      <>
        <Alert sx={{ ml: 3 }} severity="error">
          <Stack
            direction="row"
            justifyContent="center"
            divider={<Box sx={{ mx: { xs: 1, sm: 1 } }}>:</Box>}
            sx={{ typography: 'body2' }}
          >
            <TimeBlock label="Days" value={days} />

            <TimeBlock label="Hours" value={hours} />

            {/* <TimeBlock label="Minutes" value={minutes} />
  
      <TimeBlock label="Seconds" value={seconds} /> */}
          </Stack>
        </Alert>
        <BookManually open={showAlert.value} onClose={showAlert.onFalse} />
      </>
    );
  } else if (
    user &&
    user.employee_engagement &&
    user.employee_engagement.employee.status === 'inactive'
  ) {
    const { days, hours, minutes, seconds } = employeeCountdown;
    content = (
      <>
        {' '}
        <Alert sx={{ ml: 2 }} severity="error">
          <Stack
            direction="row"
            justifyContent="center"
            divider={<Box>:</Box>}
            sx={{ typography: 'body2' }}
          >
            <TimeBlock label="Days" value={days} />

            <TimeBlock label="Hours" value={hours} />

            {/* <TimeBlock label="Minutes" value={minutes} />
  
      <TimeBlock label="Seconds" value={seconds} /> */}
          </Stack>
        </Alert>
        <BookManually open={showAlert.value} onClose={showAlert.onFalse} />
      </>
    );
  } else if (
    user.role === 'admin' &&
    user.employee_engagement &&
    user.employee_engagement.unit_service
  ) {
    const { days } = subscriptionExpired;
    content = (
      <>
        <Alert sx={{ ml: 2 }}>
          <Stack
            direction="row"
            justifyContent="center"
            divider={<Box>:</Box>}
            sx={{ typography: 'body2' }}
          >
            <TimeBlock label="Days" value={days} />
          </Stack>
        </Alert>
      </>
    );
  }
  return content;
}

// -----------------------------------------------------------------------

function TimeBlock({ label, value }) {
  return (
    <div style={{ display: 'flex' }}>
      <Box sx={{ pr: 0.5 }}> {value} </Box>
      <Box sx={{ typography: 'body2' }}>{label}</Box>
    </div>
  );
}

TimeBlock.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};
