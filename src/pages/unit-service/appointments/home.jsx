import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import AppointmentsHomeView from 'src/sections/unit-service/appointments/view/home';

// ----------------------------------------------------------------------

export default function AppointmentsHomePage() {
  return (
    <ACLGuard hasContent category="unit_service" subcategory="appointments" acl="read">
      <Helmet>
        <title>Appointments</title>
        <meta name="description" content="meta" />
      </Helmet>
      <AppointmentsHomeView />
    </ACLGuard>
  );
}
