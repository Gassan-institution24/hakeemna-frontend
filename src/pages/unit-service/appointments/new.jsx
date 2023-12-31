import { Helmet } from 'react-helmet-async';

import NewAppointmentsView from 'src/sections/unit-service/appointments/view/new';

// ----------------------------------------------------------------------

export default function AppointmentsNewPage() {
  return (
    <>
      <Helmet>
        <title>New Appointments</title>
      </Helmet>

      <NewAppointmentsView />
    </>
  );
}
