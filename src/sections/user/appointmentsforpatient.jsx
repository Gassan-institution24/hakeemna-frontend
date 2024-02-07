import { Box, Divider, Typography } from '@mui/material';
import { useGetPatientAppointments } from 'src/api/tables';
import { useAuthContext } from 'src/auth/hooks';
import FinishedAppoinment from './apointmentsfinished';
import Currentappoinment from './apointmentscurrent';

export default function AppointmentData() {
  const { user } = useAuthContext();
  const { appointmentsData } = useGetPatientAppointments(user?.patient?._id);

  const pendingAppointments = appointmentsData.filter((info) => info.status === 'pending');
  const finishedAppointments = appointmentsData.filter((info) => info.status === 'finished');
  return (
    <>
      {pendingAppointments ? (
        <>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Appointment for today
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { md: '1fr 1fr 1fr', xs: '1fr' },
              gap: 5,
              mb: 2,
            }}
          >
            <Currentappoinment />
          </Box>
        </>
      ) : (
        ''
      )}

      {finishedAppointments ? (
        <>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 2 }}>
            Finished appoinment
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { md: '1fr 1fr 1fr', xs: '1fr' },
              gap: 5,
              mb: 2,
            }}
          >
            <FinishedAppoinment />
          </Box>
        </>
      ) : (
        ''
      )}
    </>
  );
}
