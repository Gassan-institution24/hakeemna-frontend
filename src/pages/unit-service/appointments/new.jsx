import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import NewAppointmentsView from 'src/sections/unit-service/appointments/view/new';

// ----------------------------------------------------------------------

export default function AppointmentsNewPage() {
  return (
    <ACLGuard hasContent category="unit_service" subcategory="appointments" acl="create">
      <Helmet>
        <title>New Appointments</title>
        <meta name="description" content="meta" />
      </Helmet>

      <NewAppointmentsView />
    </ACLGuard>
  );
}
