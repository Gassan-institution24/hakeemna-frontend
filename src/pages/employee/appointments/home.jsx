import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import AppointmentHomeView from 'src/sections/employee/appointments/view/home';
// ----------------------------------------------------------------------

export default function AppointmentsHomePage() {
  return (
    <ACLGuard hasContent category="employee" subcategory="appointments" acl="read">
      <Helmet>
        <title>Appointments</title>
      </Helmet>
      <AppointmentHomeView />
    </ACLGuard>
  );
}
