import { Helmet } from 'react-helmet-async';

import AppointmentConfigNewView from 'src/sections/unit-service/appointmentsConfiguration/view/new';

// ----------------------------------------------------------------------

export default function AppointmentConfigNewPage() {
  return (
    <>
      <Helmet>
        <title>New Appointment Configurations</title>
      </Helmet>

       <AppointmentConfigNewView />
    </>
  );
}
