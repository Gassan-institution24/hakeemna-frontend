import { Box, Divider, Typography } from '@mui/material';

import { useAuthContext } from 'src/auth/hooks';
import { useGetPatientAppointments } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Currentappoinment from './apointmentscurrent';
import FinishedAppoinment from './apointmentsfinished';

export default function AppointmentData() {
  const { user } = useAuthContext();
  const { appointmentsData,  refetch } = useGetPatientAppointments(user?.patient?._id);
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { t } = useTranslate();

  const pendingAppointments = appointmentsData.filter((info) => info.status === 'pending');

  return (
    <>

      <>
        <Typography variant="h4" sx={{ mb: 5 }}>
          {curLangAr ? 'مواعيدي' : 'My Appointments'}
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { md: '1fr 1fr 1fr', xs: '1fr' },
            gap: 5,
            mb: 2,
          }}
        >
          <Currentappoinment pendingAppointments={pendingAppointments}  refetch={refetch}/>
        </Box>
      </>
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

    </>
  );
}
