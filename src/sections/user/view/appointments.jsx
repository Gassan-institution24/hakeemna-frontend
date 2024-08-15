// import { useState, useCallback } from 'react';

// import Tab from '@mui/material/Tab';
// import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

// import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AppointmentData from '../appointments/appointmentsforpatient';
// import PatientsAppointment from '../appointments/availableappointments';
// ----------------------------------------------------------------------

export default function UserAppointmentsPage() {
  const { t } = useTranslate();
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

      <AppointmentData />
    </Container>
  );
}
