import { Box, Divider, Typography } from '@mui/material';

import { useAuthContext } from 'src/auth/hooks';
import { useGetPatientAppointments } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Currentappoinment from './apointmentscurrent';
import FinishedAppoinment from './apointmentsfinished';

export default function AppointmentData() {
  const { user } = useAuthContext();
  const { appointmentsData } = useGetPatientAppointments(user?.patient?._id);
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { t } = useTranslate();

  // const pendingAppointments = appointmentsData.filter((info) => info.status === 'pending');

  return (
    <>
      {/* {pendingAppointments.lenght > 0 ? ( */}
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
          <Currentappoinment pendingAppointments={appointmentsData} />
        </Box>
      </>
      {/* ) : ( */}
      {/* <Typography variant="h4" sx={{ mb: 2 }}>
          {curLangAr ? 'لا يوجد لديك مواعيد اليوم' : ' No appointment for today'}
        </Typography> */}
      {/* )} */}

      {/* {finishedAppointments ? ( */}
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
      {/* ) : ( */}
      {/* '' */}
      {/* )} */}
    </>
  );
}
