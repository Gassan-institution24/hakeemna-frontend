import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import AppointmentHomeView from 'src/sections/employee/appointments/view/home';
// ----------------------------------------------------------------------

export default function AppointmentsHomePage() {
  return (
    <ACLGuard category="work_group" subcategory="appointments" acl="read">
      <Helmet>
        <title>Appointments</title>
        <meta name="description" content="meta" />
      </Helmet>
      <AppointmentHomeView />
    </ACLGuard>
  );
}
