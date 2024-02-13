import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AppointmentData from '../appointmentsforpatient';
import PatientsAppointment from '../availableappointments';

// ----------------------------------------------------------------------

export default function UserAppointmentsPage() {
  const { t } = useTranslate();
  const [currentTab, setCurrentTab] = useState('appointmentData');
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const TABS = [
    {
      value: 'appointmentData',
      label: t('My appointments'),
      icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
    },
    {
      value: 'bookappointments',
      label: t('Book appointment'),
      icon: <Iconify icon="solar:user-id-bold" width={24} />,
    },
  ];
  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('Appointments')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('user'), href: paths.dashboard.user.root },
          { name: t('My appointments') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

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
      {currentTab === 'appointmentData' && <AppointmentData />}
      {currentTab === 'bookappointments' && <PatientsAppointment />}
    </Container>
  );
}
