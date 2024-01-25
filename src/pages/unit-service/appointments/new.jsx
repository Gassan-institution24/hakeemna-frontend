import { Helmet } from 'react-helmet-async';
import ACLGuard from 'src/auth/guard/acl-guard';

import NewAppointmentsView from 'src/sections/unit-service/appointments/view/new';

// ----------------------------------------------------------------------

export default function AppointmentsNewPage() {
  return (
    <>
    <ACLGuard hasContent category='appointment' acl='create'>
      <Helmet>
        <title>New Appointments</title>
      </Helmet>

      <NewAppointmentsView />
      </ACLGuard>
    </>
  );
}
