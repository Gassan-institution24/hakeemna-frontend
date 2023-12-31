import { Helmet } from 'react-helmet-async';

import AppointmentTypesNewView from 'src/sections/unit-service/tables/appointment-types/view/new';

// ----------------------------------------------------------------------

export default function AppointmentTypesNewPage() {
  return (
    <>
      <Helmet>
        <title>New Appointment Type</title>
      </Helmet>

      <AppointmentTypesNewView />
    </>
  );
}
