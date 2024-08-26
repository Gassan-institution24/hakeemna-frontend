import { useState, useCallback } from 'react';

import { Tab, Tabs } from '@mui/material';
import { Box, Container } from '@mui/system';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetPatientCurrentAppointments, useGetPatientFinishedAppointments } from 'src/api';

import Iconify from 'src/components/iconify';

import Currentappoinment from './apointmentscurrent';
import FinishedAppoinment from './apointmentsfinished';

export default function AppointmentData() {
  const { user } = useAuthContext();
  const { appointmentsData, refetch } = useGetPatientCurrentAppointments(user?.patient?._id);
  const { finishedappointmentsData } = useGetPatientFinishedAppointments(user?.patient?._id);
  const { t } = useTranslate();

  const [currentTab, setCurrentTab] = useState('upcoming');
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const pendingAppointments = appointmentsData.filter((info) => info?.finished_or_not === false);

  const finishedAppointments = finishedappointmentsData?.filter(
    (info) =>
      (info.status === 'finished' && info?.started === false) || info?.finished_or_not === true
  );

  const TABS = [
    {
      value: 'upcoming',
      label: t('Upcoming Appointments'),
      icon: <Iconify icon="mingcute:time-line" width={24} />,
    },
    {
      value: 'Finished',
      label: t('Finished appointment'),
      icon: <Iconify icon="ep:finished" width={24} />,
    },
  ];

  return (
    <Container maxWidth="xl">
      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab, idx) => (
          <Tab key={idx} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>
      {currentTab === 'upcoming' && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { md: '1fr 1fr 1fr', xs: '1fr' },
            gap: 5,
            mb: 2,
          }}
        >
          <Currentappoinment pendingAppointments={pendingAppointments} refetch={refetch} />
        </Box>
      )}

      {currentTab === 'Finished' && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { md: '1fr 1fr 1fr', xs: '1fr' },
            gap: 5,
            mb: 2,
          }}
        >
          <FinishedAppoinment finishedAppointments={finishedAppointments} />
        </Box>
      )}
    </Container>
  );
}
