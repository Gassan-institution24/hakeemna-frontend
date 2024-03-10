import {  useState,useCallback } from 'react';

import { Container } from '@mui/system';
import { Tab, Tabs } from '@mui/material';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetPatientAppointments } from 'src/api';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import Currentappoinment from './apointmentscurrent';
import FinishedAppoinment from './apointmentsfinished';

export default function AppointmentData() {
  const { user } = useAuthContext();
  const { appointmentsData, refetch } = useGetPatientAppointments(user?.patient?._id);
  const { t } = useTranslate();
  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('upcoming');
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const pendingAppointments = appointmentsData.filter((info) => info.status === 'pending');
  const TABS = [
    {
      value: 'upcoming',
      label: t('Upcoming Appointments'),
      icon: <Iconify icon="mingcute:time-line" width={24} />,
    },
    {
      value: 'Finished',
      label: t('Finished appoinment'),
      icon: <Iconify icon="ep:finished" width={24} />,
    },
  ];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>
      {currentTab === 'upcoming'  && (
        <Currentappoinment pendingAppointments={pendingAppointments} refetch={refetch} />
      )}

      {currentTab === 'Finished' && <FinishedAppoinment />}
    </Container>

  
  );
}
