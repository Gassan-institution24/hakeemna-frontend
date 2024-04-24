import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import AppointmentBookView from 'src/sections/unit-service/appointments/view/book';

// ----------------------------------------------------------------------

export default function BookAppointmentPage() {
  return (
    <ACLGuard category="unit_service" subcategory="appointments" acl="read">
      <Helmet>
        <title> Book Appointment </title>
        <meta name="description" content="meta" />
      </Helmet>
      {/* {loading && <LoadingScreen />} */}
      <AppointmentBookView />
    </ACLGuard>
  );
}
