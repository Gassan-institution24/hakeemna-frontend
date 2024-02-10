import { Box, Divider, Typography } from '@mui/material';
import { useGetPatientAppointments } from 'src/api';
import { useTranslate, useLocales } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import FinishedAppoinment from './apointmentsfinished';
import Currentappoinment from './apointmentscurrent';

export default function AppointmentData() {
  const { user } = useAuthContext();
  const { appointmentsData } = useGetPatientAppointments(user?.patient?._id);
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { t } = useTranslate();
  const pendingAppointments = appointmentsData.filter((info) => info.status === 'pending');
  const finishedAppointments = appointmentsData.filter((info) => info.status === 'finished');
  return (
    <>
      {pendingAppointments.lenght > 0 ? (
        <>
          <Typography variant="h4" sx={{ mb: 2 }}>
            {curLangAr ? 'مواعيد لليوم' : 'Appointment for today'}
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
        <Typography variant="h4" sx={{ mb: 2 }}>
          {curLangAr ? 'لا يوجد لديك مواعيد اليوم' : ' No appointment for today'}
        </Typography>
      )}

      {finishedAppointments ? (
        <>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 2 }}>
            {t('Finished appoinment')}
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
